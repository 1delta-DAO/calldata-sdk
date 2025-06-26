import { Address, encodePacked, Hex } from 'viem'
import {
  swapHead,
  attachBranch,
  DexPayConfig,
  encodeWrapperSwap,
  WrapOperation,
  PermitIds,
  encodePermit,
  encodePermit2TransferFrom,
  encodeTransferIn,
  encodeExternalCall,
  encodeSweep,
  SweepType,
  encodeApprove,
  DexTypeMappings,
} from '@1delta/calldatalib'
import { ChainIdLike, SerializedPool, SerializedTrade } from '@1delta/type-sdk'
import { EVMCallParams, TradeType, getComposerAddress, packCommands } from '..'
import {
  CurrencyUtils,
  getAdjustedHopCount,
  getSplits,
  getWethAddress,
  isPreFundableDex,
  minimumAmountOutFromTrade,
  needsUnwrap,
  needsWrap,
  supportsNativeToken,
} from '../../utils'
import { SwapEncoder } from './dexCoder'
import { ExternalCallParams, SpotCalldataParams } from './types'

function encodeSwap(
  trade: SerializedTrade,
  pool: SerializedPool,
  receiver: Address,
  hopIndex: number,
  splitIndex: number,
  payConfig: DexPayConfig,
  fot = false,
  permit2 = false
): Hex {
  const path = trade.swaps[splitIndex].route.path
  const tokenOut = path[hopIndex + 1] ? (path[hopIndex + 1].address as Address) : trade.outputAmount.currency.address

  const poolSpecificData = SwapEncoder.encodeSwapCall(pool.swapParams, {
    // for fot, we override the pay config when using permit2
    payConfig: fot && permit2 ? 1 : payConfig
  })

  return encodePacked(
    ['address', 'address', 'uint8', 'address', 'bytes'],
    [
      tokenOut as Address,
      receiver,
      // override dex for FOT to Uniswap V2 type
      fot ? DexTypeMappings.UNISWAP_V2_FOT_ID : pool.swapParams.dexId,
      pool.address as Address,
      poolSpecificData as Hex
    ],
  )
}

function processTrade(
  trade: SerializedTrade,
  slippageTolerance: string,
  receiver: Address,
  composerAddress: Address,
  chainId: ChainIdLike,
  isWrapRequired = false,
  isUnwrapRequired = false,
  isFunded = false,
  fot = false,
  permit2 = false // only for FOT
): Hex {
  if (!trade) throw new Error('No trade to process')
  if (CurrencyUtils.isNativeAmount(trade.inputAmount) && CurrencyUtils.isNativeAmount(trade.outputAmount)) {
    throw new Error('Native in and out')
  }

  const numSplits = trade.swaps.length
  const splitData = getSplits(
    CurrencyUtils.getAmount(trade.inputAmount),
    trade.swaps.map((swap) => BigInt(swap.inputAmount.amount)),
  )

  // Create swap head
  let swapCalldata: Hex = swapHead(
    CurrencyUtils.getAmount(trade.inputAmount),
    CurrencyUtils.getAmount(minimumAmountOutFromTrade(trade, slippageTolerance, TradeType.EXACT_INPUT)),
    trade.inputAmount.currency.address as Address, //
  )

  // check if a wrap is required as the first branch
  if (isWrapRequired) {
    /*
     * for this, we modify the path to be (1,0), the first branch is the native wrapping
     * the next branch will be the swaps
     *
     *  (1,0)  <- Head row with 2 hops
     *    │
     *    ├── (0,0)  <- First hop: Wrap operation
     *    │    └── [Wrap Native Token]
     *    │
     *    └── (0,n-1)  <- Second hop: Will contain all swap operations, n splits
     *         └── [Swaps Structure]
     *             ├── (m-1,0) <- Split 1, m hops
     *             │   ├── Hop 1
     *             │   ├── Hop 2
     *             │   └── ...
     *             ├── (r-1,0) <- Split 2, r hops
     *             │   ├── Hop 1
     *             │   ├── Hop 2
     *             │   └── ...
     *             └── ...
     */
    swapCalldata = attachBranch(swapCalldata, 1n, 0n, '0x') // this adds the second branch
    swapCalldata = attachBranch(swapCalldata, 0n, 0n, '0x')
    swapCalldata = encodeWrapperSwap(
      swapCalldata,
      getWethAddress(chainId),
      composerAddress, // receiver is self in this case
      WrapOperation.NATIVE,
      DexPayConfig.PRE_FUND, // this is ignored as native always needs to be in the contract
    )
  }
  // check if unwrap is required as the last branch
  if (isUnwrapRequired) {
    /*
     * for this, we modify the path to be (1,0), the first branch is the swap (with possible splits and then multi-hops)
     * the next branch will be the unwrap
     *
     * (1,0)  <- Head row with 2 hops
     *   │
     *   ├── (0,n-1)  <- First hop: All swap operations - n splits
     *   │    └── [Swaps Structure]
     *   │        ├── (m-1,0) <- Split 1, m hops
     *   │        │   ├── Hop 1
     *   │        │   ├── Hop 2
     *   │        │   └── ...
     *   │        ├── (r-1,0) <- Split 2, r hops
     *   │        │   ├── Hop 1
     *   │        │   ├── Hop 2
     *   │        │   └── ...
     *   │        └── ...
     *   │
     *   └── (0,0)  <- Second hop: Unwrap operation
     *        └── [Unwrap Native Token]
     */
    swapCalldata = attachBranch(swapCalldata, 1n, 0n, '0x') // this adds the second branch
  }

  // add splits branch
  // initially we only add the split data, then process each split in a row
  if (numSplits > 1) {
    swapCalldata = attachBranch(swapCalldata, 0n, BigInt(numSplits - 1), splitData)
  }

  // Process each split
  for (let splitIndex = 0; splitIndex < numSplits; splitIndex++) {
    const swap = trade.swaps[splitIndex]
    const numHops = swap.route.pools.length
    const adjustedHops = getAdjustedHopCount(swap, numHops)

    // only for wraps in between the hops (not for first hop)
    if (adjustedHops > 1) {
      swapCalldata = attachBranch(swapCalldata, BigInt(adjustedHops - 1), 0n, '0x')
    }

    let lastReceiver = '0x'
    // Process each hop in the split
    for (let hopIndex = 0; hopIndex < numHops; hopIndex++) {
      const pool = swap.route.pools[hopIndex]
      const currentToken = swap.route.path[hopIndex]
      const isFirstHop = hopIndex === 0
      const isLastHop = hopIndex === numHops - 1

      // should never happen

      // Handle native token wrapping if needed (not for first hop)
      if (hopIndex > 0 && CurrencyUtils.isNative(currentToken) && !supportsNativeToken(pool.protocol)) {
        const wrapReceiver = isPreFundableDex(pool.protocol) ? (pool.address as Address) : composerAddress
        swapCalldata = attachBranch(swapCalldata, 0n, 0n, '0x')
        swapCalldata = encodeWrapperSwap(
          swapCalldata,
          currentToken.address as Address,
          wrapReceiver,
          WrapOperation.NATIVE,
          isFirstHop && !isFunded ? DexPayConfig.CALLER_PAYS : DexPayConfig.CONTRACT_PAYS, // if it is the first hop then caller pays, otherwise contract pays
        )
      }

      // Determine receiver for this hop
      let hopReceiver: Address
      if (!isLastHop && swap.route.pools[hopIndex + 1] && isPreFundableDex(swap.route.pools[hopIndex + 1].protocol)) {
        hopReceiver = swap.route.pools[hopIndex + 1].address as Address
      } else if (!isLastHop) {
        hopReceiver = composerAddress
      } else if (CurrencyUtils.isNativeAmount(trade.outputAmount)) {
        hopReceiver = composerAddress
      } else {
        hopReceiver = receiver
      }
      // Encode the swap
      swapCalldata = attachBranch(swapCalldata, 0n, 0n, '0x')
      swapCalldata += encodeSwap(
        trade,
        pool,
        hopReceiver,
        hopIndex,
        splitIndex,
        // the payer is based on
        // 1) beginning -> caller pays if no wrap
        // rest -> pre-fund based on last receiver, contract otherwise
        isFirstHop && !isWrapRequired && !isFunded
          ? DexPayConfig.CALLER_PAYS
          : lastReceiver === pool.address
            ? DexPayConfig.PRE_FUND
            : DexPayConfig.CONTRACT_PAYS,
        isFirstHop && fot,
        permit2
      ).slice(2)
      // update last receiver
      lastReceiver = hopReceiver
    }
  }

  return swapCalldata
}

export namespace ComposerSpot {
  /** Create data for call forwarder - add an optional approve call to it and psotCalldata (e.g. exit sweep) */
  export function encodeExternalCallForCallForwarder(
    params: ExternalCallParams,
    approvalData?: { token: string; target: string },
    postCalldata = '0x',
  ): Hex {
    const { target, calldata, value = '0', useSelfBalance = false, callForwarder } = params

    let additionalCalldata = '0x'
    if (approvalData) {
      additionalCalldata = encodeApprove(approvalData.token as Address, approvalData.target as Address)
    }

    return encodeExternalCall(
      // call callForwarder
      callForwarder,
      value as any,
      useSelfBalance,
      packCommands([
        additionalCalldata, // approve if needed
        encodeExternalCall(target, BigInt(value), useSelfBalance, calldata as Hex), // call to aggregator
        postCalldata, // whatever is needed afterwards on the forwarder level
      ]),
    )
  }

  export function createSweepCalldata(tokenAddress: Address, receiver: Address): Hex {
    return encodeSweep(tokenAddress, receiver, 0n, SweepType.VALIDATE)
  }

  /** Trade with 1delta path or external aggregator */
  export function composeSpotCalldata(params: SpotCalldataParams): EVMCallParams {
    const { trade, slippageTolerance, receiver, skipFunding = false } = params
    const chainId = trade.inputAmount.currency.chainId

    // optionally override composer
    const composerAddress = params.composer ?? getComposerAddress(chainId)

    // Case 1delta
    if (trade.interfaceTrade) {

      let swapCalldata: Hex = '0x'
      let permitCalldata: Hex = '0x'
      let transferCalldata: Hex = '0x'

      // skip funding if flagged
      if (!skipFunding) {
        const inAddress = trade.inputAmount.currency.address as Address
        if (params.permitData) {
          if (CurrencyUtils.isNativeAmount(trade.inputAmount)) throw new Error('Cannot permit native')
          // attach permit
          permitCalldata = encodePermit(BigInt(PermitIds.TOKEN_PERMIT), inAddress, params.permitData.data as any)
          if (params.permitData.isPermit2 && !params.fotInput) {
            // attach permit2 transfer
            // Important: the swap is now configured so that the contract pays
            transferCalldata = encodePermit2TransferFrom(inAddress, composerAddress, BigInt(trade.inputAmount.amount))
          }
        }
      }

      let isUnwrapRequired = needsUnwrap(trade.interfaceTrade, chainId)
      // wrap if input is native
      let isWrapRequired = needsWrap(trade.interfaceTrade, chainId)
      // process the trade and create swap path calldata
      swapCalldata = processTrade(
        trade.interfaceTrade,
        slippageTolerance,
        receiver,
        composerAddress,
        chainId,
        isWrapRequired,
        isUnwrapRequired,
        // we assume that the swap is funded in case we use permit2 or explicitly 
        // parameterize it like that
        params.permitData?.isPermit2 || skipFunding,
        params.fotInput,
        params.permitData?.isPermit2
      )

      if (isUnwrapRequired) {
        swapCalldata = attachBranch(swapCalldata, 0n, 0n, '0x')
        swapCalldata = encodeWrapperSwap(
          swapCalldata,
          trade.outputAmount.currency.address as Address,
          receiver,
          WrapOperation.NATIVE,
          DexPayConfig.CONTRACT_PAYS,
        )
      }

      return {
        calldata: packCommands([permitCalldata, transferCalldata, swapCalldata]) as Hex,
        value: CurrencyUtils.isNativeAmount(trade.inputAmount) ? CurrencyUtils.getAmount(trade.inputAmount) : 0n,
      }
    }
    // case external aggregator
    else {
      return handleExternalAggregator(params)
    }
  }

  function handleExternalAggregator(params: SpotCalldataParams): EVMCallParams {
    // require calldata
    if (!params.externalCall) throw new Error('External call data required')
    const { trade, receiver, skipFunding = false } = params
    const { inputAmount } = trade

    // Transfer to call forwarder
    let transferCalldata: Hex = '0x'
    let permitCalldata: Hex = '0x'
    /** Difference to 1delta case - we need to always transfer manually to the call forwarder */
    if (!CurrencyUtils.isNativeAmount(inputAmount)) {
      // skip funding if the forwarder already has the amount  
      if (!skipFunding) {
        // case permits given
        if (params.permitData) {
          // attack token permit
          permitCalldata = encodePermit(
            BigInt(PermitIds.TOKEN_PERMIT),
            inputAmount.currency.address as Address,
            params.permitData.data as Hex,
          )
          // for permit2, add permit2-based transfer if no FOT input
          if (params.permitData.isPermit2) {
            transferCalldata = encodePermit2TransferFrom(
              inputAmount.currency.address as Address,
              params.externalCall.callForwarder,
              BigInt(inputAmount.amount),
            )
          } else {
            // otherwise ERC20 standard transfer
            transferCalldata = encodeTransferIn(
              inputAmount.currency.address as Address,
              params.externalCall.callForwarder,
              BigInt(inputAmount.amount),
            )
          }
        } else {
          // plain transfer assuming the caller approved the contract (not recommended)
          transferCalldata = encodeTransferIn(
            inputAmount.currency.address as Address,
            params.externalCall.callForwarder,
            BigInt(inputAmount.amount),
          )
        }
      }
    } else {
      if (params.permitData) throw new Error('Cannot permit native')
    }

    // define approval data if any
    let approvalData: any = undefined
    if (trade.approvalTarget && !CurrencyUtils.isNative(trade.inputAmount.currency)) {
      approvalData = {
        token: trade.inputAmount.currency.address,
        target: trade.approvalTarget,
      }
    }

    // define sweep data if desired
    let sweepOutputCalldata: Hex = '0x'
    if (trade.sweepToReceiver) {
      // Sweep output to receiver
      sweepOutputCalldata = createSweepCalldata(trade.outputAmount.currency.address as Address, receiver)
    }

    // Encode external aggregator call
    let externalCalldata = encodeExternalCallForCallForwarder(params.externalCall, approvalData, sweepOutputCalldata)

    // Sweep input (if any)
    const sweepInputCalldata = createSweepCalldata(inputAmount.currency.address as Address, receiver)


    const combinedCalldata = packCommands([
      permitCalldata,
      transferCalldata,
      externalCalldata,
      sweepInputCalldata,
    ])

    return {
      calldata: combinedCalldata,
      value: CurrencyUtils.isNativeAmount(inputAmount) ? CurrencyUtils.getAmount(inputAmount) : 0n,
    }
  }
}

export * from './types'
