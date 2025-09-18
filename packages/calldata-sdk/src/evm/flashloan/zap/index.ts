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
} from '@1delta/calldatalib'
import { ONE_DELTA_COMPOSER } from '../../consts'
import { getFlashInfo, getLenderData, packCommands } from '../../lending'
import { buildMarginInnerCall, handlePendle } from '../margin/utils'
import { HandleMarginParams, FlashInfo } from '../types/marginHandlers'
import { GenericTrade } from '../../../utils'
import { ExternalCallParams } from '../../spot/types'

export interface ZapInParams extends HandleMarginParams {
  /** If false -> debt asset path, else collateral asset path */
  useCollateralAsset: boolean
  /** flash loan amount for debt-asset path */
  flashAmount?: SerializedCurrencyAmount
  /** Optional user token permit for debt-asset path */
  userPermit?: { data: Hex; isPermit2?: boolean }
  /** Optional: multiple trades, if omitted, uses single trade */
  trades?: GenericTrade[]
  /** Optional: multiple external calls mapped to trades, if omitted, uses single external call */
  externalCalls?: ExternalCallParams[]
}

export function createZapInFlashLoan({
  trade,
  externalCall,
  account,
  marginData,
  isMaxIn = false,
  isMaxOut = false,
  composerOverride,
  flashInfoOverride,
  useCollateralAsset,
  flashAmount,
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

  let inputReference = selectedTrade.inputAmount.amount
  if (!useCollateralAsset) {
    if (!flashAmount) throw new Error('flash loan amount required for debt-asset zapIn')
    inputReference = BigInt(flashAmount.amount)
  }

  const flashLoanAmountWithFee = adjustForFlashLoanFee(inputReference, flashLoanData.fee)

  const intermediate = composerAddress

  const result = buildMarginInnerCall(
    selectedTrade,
    account as Address,
    marginData,
    inLenderData,
    outLenderData,
    flashRepayBalanceHolder,
    intermediate,
    flashLoanAmountWithFee,
    isMaxIn,
    isMaxOut
  )
  const context = result.context
  const safetySweep = result.safetySweep

  // Debt asset path pre-funding
  const { zapAdditional, updatedExternal } = getDebtAssetPrefunding(
    useCollateralAsset,
    selectedTrade,
    flashAmount,
    userPermit,
    selectedExternal
  )

  let sweepOutputCalldata: Hex = '0x'
  sweepOutputCalldata = ComposerSpot.createSweepCalldata(
    selectedTrade.outputAmount.currency.address as Address,
    composerAddress as Address
  )

  const swapCall = ComposerSpot.encodeExternalCallForCallForwarder(updatedExternal, undefined, sweepOutputCalldata)

  const flashLoanType = getFlashLoanType(flashLoanProvider as any)
  let flashData: SingletonTypeFlashLoanData | PoolTypeFlashLoanData
  if (flashLoanType === 'Singleton') {
    flashData = {
      type: 'Singleton',
      receiver: composerAddress as Address,
      ...getProviderAddressForSingletonType(flashLoanProvider as any, chainId),
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
      updatedExternal.callForwarder as Address,
      BigInt(inputReference.toString()),
      SweepType.AMOUNT
    )
  }

  const flashloanData = packCommands([
    zapAdditional,
    transferToCallForwarder,
    swapCall,
    handlePendle(selectedTrade, account as Address),
    context.callIn,
    context.callOut,
    context.manualFlashLoanRepayTransfer,
  ])

  const flashloanCalldata = createFlashLoan(flashLoanProvider as any, {
    asset: flashLoanAssetAddress,
    amount: inputReference.toString(),
    data: flashloanData,
    ...flashData,
  })

  return packCommands([flashloanCalldata, context.cleanup, safetySweep])
}

function getFlashLoanData(
  flashInfoOverride: FlashInfo | undefined,
  chainId: ChainIdLike,
  selectedTrade: GenericTrade,
  lender: string,
  tokenIn: Address,
  composerAddress: Address
) {
  let flashLoanData: FlashLoanProviderData
  let flashLoanProvider: FlashLoanProvider
  let flashRepayBalanceHolder: string
  let flashPoolType: number
  let flashPool: string

  if (flashInfoOverride) {
    const { data, provider, balanceHolder, providerAddress, poolType } = flashInfoOverride
    flashLoanData = data
    flashLoanProvider = provider
    flashPoolType = poolType as any
    flashRepayBalanceHolder = (balanceHolder ??
      (poolType === FlashLoanIds.BALANCER_V2 || provider === FlashLoanProvider.BALANCER_V3
        ? providerAddress!
        : composerAddress!)) as string
    flashPool = providerAddress!
  } else {
    const data = getFlashLoanProviderAndFeePerChain(
      chainId,
      selectedTrade.flashLoanSource,
      lender as any,
      tokenIn.toLowerCase()
    )
    const flashInfo = getFlashInfo(data.flashLoanProvider as any, chainId, composerAddress)
    // @ts-ignore
    flashPoolType = flashInfo.poolType
    flashLoanData = flashInfo.data
    flashLoanProvider = flashInfo.provider
    flashPool = flashInfo.providerAddress!
    flashRepayBalanceHolder = flashInfo.balanceHolder!
  }

  return {
    flashLoanData,
    flashLoanProvider,
    flashRepayBalanceHolder,
    flashPoolType,
    flashPool,
  }
}

function getDebtAssetPrefunding(
  useCollateralAsset: boolean,
  selectedTrade: GenericTrade,
  flashAmount: SerializedCurrencyAmount | undefined,
  userPermit: { data: Hex; isPermit2?: boolean } | undefined,
  selectedExternal: ExternalCallParams
) {
  let zapAdditional: Hex = '0x'
  let updatedExternal = selectedExternal

  if (!useCollateralAsset) {
    const totalIn = CurrencyUtils.getAmount(selectedTrade.inputAmount)
    const borrowIn = BigInt(flashAmount!.amount)
    const userAmount = totalIn > borrowIn ? totalIn - borrowIn : 0n
    const userTokenAddress: Address = selectedTrade.inputAmount.currency.address as Address
    const isNativeUser = CurrencyUtils.isNativeAmount(selectedTrade.inputAmount)

    if (userAmount > 0n) {
      if (!isNativeUser) {
        let permitCalldata: Hex = '0x'
        let transferCalldata: Hex = '0x'
        if (userPermit) {
          permitCalldata = encodePermit(BigInt(PermitIds.TOKEN_PERMIT), userTokenAddress, userPermit.data as any)
          if (userPermit.isPermit2) {
            transferCalldata = encodePermit2TransferFrom(userTokenAddress, selectedExternal.callForwarder, userAmount)
          } else {
            transferCalldata = encodeTransferIn(userTokenAddress, selectedExternal.callForwarder, userAmount)
          }
        } else {
          transferCalldata = encodeTransferIn(userTokenAddress, selectedExternal.callForwarder, userAmount)
        }
        zapAdditional = packCommands([permitCalldata, transferCalldata])
        updatedExternal = { ...selectedExternal, additionalData: zapAdditional }
      } else {
        const existing = selectedExternal.value ? BigInt(selectedExternal.value) : 0n
        const updated = (existing + userAmount).toString()
        updatedExternal = { ...selectedExternal, value: updated as any }
      }
    }
  }

  return {
    zapAdditional,
    updatedExternal,
  }
}
