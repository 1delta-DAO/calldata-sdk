import { Address, Hex } from 'viem'
import { encodeSweep, SweepType, encodePermit, PermitIds } from '@1delta/calldatalib'
import {
  ComposerLendingActions,
  TransferToLenderType,
  adjustAmountForAll,
  getCollateralToken,
  getDebtToken,
  getIsBaseToken,
  getLenderData,
  getPool,
  getPermitAsset,
  isAaveType,
  packCommands,
} from '../../lending'
import { HandleRepayParams, HandleWithdrawParams } from '../types'
import { isAave } from '../utils'

/**
 * Parametrize a repay transaction for margin.
 * Special cases:
 *    maximum out: needs sweep of output token to user in case we attempt to repay too much
 */
export function handleRepay(params: HandleRepayParams) {
  const { isMaxOut, lender, account, repayAmount, marginData, tokenOut, context, morphoParams } = params
  // get lender data
  const lenderData = getLenderData(lender, tokenOut.chainId, tokenOut.address)

  // repay
  if (isMaxOut) {
    let amount = '0'
    let transferToLenderType = TransferToLenderType.UserBalance
    // we overpay for aaves
    if (isAave(lender)) {
      amount = adjustAmountForAll(repayAmount, true).toString()
      transferToLenderType = TransferToLenderType.Amount
    }

    context.callIn = ComposerLendingActions.createRepay({
      receiver: account,
      amount: { asset: tokenOut.address, amount: BigInt(amount), chainId: tokenOut.chainId },
      lender: lender,
      aaveInterestMode: marginData.irModeOut,
      morphoParams,
      transferType: transferToLenderType,
      useOverride: {
        pool: getPool(lenderData),
        collateralToken: getCollateralToken(lenderData),
        debtToken: getDebtToken(lenderData),
      },
    })
    // in this case, we expect to receive more than the debt balance
    context.cleanup = encodeSweep(tokenOut.address as Address, account, 0n, SweepType.VALIDATE)
  } else {
    context.callIn = ComposerLendingActions.createRepay({
      receiver: account,
      amount: { asset: tokenOut.address, amount: BigInt(repayAmount), chainId: tokenOut.chainId },
      lender: lender,
      aaveInterestMode: marginData.irModeOut,
      morphoParams,
      transferType: TransferToLenderType.ContractBalance,
      useOverride: {
        pool: getPool(lenderData),
        collateralToken: getCollateralToken(lenderData),
        debtToken: getDebtToken(lenderData),
      },
    })
  }

  return context
}

/**
 * Special case
 *  maximum in: - we withdraw the user balance to the contract
 *              - we handle the flash loan repayment
 *              - a sweep of excess deposits is added
 */
export function handleWithdraw(params: HandleWithdrawParams) {
  const {
    isMaxIn,
    lender,
    account,
    tokenIn,
    intermediate,
    flashRepayBalanceHolder,
    flashLoanAmountWithFee,
    context,
    morphoParams,
    permitData,
  } = params
  // get lender data
  const lenderData = getLenderData(lender, tokenIn.chainId, tokenIn.address)

  let permitCall: Hex = '0x'
  if (permitData && permitData.data !== '0x') {
    const permitAsset = getPermitAsset(lenderData.group, lenderData)
    if (permitAsset) {
      permitCall = encodePermit(
        BigInt(isAaveType(lenderData.group) ? PermitIds.TOKEN_PERMIT : PermitIds.ALLOW_CREDIT_PERMIT),
        permitAsset as Address,
        permitData.data,
      )
    }
  }

  const useOverride = morphoParams
    ? undefined
    : {
        pool: getPool(lenderData)!,
        collateralToken: getCollateralToken(lenderData)!,
        isBase: getIsBaseToken(lenderData, tokenIn.address)!,
      }

  if (isMaxIn) {
    // Maximum in: withdraw everything to intermediate
    const withdrawCalldata = ComposerLendingActions.createWithdraw({
      receiver: intermediate, // intermediate receives funds
      amount: { asset: tokenIn.address, amount: 0n, chainId: tokenIn.chainId }, // amount is ignored in this case
      lender: lender,
      transferType: TransferToLenderType.UserBalance,
      morphoParams,
      useOverride,
    })

    // add permit to withdraw
    context.callOut = packCommands([permitCall, withdrawCalldata])

    // refunds excess funds to caller
    context.cleanup = encodeSweep(tokenIn.address as Address, account, 0n, SweepType.VALIDATE)
    // if the flash loan does not pull funds manually, we add a flash loan repay transfer
    if (flashRepayBalanceHolder !== intermediate) {
      context.manualFlashLoanRepayTransfer = encodeSweep(
        tokenIn.address as Address,
        flashRepayBalanceHolder,
        BigInt(flashLoanAmountWithFee),
        SweepType.AMOUNT,
      )
    }
  } else {
    const withdrawCalldata = ComposerLendingActions.createWithdraw({
      receiver: flashRepayBalanceHolder,
      amount: { asset: tokenIn.address, amount: BigInt(flashLoanAmountWithFee), chainId: tokenIn.chainId },
      lender: lender,
      transferType: TransferToLenderType.Amount,
      morphoParams,
      useOverride,
    })

    // add permit to withdraw
    context.callOut = packCommands([permitCall, withdrawCalldata])
  }
  return context
}
