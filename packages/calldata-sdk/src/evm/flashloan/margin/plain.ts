import { encodeSweep, SweepType, FlashLoanIds } from '@1delta/calldatalib'
import { FLASH_LOAN_IDS } from '@1delta/dex-registry'
import { Address, Hex } from 'viem'
import { ChainIdLike } from '@1delta/type-sdk'
import {
  adjustForFlashLoanFee,
  createFlashLoan,
  getFlashLoanProviderAndFeePerChain,
  getFlashLoanType,
  getProviderAddressForSingletonType,
} from '..'
import {
  CurrencyUtils,
  FlashLoanProvider,
  FlashLoanProviderData,
  GenericTrade,
  getAssetInFromTrade,
  getAssetOutFromTrade,
  getChainIdFromTrade,
  PoolTypeFlashLoanData,
  SingletonTypeFlashLoanData,
} from '../../../utils'
import { FORWARDER, ONE_DELTA_COMPOSER } from '../../consts'
import { HandleMarginParams } from '../types/marginHandlers'
import { ComposerSpot } from '../../spot'
import { buildMarginInnerCall, handlePendle } from './utils'
import {
  ComposerLendingActions,
  TransferToLenderType,
  getLenderData,
  packCommands,
  getFlashInfo,
  LenderData,
} from '../../lending'
import { MarginData } from '../types/margin'

/**
 * Build the inner call sequence for debased flash loan
 * Note this should not be used for morpho, we skip the markets here.
 */
function buildDebasedInnerCall(
  trade: GenericTrade,
  account: Address,
  marginData: MarginData,
  inLenderData: LenderData,
  outLenderData: LenderData,
  isMaxIn: boolean,
  isMaxOut: boolean,
  proxyToken: Address,
  proxyAmount: bigint,
  intermediate: string,
  flashRepayBalanceHolder: string
) {
  const { lender } = marginData
  const chainId = trade.inputAmount.currency.chainId

  // 1. Deposit proxy asset to lender (compound)
  const depositIntermediateCall = ComposerLendingActions.createDeposit({
    receiver: account,
    amount: { asset: proxyToken, amount: proxyAmount, chainId },
    lender: lender,
    morphoParams: undefined,
    transferType: TransferToLenderType.Amount,
  })

  /**
   * 2. Build regular calls
   * We get the regular calls to NOT redo the maxIn/Out handling
   * A crucial change is that we transfer the pulled funds from the lender directly to
   * the forwarder (and skip it in the later logic)
   * Note that the order of callIn/callOut is reverted - we correct this at a later stage
   */
  const regularCalls = buildMarginInnerCall(
    trade,
    account,
    marginData,
    inLenderData,
    outLenderData,
    flashRepayBalanceHolder, // <- this should be the composer or flash pool
    intermediate, // <- the intermediate needs to be the composer (for maxIn)
    trade.inputAmount.amount.toString(), // <- the amount is unadjusted (no flash fee adjustmetn)
    isMaxIn, // flags as before
    isMaxOut
  )
  // 3. Withdraw proxy asset from lender (compound) to repay flash loan
  const withdrawIntermediateCall = ComposerLendingActions.createWithdraw({
    receiver: flashRepayBalanceHolder,
    amount: {
      asset: proxyToken,
      amount: proxyAmount,
      chainId,
    },
    lender: lender,
    morphoParams: undefined,
    transferType: TransferToLenderType.Amount,
  })

  return {
    depositIntermediateCall,
    regularCalls,
    withdrawIntermediateCall,
  }
}

export namespace ComposerMargin {
  /**
   * Create a flash-loan nested margin trade
   * @param trade generic trade object
   * @param marginData margin info
   * @param isMaxIn maximum input
   * @param isMaxOut maximum output
   * @returns composer calldata
   *
   * For debased flash loans:
   * - Provide proxyAsset
   * - If proxyAsset.amount is not provided, it will use trade.inputAmount.amount as fallback (not recommended)
   */
  export function createMarginFlashLoan({
    trade,
    externalCall,
    account,
    marginData,
    isMaxIn = false,
    isMaxOut = false,
    // these are poarameters that allow a UI to override details
    composerOverride = undefined,
    flashInfoOverride = undefined,
  }: HandleMarginParams) {
    // ensure params are given
    if (!trade || !externalCall || !marginData || !account) return '0x'

    const composerAddress =
      composerOverride ?? ONE_DELTA_COMPOSER[trade.inputAmount.currency.chainId as keyof typeof ONE_DELTA_COMPOSER]

    // handle max cases
    if (isMaxIn && isMaxOut) throw new Error('Cannot be maxIn and maxOut at the same time')

    const { proxyAsset } = flashInfoOverride ?? {}

    /** get token and lender info */
    const tokenIn = getAssetInFromTrade(trade) as Address
    const tokenOut = getAssetOutFromTrade(trade) as Address
    const chainId: ChainIdLike = getChainIdFromTrade(trade)

    const { lender } = marginData

    const outLenderData = getLenderData(lender, chainId, tokenOut)
    const inLenderData = getLenderData(lender, chainId, tokenIn)

    /** intermediate address that holds the funds for the swap */
    const intermediate = composerAddress

    const shouldUseDebasedFlow = proxyAsset && proxyAsset.currency.address.toLowerCase() !== tokenIn.toLowerCase()

    if (shouldUseDebasedFlow && proxyAsset.amount === 0n) {
      console.warn(
        'No intermediate amount is provided, inputAmount will be used, this is not recommended, it may result in over borrowing or a failed action, consider calculating the required amount and use it'
      )
    }

    /**
     * get the details of the flash loan data - per default, we pick some reasonable variants
     * These can be overridden
     */
    let flashLoanData: FlashLoanProviderData
    let flashLoanProvider: FlashLoanProvider
    let flashRepayBalanceHolder: string
    let flashPoolType: number
    let flashPool: string
    if (flashInfoOverride) {
      const { data, provider, balanceHolder, providerAddress, poolType } = flashInfoOverride
      flashLoanData = data
      flashLoanProvider = provider
      flashPoolType = poolType!
      flashRepayBalanceHolder =
        balanceHolder ??
        // balancers go directly to the pool
        (poolType === FlashLoanIds.BALANCER_V2 || provider === FlashLoanProvider.BALANCER_V3
          ? providerAddress!
          : composerAddress!)
      flashPool = providerAddress!
    } else {
      // if debased, use intermediate asset for flash loan provider selection
      const flashLoanAsset = shouldUseDebasedFlow ? proxyAsset!.currency.address.toLowerCase() : tokenIn.toLowerCase()
      const data = getFlashLoanProviderAndFeePerChain(chainId, trade.flashLoanSource, lender, flashLoanAsset)

      const flashInfo = getFlashInfo(data.flashLoanProvider as any, chainId, composerAddress)

      // @ts-ignore
      flashPoolType = flashInfo.poolType
      // the fee and Id data for the loan
      flashLoanData = flashInfo.data
      // the provider enum
      flashLoanProvider = flashInfo.provider
      // the address to call - ignored for some
      flashPool = flashInfo.providerAddress!
      // the holder of the funds on closure
      flashRepayBalanceHolder = flashInfo.balanceHolder!
    }

    const inputReference =
      shouldUseDebasedFlow && proxyAsset!.amount ? BigInt(proxyAsset!.amount.toString()) : trade.inputAmount.amount

    /** compute the flash loan repay amount */
    const flashLoanAmountWithFee = adjustForFlashLoanFee(inputReference, flashLoanData.fee)

    // Handle debased flows vs regular flows
    let context: any
    let safetySweep: any

    if (shouldUseDebasedFlow) {
      // debased flow
      const proxyToken = proxyAsset!.currency.address as Address

      const {
        // basic calls
        // the sweep actions are the same for regular as for de-based
        // for withdarw all, we sweep the excess input amount
        // cleanups are also the same as we sweep the output after close
        regularCalls,
        // the deposit action to increase the credit line
        depositIntermediateCall,
        // withdraw to pay back loan
        withdrawIntermediateCall,
      } = buildDebasedInnerCall(
        trade,
        account,
        marginData,
        inLenderData,
        outLenderData,
        isMaxIn,
        isMaxOut,
        proxyToken,
        proxyAsset!.amount ? BigInt(proxyAsset!.amount.toString()) : BigInt(trade.inputAmount.amount),
        intermediate,
        flashRepayBalanceHolder
      )

      // Create context object compatible with regular flow
      context = {
        callIn: regularCalls.context.callOut,
        callOut: regularCalls.context.callIn,
        manualFlashLoanRepayTransfer: '0x',
        cleanup: regularCalls.context.cleanup,
        // Store additional debased calls
        depositIntermediateCall,
        withdrawIntermediateCall,
      }
      safetySweep = regularCalls.safetySweep
    } else {
      // normal flow
      const result = buildMarginInnerCall(
        trade,
        account,
        marginData,
        inLenderData,
        outLenderData,
        flashRepayBalanceHolder,
        intermediate,
        flashLoanAmountWithFee,
        isMaxIn,
        isMaxOut
      )
      context = result.context
      safetySweep = result.safetySweep
    }

    /** Prepare the swap call through the forwarder */

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
    if (trade.sweepToReceiver || shouldUseDebasedFlow) {
      // Sweep output to composer (as we need to put the funds into the lender)
      sweepOutputCalldata = ComposerSpot.createSweepCalldata(
        trade.outputAmount.currency.address as Address,
        composerAddress as Address
      )
    }

    // Encode external swap through forwarder
    const swapCall = ComposerSpot.encodeExternalCallForCallForwarder(externalCall, approvalData, sweepOutputCalldata)

    // For debased flows, flash funds receiver should be composer; for regular flows, the call forwarder
    const flashFundsReceiver = shouldUseDebasedFlow ? composerAddress : externalCall.callForwarder

    const flashLoanType = getFlashLoanType(flashLoanProvider as any)

    /** get the flash loan call based on the selected type */
    let flashData: SingletonTypeFlashLoanData | PoolTypeFlashLoanData
    // handles uniswap v4 and balancer v3
    if (flashLoanType === 'Singleton') {
      flashData = {
        type: 'Singleton',
        receiver: flashFundsReceiver as Address,
        ...getProviderAddressForSingletonType(flashLoanProvider as any, chainId),
      } as SingletonTypeFlashLoanData
    }
    // handles the rest
    else {
      flashData = {
        type: 'Pool',
        pool: flashPool,
        poolType: flashPoolType,
        flashloanId: FLASH_LOAN_IDS[flashLoanProvider],
      } as PoolTypeFlashLoanData
    }

    // The asset we're flash loaning (proxy asset for debased flows, tokenIn for normal flows)
    const flashLoanAssetAddress = shouldUseDebasedFlow ? (proxyAsset!.currency.address as Address) : tokenIn

    /**
     * for some flash loans, we need to send the funds to the
     * call forwarder manually.
     * This is the case for pool-based flash loans
     */
    let transferToCallForwarder: Hex = '0x'
    if (flashData.type === 'Pool' && !shouldUseDebasedFlow) {
      transferToCallForwarder = encodeSweep(
        tokenIn,
        flashFundsReceiver as Address,
        BigInt(inputReference.toString()),
        SweepType.AMOUNT
      )
    }

    let flashloanData: Hex
    if (shouldUseDebasedFlow) {
      // debased flow
      flashloanData = packCommands([
        // 1. Deposit proxy asset to lender (compound)
        context.depositIntermediateCall,
        // 2. Pull input asset from lender (compound) to forwarder
        context.callIn,
        // 3. fund call forwarder
        encodeSweep(
          trade.inputAmount.currency.address as Address,
          externalCall.callForwarder as Address,
          BigInt(trade.inputAmount.amount.toString()),
          SweepType.AMOUNT
        ),
        // 4. Swap input asset to output asset
        swapCall,
        // 5. handle pendle
        handlePendle(trade, account),
        // 6. pay output asset to lender
        context.callOut,
        // 7. Withdraw proxy asset from lender (compound) to repay flash loan
        context.withdrawIntermediateCall,
        // 8. Safety sweep -> done at the end
      ])
    } else {
      // regular flow
      flashloanData = packCommands([
        transferToCallForwarder,
        swapCall, // receive funds in tokenIn and swap to tokenOut
        handlePendle(trade, account), // sweep yt if pendle
        context.callIn, // handle tokenOut (repay/deposit)
        context.callOut, // pull tokenIn from lender (borrow/withdraw) and repay flash loan
        context.manualFlashLoanRepayTransfer, // can be 0x
      ])
    }

    const flashloanCalldata = createFlashLoan(flashLoanProvider as any, {
      asset: flashLoanAssetAddress,
      amount: inputReference.toString(),
      data: flashloanData,
      ...flashData,
    })

    return packCommands([flashloanCalldata, context.cleanup, safetySweep])
  }
}
