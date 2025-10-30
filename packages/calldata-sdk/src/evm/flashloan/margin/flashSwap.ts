import { Address, encodePacked, Hex } from 'viem'
import {
  swapHead,
  attachBranch,
  DexPayConfig,
  encodeSweep,
  SweepType,
} from '@1delta/calldatalib'
import {
  ChainIdLike,
  SerializedCurrencyAmount,
  SerializedPool,
  SerializedSwapStep,
  SerializedTrade
} from '@1delta/type-sdk'
import {
  MarginData,
  PRE_FUNDABLE_DEXES,
  TradeType,
  getComposerAddress,
  getLenderData,
  packCommands
} from '../..'
import {
  CurrencyUtils,
  getAssetInFromTrade,
  getAssetOutFromTrade,
  getChainIdFromTrade,
  getAdjustedHopCount,
  isPreFundableDex,
  minimumAmountOutFromTrade,
} from '../../../utils'
import { AdditionalSwapInfo, SwapEncoder } from '../../spot/dexCoder'
import { buildMarginInnerCall } from './utils'
import { HandleMarginParams } from '../types/marginHandlers'

function printSwap(swap: SerializedSwapStep) {
  console.log(swap.route.pools.map(p => p.protocol).join(" --> "))
}

/** 
 * Encode a swap step
 * The difference to the spot case is that it is expected to provide 
 * callback data, too
 */
function encodeSwap(
  pool: SerializedPool,
  receiver: Address,
  additionalData: AdditionalSwapInfo,
): Hex {
  const tokenOut = pool.tokenOut.address

  const poolSpecificData = SwapEncoder.encodeSwapCall(pool.swapParams, additionalData)

  return encodePacked(
    ['address', 'address', 'uint8', 'address', 'bytes'],
    [tokenOut as Address, receiver, pool.swapParams.dexId, pool.address as Address, poolSpecificData as Hex],
  )
}

/** 
 * We build the paths so that we can nest the callback data into the lowest level
 * Before executing the callback, we swap all paths and ensure that the final callback contains the calldata
 * the calldata is
 * - the amounts and addresses we need to pay (all first pools)
 * - the withdraw/borrow action that funds the amounts
 * - depost/repay the total output received  
 * 
 * We therefore need to progressively nest the first swaps in each split
 * swapPool0(..., callback)
 *                  |
 *                continue swapPath0 ---------------------------------> receive tokenOut
 *                  |                                                        |
 *                swapPool1(..., callback)                                   |
 *                                  |                                        |
 *                                continue swapPath1 -----------------> receive tokenOut
 *                                  |                                        |
 *                                swapPool2(..., callback)                   |
 *                                                  |                        |
 *                                                continue swapPath1 -> receive tokenOut
 *                                                  |                        |
 *                                                No more splits             |
 *                                                  |                        |
 *                                                deposit (balanceOf) amount out received / repay and refund
 *                                                  |
 *                                                borrow -> pay pool0, pool1,...
 * The calldata for this has to be built in a reverted manner, starting with the inner-most path
 * Ultimately, the order of the path does not matter, so we nest the first one in the second and so on 
 */
function nestFlashSwap(
  swaps: SerializedSwapStep[],
  index: number,
  composerAddress: Address,
  slippageTolerance: string,
  innerCall: Hex
): Hex {
  // if we are at the end, we return the innerCall
  if (swaps.length == index) return innerCall as Hex

  // printSwap(swaps[index])

  const { receiver, pool, remainingPath, preFunded, minimumOut } = getPoolReceiverData(swaps[index], composerAddress, slippageTolerance)

  // remainingPath && printSwap(remainingPath)

  // produce the nested inner call

  // path call - empty if single hop
  const pathCall = !!remainingPath ? processPathSlice(
    preFunded,
    remainingPath,
    composerAddress,
    CurrencyUtils.getAmount(minimumOut)
  ) : "0x"

  // head for flash swap
  let calldata = attachBranch(
    swapHead(
      CurrencyUtils.getAmount(swaps[index].inputAmount), // defined input
      !!remainingPath ? 1n : CurrencyUtils.getAmount(minimumOut),
      pool.tokenIn.address as Address, //
    ),
    0n, 0n, "0x" // splits and hops are nested
  )
  // add single flash swap
  calldata += encodeSwap(
    pool,
    receiver,
    {
      // flash first pool
      payConfig: DexPayConfig.FLASH,

      callbackData: packCommands([pathCall, innerCall])
    }
  ).slice(2)

  return nestFlashSwap(
    swaps,
    index + 1, // increment to the next swap route
    composerAddress,
    slippageTolerance,
    calldata as Hex // we nest the current calldata within the next step
  )
}

/**
 * Create the margin lending operations, safety sweep and pool payments
 */
function produceInnerCall(
  trade: SerializedTrade,
  composer: string,
  account: string,
  marginData: MarginData,
  isMaxIn: boolean,
  isMaxOut: boolean
) {
  // flash swaps allways have the pool as receivers (even UniV4 & BalancerV3)
  const receivers = trade.swaps.map(s => s.route.pools[0].address)

  // if we split, we need to withdraw to the composer
  // and then distribute the funds
  const isSplit = trade.swaps.length > 1

  // the input = inputWithFlashFee
  let amount = trade.inputAmount.amount

  const tokenIn = getAssetInFromTrade(trade) as Address
  const tokenOut = getAssetOutFromTrade(trade) as Address
  const chainId: ChainIdLike = getChainIdFromTrade(trade)

  const { lender } = marginData

  // lender infos
  const outLenderData = getLenderData(lender, chainId, tokenOut)
  const inLenderData = getLenderData(lender, chainId, tokenIn)

  const { context, safetySweep } = buildMarginInnerCall(
    trade,
    account as Address,
    marginData,
    inLenderData,
    outLenderData,
    // split or max in: composer receives
    isSplit || isMaxIn ? composer : receivers[0],
    composer, // interdediate for max withdraw
    amount.toString(), // no flash fee
    isMaxIn,
    isMaxOut
  )

  let poolPayments = "0x"
  if (isSplit || isMaxIn) {
    // each pool is paid as an array of sweep operations
    const transfers: string[] = receivers.map((r, i) => {
      return encodeSweep(tokenIn, r as Address, CurrencyUtils.getAmount(trade.swaps[i].inputAmount), SweepType.AMOUNT)
    }
    )
    // create call for that
    poolPayments = packCommands(transfers)
  }

  return { context, safetySweep, poolPayments }
}

function sliceSwapStep(step: SerializedSwapStep): SerializedSwapStep | undefined {
  if (step.route.pools.length === 1) return undefined
  const path = step.route.path.slice(1)
  const pools = step.route.pools.slice(1)
  return {
    inputAmount: CurrencyUtils.fromRawAmount(path[0], 0n) as any,
    outputAmount: step.outputAmount,
    route: {
      path,
      pools
    }
  }
}

interface FlashSwapInstruction {
  receiver: Address,
  pool: SerializedPool,
  remainingPath: SerializedSwapStep | undefined
  preFunded: boolean,
  minimumOut: SerializedCurrencyAmount
}


/**
 * We get the parameters for a pool swap
 * @param step 
 * @param composer 
 * @param slippageTolerance 
 * @returns 
 */
function getPoolReceiverData(
  step: SerializedSwapStep,
  composer: Address,
  slippageTolerance: string
): FlashSwapInstruction {
  return {
    // @ts-ignore
    receiver: composer, // receiver must be the composer as it needs to read a balanceOf()
    pool: step.route.pools[0],
    remainingPath: sliceSwapStep(step),
    preFunded: false, // never pre-fund the secn margin step
    minimumOut: minimumAmountOutFromTrade(step, slippageTolerance, TradeType.EXACT_INPUT)
  }
}

/** This is a path where the funds already were received from the first swap */
function processPathSlice(
  funded: boolean, // should always be true as all flash swap pools have custom receivers
  swap: SerializedSwapStep, // sliced swap after first pool 
  composerAddress: Address,
  minimumOut: bigint
) {
  const numHops = swap.route.pools.length
  const adjustedHops = getAdjustedHopCount(swap, numHops)
  let swapCalldata: Hex = swapHead(
    0n, // always balanceOf(this)
    minimumOut,
    swap.inputAmount.currency.address as Address, //
  )

  // only for wraps in between the hops (not for first hop)
  if (adjustedHops > 1) {
    swapCalldata = attachBranch(swapCalldata, BigInt(adjustedHops - 1), 0n, '0x')
  }

  let lastReceiver = '0x'
  // Process each hop in the split
  for (let hopIndex = 0; hopIndex < numHops; hopIndex++) {
    const pool = swap.route.pools[hopIndex]
    const isFirstHop = hopIndex === 0
    const isLastHop = hopIndex === numHops - 1

    // Determine receiver for this hop
    let hopReceiver: Address
    if (!isLastHop && swap.route.pools[hopIndex + 1] && isPreFundableDex(swap.route.pools[hopIndex + 1].protocol)) {
      hopReceiver = swap.route.pools[hopIndex + 1].address as Address
    } else if (!isLastHop) {
      hopReceiver = composerAddress
      // } else if (CurrencyUtils.isNativeAmount(trade.outputAmount)) {
      //   hopReceiver = composerAddress
    } else {
      hopReceiver = composerAddress
    }

    // Encode the swap
    swapCalldata = attachBranch(swapCalldata, 0n, 0n, '0x')
    swapCalldata += encodeSwap(
      pool,
      hopReceiver,
      // the payer is based on
      // 1) beginning -> caller pays if no wrap
      // rest -> pre-fund based on last receiver, contract otherwise
      {
        payConfig: isFirstHop
          ? funded ? DexPayConfig.PRE_FUND :
            DexPayConfig.CONTRACT_PAYS
          : lastReceiver === pool.address
            ? DexPayConfig.PRE_FUND
            : DexPayConfig.CONTRACT_PAYS,
      }
    ).slice(2)
    // update last receiver
    lastReceiver = hopReceiver
  }
  return swapCalldata;
}

function processTrade(
  trade: SerializedTrade,
  slippageTolerance: string,
  composerAddress: Address,
  flashCalldata: Hex,
): Hex {
  if (!trade) throw new Error('No trade to process')
  if (CurrencyUtils.isNativeAmount(trade.inputAmount) && CurrencyUtils.isNativeAmount(trade.outputAmount)) {
    throw new Error('Native in and out')
  }

  return nestFlashSwap(
    trade.swaps,
    0,
    composerAddress,
    slippageTolerance,
    flashCalldata
  )
}

export namespace ComposerFlashSwap {

  export function createSweepCalldata(tokenAddress: Address, receiver: Address): Hex {
    return encodeSweep(tokenAddress, receiver, 0n, SweepType.VALIDATE)
  }

  /** Trade with 1delta path or external aggregator */
  export function composeFlashSwapCalldata(
    {
      trade,
      // externalCall,
      account,
      marginData,
      isMaxIn = false,
      isMaxOut = false,
      slippageTolerance,
      // these are poarameters that allow a UI to override details
      composerOverride = undefined,
      // flashInfoOverride = undefined,
    }: HandleMarginParams
  ) {


    if (!trade?.interfaceTrade) throw new Error("Require interface trade!")

    // optionally override composer
    const chainId = trade?.inputAmount.currency.chainId
    const composerAddress = (composerOverride ?? getComposerAddress(chainId)) as Address

    // create the inner lending operations and pool payments
    const { context, safetySweep, poolPayments } = produceInnerCall(
      trade.interfaceTrade,
      composerAddress,
      account!,
      marginData!,
      isMaxIn,
      isMaxOut
    )

    // process the trade and create swap path calldata
    const swapCalldata = processTrade(
      trade.interfaceTrade,
      slippageTolerance!,
      composerAddress,
      packCommands([
        context.callIn, // poll funds from lender (e.g. withdraw / borrow)
        context.callOut, // received handling (e.g. deposit)
        poolPayments, // distribute funds to pools
        context.cleanup // refund excess inputs
      ])
    )

    return packCommands([swapCalldata, safetySweep]) as Hex
  }

}
