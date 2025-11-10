import { encodeSweep, SweepType, encodePermit, PermitIds } from '@1delta/calldatalib'
import { MarginData, MarginTradeType, NO_CONTEXT } from '..'
import {
  TransferToLenderType,
  getCollateralToken,
  getPool,
  packCommands,
  isAaveType,
  getPermitAsset,
  LenderData,
  ComposerLendingActions,
} from '../../lending'
import { handleWithdraw, handleRepay } from './lendingHandlers'
import { Address, Hex } from 'viem'
import { ContractCallsContext, getAssetInFromTrade, getAssetOutFromTrade, SwapObject } from '../../../utils'
import { SerializedCurrency } from '@1delta/type-sdk'

/**
 * These are the lending inner callback lending datas
 *  The output has the following datas
 *   callIn     -> funding the swap
 *   callOut    -> handing swap output
 *   cleanup    -> cleanup of leftover output
 */
export function buildMarginInnerCall(
  trade: SwapObject,
  account: Address,
  marginData: MarginData,
  inLenderData: LenderData,
  outLenderData: LenderData,
  flashRepayBalanceHolder: string,
  intermediate: string, // <- expected to be the composer
  flashLoanAmountWithFee: string,
  isMaxIn: boolean,
  isMaxOut: boolean,
  composerAddress: string
) {
  const { lender, morphoParamsIn, morphoParamsOut, permitData } = marginData
  /** Build callIn [call before swap] and calOut [call after swap] */
  // we use a context object that we progressively populate with the tx details
  let context: ContractCallsContext

  /** get token and lender info */
  const tokenIn = getAssetInFromTrade(trade) as Address
  const tokenOut = getAssetOutFromTrade(trade) as Address

  switch (marginData.marginTradeType) {
    case MarginTradeType.Open: {
      context = { ...NO_CONTEXT }
      context.callIn = ComposerLendingActions.createDeposit({
        receiver: account as Address,
        amount: 0n,
        asset: tokenOut,
        chainId: trade.outputAmount.currency.chainId,
        lender: lender,
        morphoParams: morphoParamsOut,
        transferType: TransferToLenderType.ContractBalance,
        useOverride: morphoParamsOut
          ? undefined
          : {
              pool: getPool(outLenderData)!,
            },
      })

      let borrowPermitCall: Hex = '0x'
      if (permitData && permitData.data !== '0x') {
        const permitAsset = getPermitAsset(inLenderData.group, inLenderData, marginData.irModeIn)
        if (permitAsset) {
          borrowPermitCall = encodePermit(
            BigInt(isAaveType(inLenderData.group) ? PermitIds.AAVE_V3_CREDIT_PERMIT : PermitIds.ALLOW_CREDIT_PERMIT),
            permitAsset as Address,
            permitData.data
          )
        }
      }

      const borrowCalldata = ComposerLendingActions.createBorrow({
        receiver: flashRepayBalanceHolder as Address,
        asset: tokenIn,
        amount: BigInt(flashLoanAmountWithFee),
        chainId: trade.inputAmount.currency.chainId,
        lender: lender,
        lendingMode: marginData.irModeIn,
        morphoParams: morphoParamsIn,
        useOverride: morphoParamsIn
          ? undefined
          : {
              pool: getPool(inLenderData),
              collateralToken: getCollateralToken(inLenderData),
            },
      })

      // add permit to borrow
      context.callOut = packCommands([borrowPermitCall, borrowCalldata])
      break
    }
    case MarginTradeType.Close: {
      context = { ...NO_CONTEXT }
      let repayAmount = 0n
      // repay handling
      context = handleRepay({
        isMaxOut,
        lender,
        account,
        repayAmount,
        marginData,
        tokenOut: trade.outputAmount.currency,
        context,
        morphoParams: morphoParamsOut,
      })
      // withdrawal handling
      context = handleWithdraw({
        isMaxIn,
        lender,
        account,
        tokenIn: trade.inputAmount.currency,
        intermediate: intermediate as Address,
        flashRepayBalanceHolder: flashRepayBalanceHolder as Address,
        flashLoanAmountWithFee,
        context,
        morphoParams: morphoParamsIn,
        permitData,
        composerAddress,
      })

      break
    }
    case MarginTradeType.CollateralSwap: {
      context = { ...NO_CONTEXT }
      context.callIn = ComposerLendingActions.createDeposit({
        receiver: account as Address,
        asset: tokenOut,
        amount: 0n,
        chainId: trade.outputAmount.currency.chainId,
        lender: lender,
        morphoParams: morphoParamsOut,
        transferType: TransferToLenderType.ContractBalance,
        useOverride: morphoParamsIn
          ? undefined
          : {
              pool: getPool(outLenderData)!,
            },
      })
      context = handleWithdraw({
        isMaxIn,
        lender,
        account,
        tokenIn: trade.inputAmount.currency,
        intermediate: intermediate as Address,
        flashRepayBalanceHolder: flashRepayBalanceHolder as Address,
        flashLoanAmountWithFee,
        context,
        morphoParams: morphoParamsIn,
        permitData,
        composerAddress,
      })

      break
    }
    case MarginTradeType.DebtSwap: {
      context = { ...NO_CONTEXT }
      let repayAmount = 0n
      // repay handling
      context = handleRepay({
        isMaxOut,
        lender,
        account,
        repayAmount,
        marginData,
        tokenOut: trade.outputAmount.currency,
        context,
        morphoParams: morphoParamsOut,
      })

      let borrowPermitCall: Hex = '0x'
      if (permitData && permitData.data !== '0x') {
        const permitAsset = getPermitAsset(inLenderData.group, inLenderData, marginData.irModeIn)
        if (permitAsset) {
          borrowPermitCall = encodePermit(
            BigInt(isAaveType(inLenderData.group) ? PermitIds.AAVE_V3_CREDIT_PERMIT : PermitIds.ALLOW_CREDIT_PERMIT),
            permitAsset as Address,
            permitData.data
          )
        }
      }

      // borrow
      const borrowCalldata = ComposerLendingActions.createBorrow({
        receiver: flashRepayBalanceHolder as Address,
        asset: tokenIn,
        amount: BigInt(flashLoanAmountWithFee),
        chainId: trade.inputAmount.currency.chainId,
        lender: lender,
        lendingMode: marginData.irModeIn,
        morphoParams: morphoParamsIn,
        useOverride: morphoParamsIn
          ? undefined
          : {
              pool: getPool(inLenderData),
              collateralToken: getCollateralToken(inLenderData),
            },
      })

      // add permit to borrow
      context.callOut = packCommands([borrowPermitCall, borrowCalldata])

      break
    }
    default:
      throw new Error('unexpected margin trade type')
  }

  let safetySweep = '0x'

  // safely sweep any output leftovers in case of overpaying
  // this cannot occur for opening and collateral swaps
  if (marginData.marginTradeType === MarginTradeType.Close || marginData.marginTradeType === MarginTradeType.DebtSwap) {
    safetySweep = encodeSweep(
      trade.outputAmount.currency.address as Address,
      account as Address,
      0n,
      SweepType.VALIDATE
    )
  }

  return {
    context,
    safetySweep,
  }
}

export function handlePendle(trade: SwapObject, receiver: Address): Hex {
  const outputWithProps = trade.outputAmount.currency as SerializedCurrency & { props?: { [key: string]: any } }
  const isPendle = outputWithProps.props?.pendle?.tokenType === 'PT'
  if (isPendle) {
    const ytToken = outputWithProps.props?.pendle?.ytAddress
    if (ytToken) {
      return encodeSweep(ytToken as Address, receiver, 0n, SweepType.VALIDATE)
    }
  }
  return '0x'
}
