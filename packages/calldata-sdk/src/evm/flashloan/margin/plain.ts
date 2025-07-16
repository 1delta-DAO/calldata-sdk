import { encodeSweep, SweepType, FlashLoanIds } from '@1delta/calldatalib'
import { FLASH_LOAN_IDS } from '@1delta/dex-registry'
import { ChainIdLike } from '@1delta/type-sdk'

import {
  adjustForFlashLoanFee,
  createFlashLoan,
  getFlashLoanProviderAndFeePerChain,
  getFlashLoanType,
  getProviderAddressForSingletonType,
} from '..'
import {
  getLenderData,
  packCommands,
  getFlashInfo,
} from '../../lending'
import { Address, Hex } from 'viem'
import {
  CurrencyUtils,
  FlashLoanProvider,
  FlashLoanProviderData,
  getAssetInFromTrade,
  getAssetOutFromTrade,
  getChainIdFromTrade,
  PoolTypeFlashLoanData,
  SingletonTypeFlashLoanData,
} from '../../../utils'
import { ONE_DELTA_COMPOSER } from '../../consts'
import { HandleMarginParams } from '../types/marginHandlers'
import { ComposerSpot } from '../../spot'
import { buildMarginInnerCall } from './utils'


export namespace ComposerMargin {
  /**
   * Create a flash-loan nested margin trade
   * @param trade generic trade object
   * @param marginData margin info
   * @param isMaxIn maximum input
   * @param isMaxOut maximum output
   * @returns composer calldata
   */
  export function createMarginFlashLoan(
    {
      trade,
      externalCall,
      account,
      marginData,
      isMaxIn = false,
      isMaxOut = false,
      // these are poarameters that allow a UI to override details
      composerOverride = undefined,
      flashInfoOverride = undefined,
    }: HandleMarginParams
  ) {
    // ensure params are given
    if (!trade || !externalCall || !marginData || !account) return '0x'

    const composerAddress =
      composerOverride ?? ONE_DELTA_COMPOSER[trade.inputAmount.currency.chainId as keyof typeof ONE_DELTA_COMPOSER]

    // handle max cases
    if (isMaxIn && isMaxOut) throw new Error('Cannot be maxIn and maxOut at the same time')

    /** get token and lender info */
    const tokenIn = getAssetInFromTrade(trade) as Address
    const tokenOut = getAssetOutFromTrade(trade) as Address
    const chainId: ChainIdLike = getChainIdFromTrade(trade)

    const { lender } = marginData

    const outLenderData = getLenderData(lender, chainId, tokenOut)
    const inLenderData = getLenderData(lender, chainId, tokenIn)

    /** intermediate address that holds the funds for the swap */
    const intermediate = composerAddress

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
      flashRepayBalanceHolder = balanceHolder ?? (
        // balancers go directly to the pool
        poolType === FlashLoanIds.BALANCER_V2 || provider === FlashLoanProvider.BALANCER_V3 ? providerAddress! : 
        composerAddress!
      )
      flashPool = providerAddress!
    } else {
      const data = getFlashLoanProviderAndFeePerChain(chainId, trade.flashLoanSource, lender, tokenIn.toLowerCase())

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

    const inputReference = trade.inputAmount.amount

    /** compute the flash loan repay amount */
    const flashLoanAmountWithFee = adjustForFlashLoanFee(inputReference, flashLoanData.fee)


    const { context, safetySweep } = buildMarginInnerCall(
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
    if (trade.sweepToReceiver) {
      // Sweep output to composer (as we need to put the funds into the lender)
      sweepOutputCalldata = ComposerSpot.createSweepCalldata(
        trade.outputAmount.currency.address as Address,
        composerAddress as Address
      )
    }

    // Encode external swap through forwarder
    const swapCall = ComposerSpot.encodeExternalCallForCallForwarder(
      externalCall,
      approvalData,
      sweepOutputCalldata
    )


    // the call forwarder should receive the funds directly
    // sometimes we have to manuall send them to it
    const flashFundsReceiver = externalCall.callForwarder

    const flashLoanType = getFlashLoanType(flashLoanProvider as any)

    /** get the flash loan call based on the seelcted type */
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
        flashloanId: FLASH_LOAN_IDS[flashLoanProvider]
      } as PoolTypeFlashLoanData
    }

    /** 
     * for some flash loans, we need to send the funds to the
     * call forwarder manually.
     * This is the case for pool-based flash loans
     */
    let transferToCallForwarder: Hex = "0x"
    if (flashData.type === "Pool") {
      transferToCallForwarder = encodeSweep(
        tokenIn,
        flashFundsReceiver,
        BigInt(inputReference),
        SweepType.AMOUNT
      )
    }

    // put all calls together 
    const flashloanData = packCommands([
      transferToCallForwarder,
      swapCall, // receive funds in tokenIn and swap to tokenOut
      context.callIn, // handle tokenOut (repay/deposit)
      context.callOut, // pull tokenIn from lender (borrow/withdraw) and repay flash loan
      context.manualFlashLoanRepayTransfer, // can be 0x
      safetySweep,
    ])


    const flashloanCalldata = createFlashLoan(flashLoanProvider as any, {
      asset: tokenIn,
      amount: inputReference.toString(),
      data: flashloanData,
      ...flashData,
    })

    return packCommands([flashloanCalldata, context.cleanup])
  }
}
