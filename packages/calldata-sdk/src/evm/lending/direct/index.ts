import { Address, Hex } from 'viem'
import {
  PermitIds,
  SweepType,
  encodePermit2TransferFrom,
  encodeSweep,
  encodeTransferIn,
  encodeUnwrap,
  encodeWrap,
  encodePermit,
} from '@1delta/calldatalib'
import {
  LenderData,
  LendingOperation,
  QuickActionType,
  TransferToLenderType,
  adjustAmountForAll,
  getPermitAsset,
  getAssetParamsFromAmount,
  getLenderData,
  isAaveType,
  packCommands,
  ComposerLendingActions,
  NO_VALUE,
  AaveInterestMode,
} from '..'

import { WRAPPED_NATIVE_INFO } from '@1delta/wnative'

export namespace ComposerDirectLending {
  export function composeDirectMoneyMarketAction(op: LendingOperation): { calldata: Hex; value: string | undefined } {
    if (!op.params.amount) {
      throw new Error('No amount is provided')
    }

    const {
      params,
      receiver,
      isAll,
      actionType,
      inIsNative = false,
      outIsNative = false,
      composerAddress,
      permitData,
      morphoParams,
    } = op

    const isPermit2 = permitData?.isPermit2
    const { asset, rawAmount, chainId } = getAssetParamsFromAmount(params.amount)

    const lenderData: LenderData = getLenderData(params.lender, chainId, asset)

    let value: string | undefined = undefined
    let permitCall = '0x'
    const wrappedNative = WRAPPED_NATIVE_INFO[chainId].address as Address

    switch (actionType) {
      case QuickActionType.Deposit: {
        const depo = ComposerLendingActions.createDeposit({
          receiver,
          amount: params.amount,
          lender: params.lender,
          morphoParams,
          transferType: TransferToLenderType.Amount,
        })
        let transferCall: string
        if (!inIsNative) {
          transferCall = isPermit2
            ? encodePermit2TransferFrom(asset as Address, composerAddress as Address, BigInt(rawAmount))
            : encodeTransferIn(asset as Address, composerAddress as Address, BigInt(rawAmount))
          if (permitData && permitData.data !== '0x') {
            permitCall = encodePermit(BigInt(PermitIds.TOKEN_PERMIT), asset as Address, permitData.data)
          }
        } else {
          transferCall = encodeWrap(BigInt(rawAmount), wrappedNative)
          value = rawAmount.toString()
        }
        return {
          calldata: packCommands([permitCall, transferCall, depo]),
          value,
        }
      }
      case QuickActionType.Withdraw: {
        const [amountToUse, withdrawType, sweepType] = isAll
          ? [NO_VALUE, TransferToLenderType.UserBalance, SweepType.VALIDATE]
          : [rawAmount, TransferToLenderType.Amount, SweepType.AMOUNT]
        let intermediateReceiver = composerAddress

        const withdraw = ComposerLendingActions.createWithdraw({
          receiver: intermediateReceiver,
          amount: params.amount,
          lender: params.lender,
          transferType: withdrawType,
          morphoParams,
        })
        let transferCall: string
        if (!outIsNative) {
          transferCall = encodeSweep(asset as Address, receiver as Address, BigInt(amountToUse), sweepType)
        } else {
          transferCall = encodeUnwrap(wrappedNative, receiver as Address, BigInt(amountToUse), sweepType)
        }
        if (permitData && permitData.data !== '0x') {
          // withdrawal means that we need the collateral token
          // we override it here to be sure
          const permitAsset = getPermitAsset(lenderData.group, lenderData, AaveInterestMode.NONE)
          if (permitAsset)
            permitCall = encodePermit(
              BigInt(isAaveType(lenderData.group) ? PermitIds.TOKEN_PERMIT : PermitIds.ALLOW_CREDIT_PERMIT),
              permitAsset as Address,
              permitData.data,
            )
        }

        return {
          calldata: packCommands([permitCall, withdraw, transferCall]),
          value: NO_VALUE,
        }
      }
      case QuickActionType.Borrow: {
        let intermediateReceiver = composerAddress

        if (isAaveType(lenderData.group) && !params.aaveBorrowMode) {
          throw new Error('Borrow mode is required for AaveV2/V3 borrows')
        }

        const borrow = ComposerLendingActions.createBorrow({
          receiver: intermediateReceiver,
          amount: params.amount,
          lender: params.lender,
          aaveInterestMode: params.aaveBorrowMode,
          morphoParams,
        })
        let transferCall: string
        if (!outIsNative) {
          transferCall = encodeSweep(asset as Address, receiver as Address, BigInt(rawAmount), SweepType.AMOUNT)
        } else {
          transferCall = encodeUnwrap(wrappedNative, receiver as Address, BigInt(rawAmount), SweepType.AMOUNT)
        }
        if (permitData && permitData.data !== '0x') {
          const permitAsset = getPermitAsset(lenderData.group, lenderData, params.aaveBorrowMode)
          if (permitAsset)
            permitCall = encodePermit(
              BigInt(isAaveType(lenderData.group) ? PermitIds.AAVE_V3_CREDIT_PERMIT : PermitIds.ALLOW_CREDIT_PERMIT),
              permitAsset as Address,
              permitData.data,
            )
        }

        return {
          calldata: packCommands([permitCall, borrow, transferCall]),
          value: NO_VALUE,
        }
      }
      case QuickActionType.Repay: {
        const adjustedAmount = adjustAmountForAll(rawAmount, isAll)

        const repay = ComposerLendingActions.createRepay({
          receiver,
          amount: params.amount,
          lender: params.lender,
          aaveInterestMode: params.aaveBorrowMode,
          morphoParams,
          transferType:
            isAll && !isAaveType(lenderData.group) ? TransferToLenderType.UserBalance : TransferToLenderType.Amount,
        })

        let transferCall: string
        if (!inIsNative) {
          transferCall = isPermit2
            ? encodePermit2TransferFrom(asset as Address, composerAddress as Address, BigInt(adjustedAmount))
            : encodeTransferIn(asset as Address, composerAddress as Address, BigInt(adjustedAmount))
          if (permitData && permitData.data !== '0x') {
            permitCall = encodePermit(BigInt(PermitIds.TOKEN_PERMIT), asset as Address, permitData.data)
          }
        } else {
          transferCall = encodeWrap(adjustedAmount, wrappedNative)
          value = adjustedAmount.toString()
        }
        // wrap & repay as default
        const commands = [permitCall, transferCall, repay]
        // for repaying all, sweep whatever is left in the contract to the receiver
        if (isAll) {
          if (inIsNative) commands.push(encodeUnwrap(wrappedNative, receiver as Address, 0n, SweepType.VALIDATE))
          else commands.push(encodeSweep(asset as Address, receiver as Address, 0n, SweepType.VALIDATE))
        }

        return {
          calldata: packCommands(commands),
          value,
        }
      }
    }
  }
}
