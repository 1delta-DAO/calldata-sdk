import { Address, Hex } from 'viem'
import { ChainIdLike, SerializedCurrencyAmount } from '@1delta/type-sdk'
import {
  adjustForFlashLoanFee,
  createFlashLoan,
  getFlashLoanProviderAndFeePerChain,
  getFlashLoanType,
  getProviderAddressForSingletonType,
} from '..'
import { ComposerSpot } from '../../spot'
import {
  CurrencyUtils,
  getAssetInFromTrade,
  getAssetOutFromTrade,
  getChainIdFromTrade,
  PoolTypeFlashLoanData,
  SingletonTypeFlashLoanData,
  FlashLoanProvider,
  FlashLoanProviderData,
} from '../../../utils'
import { FLASH_LOAN_IDS } from '@1delta/dex-registry'
import {
  encodeSweep,
  SweepType,
  FlashLoanIds,
  encodePermit,
  PermitIds,
  encodeTransferIn,
  encodePermit2TransferFrom,
  encodeWrap,
} from '@1delta/calldatalib'
import { ONE_DELTA_COMPOSER } from '../../consts'
import { getFlashInfo, getLenderData, packCommands } from '../../lending'
import { buildMarginInnerCall, handlePendle } from '../margin/utils'
import { HandleMarginParams, FlashInfo } from '../types/marginHandlers'
import { GenericTrade } from '../../../utils'
import { ExternalCallParams } from '../../spot/types'
import { Lender } from '@1delta/lender-registry'
import { WRAPPED_NATIVE_INFO } from '@1delta/wnative'

export interface ZapInParams extends HandleMarginParams {
  /** flash loan amount for debt-asset path */
  userPayAmount: SerializedCurrencyAmount
  /** Optional user token permit for debt-asset path */
  userPermit?: { data: Hex; isPermit2?: boolean }
  /** Optional: multiple trades, if omitted, uses single trade */
  trades?: GenericTrade[]
  /** Optional: multiple external calls mapped to trades, if omitted, uses single external call */
  externalCalls?: ExternalCallParams[]
}

export function createZapInMargin({
  trade,
  externalCall,
  account,
  marginData,
  isMaxIn = false,
  isMaxOut = false,
  composerOverride,
  flashInfoOverride,
  userPayAmount,
  userPermit,
  trades,
  externalCalls,
}: ZapInParams) {
  if (!marginData || !account) return '0x'
  if (isMaxIn || isMaxOut) throw new Error('maxIn/maxOut not supported for zapIn')

  const tradeArray: GenericTrade[] = trades && trades.length ? trades : trade ? [trade] : []
  const externalArray: ExternalCallParams[] =
    externalCalls && externalCalls.length ? externalCalls : externalCall ? [externalCall] : []

  if (tradeArray.length === 0) throw new Error('trade required for zapIn')
  if (externalArray.length === 0) throw new Error('externalCall required for zapIn')
  if (externalArray.length !== tradeArray.length) throw new Error('externalCalls must match trades length')
  if (tradeArray.length > 1) throw new Error('Multi-trade zapIn not implemented yet')

  const selectedTrade = tradeArray[0]
  const selectedExternal = externalArray[0]

  const tokenIn = getAssetInFromTrade(selectedTrade) as Address
  const tokenOut = getAssetOutFromTrade(selectedTrade) as Address
  const chainId: ChainIdLike = getChainIdFromTrade(selectedTrade)

  const composerAddress = (composerOverride ??
    ONE_DELTA_COMPOSER[selectedTrade.inputAmount.currency.chainId as keyof typeof ONE_DELTA_COMPOSER]) as Address

  const { lender } = marginData
  const inLenderData = getLenderData(lender, chainId, tokenIn)
  const outLenderData = getLenderData(lender, chainId, tokenOut)

  const { flashLoanData, flashLoanProvider, flashRepayBalanceHolder, flashPoolType, flashPool } = getFlashLoanData(
    flashInfoOverride,
    chainId,
    selectedTrade,
    lender,
    tokenIn,
    composerAddress
  )

  const wnativeAddress = WRAPPED_NATIVE_INFO[userPayAmount.currency.chainId]?.address?.toLowerCase()

  // detect whether the user asset matches the collateral or debt (we convert to wnative)
  let userAssetIsCollateral: boolean
  if (CurrencyUtils.isNativeAmount(userPayAmount)) {
    userAssetIsCollateral = wnativeAddress === trade?.outputAmount.currency.address.toLowerCase()
    // throw if it does not match either
    if (!userAssetIsCollateral && wnativeAddress !== trade?.inputAmount.currency.address.toLowerCase())
      throw new Error('Pay token is neither collateral nor debt')
  } else {
    userAssetIsCollateral =
      userPayAmount.currency.address.toLowerCase() === trade?.outputAmount.currency.address.toLowerCase()
    // throw if it does not match either
    if (
      !userAssetIsCollateral &&
      userPayAmount.currency.address.toLowerCase() !== trade?.inputAmount.currency.address.toLowerCase()
    )
      throw new Error('Pay token is neither collateral nor debt')
  }

  /** This is the flash loan amount */
  let flashInputReference: bigint
  /** user asset is the debt asset */
  if (!userAssetIsCollateral) {
    // we flash loan the tradeAmount minus user provided amount
    flashInputReference = BigInt(trade?.inputAmount.amount ?? 0n) - BigInt(userPayAmount.amount ?? 0n)
  } else {
    /** user asset is collateral */
    // just flash loan the trade input
    flashInputReference = BigInt(trade?.inputAmount.amount ?? 0n)
  }

  const flashLoanAmountWithFee = adjustForFlashLoanFee(flashInputReference, flashLoanData.fee)

  const { context, safetySweep } = buildMarginInnerCall(
    selectedTrade,
    account as Address,
    marginData,
    inLenderData,
    outLenderData,
    flashRepayBalanceHolder,
    composerAddress,
    flashLoanAmountWithFee,
    isMaxIn,
    isMaxOut
  )

  // pre-funding calldata
  const paymentCalldata = getPaymentCalldata(
    userAssetIsCollateral,
    userPayAmount,
    userPermit,
    selectedExternal,
    composerAddress,
    wnativeAddress
  )

  let sweepOutputCalldata: Hex = '0x'
  sweepOutputCalldata = ComposerSpot.createSweepCalldata(
    selectedTrade.outputAmount.currency.address as Address,
    composerAddress as Address
  )

  let approvalData: { token: Address; target: Address } | undefined = undefined
  if (selectedTrade.approvalTarget && !CurrencyUtils.isNative(selectedTrade.inputAmount.currency)) {
    approvalData = {
      token: selectedTrade.inputAmount.currency.address as Address,
      target: selectedTrade.approvalTarget as Address,
    }
  }

  const swapCall = ComposerSpot.encodeExternalCallForCallForwarder(selectedExternal, approvalData, sweepOutputCalldata)

  const flashLoanType = getFlashLoanType(flashLoanProvider)
  let flashData: SingletonTypeFlashLoanData | PoolTypeFlashLoanData
  if (flashLoanType === 'Singleton') {
    flashData = {
      type: 'Singleton',
      receiver: composerAddress as Address,
      ...getProviderAddressForSingletonType(flashLoanProvider, chainId),
    } as SingletonTypeFlashLoanData
  } else {
    flashData = {
      type: 'Pool',
      pool: flashPool,
      poolType: flashPoolType,
      flashloanId: FLASH_LOAN_IDS[flashLoanProvider],
    } as PoolTypeFlashLoanData
  }

  const flashLoanAssetAddress = tokenIn

  let transferToCallForwarder: Hex = '0x'
  if (flashData.type === 'Pool') {
    transferToCallForwarder = encodeSweep(
      tokenIn,
      selectedExternal.callForwarder as Address,
      BigInt(flashInputReference.toString()),
      SweepType.AMOUNT
    )
  }

  const flashloanData = packCommands([
    transferToCallForwarder,
    swapCall,
    handlePendle(selectedTrade, account as Address),
    context.callIn,
    context.callOut,
    context.manualFlashLoanRepayTransfer,
  ])

  const flashloanCalldata = createFlashLoan(flashLoanProvider, {
    asset: flashLoanAssetAddress,
    amount: flashInputReference.toString(),
    data: flashloanData,
    ...flashData,
  })

  return {
    // attach the value if payment is native
    value: CurrencyUtils.isNativeAmount(userPayAmount) ? userPayAmount.amount : '0',
    // add composer as target
    to: composerAddress,
    data: packCommands([
      paymentCalldata, // payment data is outisde the flash loan
      flashloanCalldata,
      context.cleanup,
      safetySweep,
    ]),
  }
}

function getFlashLoanData(
  flashInfoOverride: FlashInfo | undefined,
  chainId: ChainIdLike,
  selectedTrade: GenericTrade,
  lender: Lender,
  tokenIn: Address,
  composerAddress: Address
) {
  let flashLoanData: FlashLoanProviderData
  let flashLoanProvider: FlashLoanProvider
  let flashRepayBalanceHolder: Address
  let flashPoolType: FlashLoanIds | undefined
  let flashPool: string

  if (flashInfoOverride) {
    const { data, provider, balanceHolder, providerAddress, poolType } = flashInfoOverride
    flashLoanData = data
    flashLoanProvider = provider
    flashPoolType = poolType
    flashRepayBalanceHolder = (balanceHolder ??
      (poolType === FlashLoanIds.BALANCER_V2 || provider === FlashLoanProvider.BALANCER_V3
        ? providerAddress!
        : composerAddress!)) as Address
    flashPool = providerAddress!
  } else {
    const data = getFlashLoanProviderAndFeePerChain(
      chainId,
      selectedTrade.flashLoanSource,
      lender,
      tokenIn.toLowerCase()
    )
    const flashInfo = getFlashInfo(data.flashLoanProvider as FlashLoanProvider, chainId, composerAddress)
    flashPoolType = flashInfo.poolType
    flashLoanData = flashInfo.data
    flashLoanProvider = flashInfo.provider
    flashPool = flashInfo.providerAddress!
    flashRepayBalanceHolder = flashInfo.balanceHolder! as Address
  }

  return {
    flashLoanData,
    flashLoanProvider,
    flashRepayBalanceHolder,
    flashPoolType,
    flashPool,
  }
}

/**
 * Facilitates the transfer from the user to the contracts
 * 1) userAssetIsCollateral == true : pay to the composer and wrap if needed
 * 2) userAssetIsCollateral == false: wrap and transfer to composer (we assume that the swapp is for the ein tire amount in wnative)
 */
function getPaymentCalldata(
  userAssetIsCollateral: boolean,
  userPayAmount: SerializedCurrencyAmount,
  userPermit: { data: Hex; isPermit2?: boolean } | undefined,
  selectedExternal: ExternalCallParams,
  composer: string,
  wnativeAddress: string
) {
  let paymentCalldata: Hex = '0x'

  // funds are sent to the
  const payFundsReceiver: any = userAssetIsCollateral ? composer : selectedExternal.callForwarder

  const userAmount = BigInt(userPayAmount.amount)
  const userTokenAddress: Address = userPayAmount.currency.address as Address
  const isNativeUser = CurrencyUtils.isNativeAmount(userPayAmount)

  // should always be positive
  if (userAmount > 0n) {
    // non-native case accepts permits
    if (!isNativeUser) {
      let permitCalldata: Hex = '0x'
      let transferCalldata: Hex = '0x'
      if (userPermit) {
        permitCalldata = encodePermit(BigInt(PermitIds.TOKEN_PERMIT), userTokenAddress, userPermit.data)
        if (userPermit.isPermit2) {
          transferCalldata = encodePermit2TransferFrom(userTokenAddress, payFundsReceiver, userAmount)
        } else {
          transferCalldata = encodeTransferIn(userTokenAddress, payFundsReceiver, userAmount)
        }
      } else {
        transferCalldata = encodeTransferIn(userTokenAddress, payFundsReceiver, userAmount)
      }
      paymentCalldata = packCommands([permitCalldata, transferCalldata])
    } 
    // native case is more specific -> wrap and send wnative to call forwarder for swap
    else {
      paymentCalldata = packCommands([
        // wrap
        encodeWrap(userPayAmount.amount as any, wnativeAddress as any),
        userAssetIsCollateral
          ? '0x' // no data if collateral, otherwise sweep to payer
          : encodeSweep(wnativeAddress as any, payFundsReceiver as any, userPayAmount.amount as any, SweepType.AMOUNT),
      ])
    }
  }

  return paymentCalldata
}
