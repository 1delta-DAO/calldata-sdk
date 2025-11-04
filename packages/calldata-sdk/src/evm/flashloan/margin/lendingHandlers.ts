import { Address, Hex, zeroAddress } from 'viem'
import { encodeSweep, SweepType, encodePermit, PermitIds, encodeWrap } from '@1delta/calldatalib'
import {
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
  isNativeAddress,
  ComposerLendingActions,
  CreateWithdrawParams,
  safeEncodeWrap,
} from '../../lending'
import { HandleRepayParams, HandleWithdrawParams } from '../types'
import { isAave } from '../utils'
import { WRAPPED_NATIVE_INFO } from '@1delta/wnative'
import { Lender } from '@1delta/lender-registry'
import { Chain } from '@1delta/chain-registry'

/**
 * Parametrize a repay transaction for margin.
 * Special cases:
 *    maximum out: needs sweep of output token to user in case we attempt to repay too much
 *
 * Native is already handled correctly
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
      asset: tokenOut.address,
      amount: BigInt(amount),
      chainId: tokenOut.chainId,
      lender,
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
      asset: tokenOut.address,
      amount: BigInt(repayAmount),
      chainId: tokenOut.chainId,
      lender,
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
 *  maximum in:
 *      - we withdraw the user balance to the contract
 *      - we handle the flash loan repayment
 *      - a sweep of excess deposits is added
 * tokenIn is native:
 *      - we assume that flas loans are always paid in ERC20
 *      - as such, withdrawing from COmpound V2, requires special treatment:
 *        - always wrap after withdrawal
 *        - manually sweep wnative to flash source if needed
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
    composerAddress,
  } = params

  // do the conversion here for simplicity
  const flashLoanAmountWithFeeBigInt = BigInt(flashLoanAmountWithFee)

  // get lender data
  const lenderData = getLenderData(lender, tokenIn.chainId, tokenIn.address)

  let permitCall: Hex = '0x'
  if (permitData && permitData.data !== '0x') {
    const permitAsset = getPermitAsset(lenderData.group, lenderData)
    if (permitAsset) {
      permitCall = encodePermit(
        BigInt(isAaveType(lenderData.group) ? PermitIds.TOKEN_PERMIT : PermitIds.ALLOW_CREDIT_PERMIT),
        permitAsset as Address,
        permitData.data
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

  // get data for native handling
  const wnative = WRAPPED_NATIVE_INFO[tokenIn.chainId].address as Address
  const inputIsNative = isNativeAddress(tokenIn.address)

  if (isMaxIn) {
    // Maximum in: withdraw everything to intermediate
    // transfer what is needed tof flash source
    // sweep leftovers to caller

    const withdrawCalldata = createWithdrawWrapped({
      receiver: intermediate, // intermediate receives funds
      asset: tokenIn.address,
      amount: 0n,
      chainId: tokenIn.chainId,
      lender,
      transferType: TransferToLenderType.UserBalance,
      morphoParams,
      useOverride,
      composerAddress,
      wnative,
    })

    // add permit to withdraw
    context.callOut = packCommands([permitCall, withdrawCalldata])

    // refunds excess funds to caller (will correctly handle native already)
    context.cleanup = encodeSweep(tokenIn.address as Address, account, 0n, SweepType.VALIDATE)

    // if the flash loan does not pull funds manually, we add a flash loan repay transfer
    if (flashRepayBalanceHolder !== intermediate) {
      // in case we withdraw native, we wrap
      if (inputIsNative) {
        context.manualFlashLoanRepayTransfer = packCommands([
          // wrap to get wnative
          encodeWrap(flashLoanAmountWithFeeBigInt, wnative),
          // sweep wnative to fash source
          encodeSweep(zeroAddress, flashRepayBalanceHolder, flashLoanAmountWithFeeBigInt, SweepType.AMOUNT),
        ])
      } else {
        context.manualFlashLoanRepayTransfer = encodeSweep(
          tokenIn.address as Address,
          flashRepayBalanceHolder, // = intermediate
          flashLoanAmountWithFeeBigInt,
          SweepType.AMOUNT
        )
      }
    } else {
      if (inputIsNative) {
        // if we wrap here, we will hold the correct amount in wnative
        context.manualFlashLoanRepayTransfer = encodeWrap(flashLoanAmountWithFeeBigInt, wnative)
      }
    }
  }
  // default case -  we withdraw an exact amount
  else {
    let withdrawCalldata = '0x'
    if (inputIsNative) {
      withdrawCalldata = packCommands([
        // we withdraw native to the intermediate (composer)
        createWithdrawWrapped({
          receiver: intermediate,
          asset: zeroAddress,
          amount: flashLoanAmountWithFeeBigInt,
          chainId: tokenIn.chainId,
          lender,
          transferType: TransferToLenderType.Amount,
          morphoParams,
          useOverride,
          composerAddress,
          wnative,
        }),
        // then wrap to wnative - note that the do not need to sweep here
        encodeWrap(flashLoanAmountWithFeeBigInt, wnative),
        flashRepayBalanceHolder === intermediate // no transfer needed
          ? '0x'
          : // sweep wnative to fash source
            encodeSweep(zeroAddress, flashRepayBalanceHolder, flashLoanAmountWithFeeBigInt, SweepType.AMOUNT),
      ])
    } else {
      // the most common case - withdraw ERC20 directly to whatever the target is
      // skips self-transfers
      withdrawCalldata = createWithdrawWrapped({
        receiver: flashRepayBalanceHolder,
        asset: tokenIn.address,
        amount: flashLoanAmountWithFeeBigInt,
        chainId: tokenIn.chainId,
        lender,
        transferType: TransferToLenderType.Amount,
        morphoParams,
        useOverride,
        composerAddress,
        wnative,
      })
    }

    // add permit to withdraw
    context.callOut = packCommands([permitCall, withdrawCalldata])
  }
  return context
}

/** wrapped function to handle some special cases */
function createWithdrawWrapped(params: CreateWithdrawParams & { composerAddress: string; wnative: string }) {
  const {
    asset,
    amount,
    lender,
    morphoParams,
    useOverride,
    chainId,
    receiver,
    composerAddress,
    transferType,
    wnative,
  } = params

  // normal case
  if (lender !== Lender.MOONWELL || asset !== wnative || chainId === Chain.MOONBEAM) {
    return ComposerLendingActions.createWithdraw({
      receiver,
      asset,
      amount,
      chainId,
      lender,
      transferType,
      morphoParams,
      useOverride,
    })
  }

  // moonwell wnative withdrawal -> we undo the manual unwrap
  const withdraw = ComposerLendingActions.createWithdraw({
    receiver: composerAddress,
    asset,
    amount,
    chainId,
    lender,
    transferType,
    morphoParams,
    useOverride,
  })
  const wrap = safeEncodeWrap(0n, wnative as any)
  const sweep = encodeSweep(wnative as any, receiver as any, 0n, SweepType.VALIDATE)

  return packCommands([withdraw, wrap, sweep])
}
