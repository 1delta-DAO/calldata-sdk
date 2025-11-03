import { Address, Hex, zeroAddress } from 'viem'
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
  getLenderData,
  isAaveType,
  packCommands,
  ComposerLendingActions,
  NO_VALUE,
  AaveInterestMode,
  isNativeAddress,
  isMoonwellWNativeTransferOut,
} from '..'

import { WRAPPED_NATIVE_INFO } from '@1delta/wnative'
import { isCompoundV2 } from '../../flashloan'

function validateCompoundV2WnativePayment(callerAssetAddress: string, wrappedNative: string, lender: string) {
  if (callerAssetAddress !== wrappedNative) throw new Error('caller asset needs to be wNative')
  if (!isCompoundV2(lender as any)) throw new Error('only compoundV2 types support native asset')
}

function validateCompoundV2Lender(lender: string) {
  if (!isCompoundV2(lender as any)) throw new Error('only compoundV2 types support native asset')
}

/**
 * Single entrypoint for direct lending actions
 * Always through the composer.
 * Handles wrap and unwrap based on user specified asset addresses
 */
export namespace ComposerDirectLending {
  export function composeDirectMoneyMarketAction(op: LendingOperation): { calldata: Hex; value: string | undefined } {
    if (!op.amount) {
      throw new Error('No amount is provided')
    }

    const {
      params,
      chainId,
      amount,
      lender,
      receiver,
      isAll,
      actionType,
      callerAssetAddress,
      lenderAssetAddress,
      composerAddress,
      permitData,
      morphoParams,
    } = op

    const isPermit2 = permitData?.isPermit2

    const lenderData: LenderData = getLenderData(lender as any, chainId, lenderAssetAddress)

    let value: string | undefined = undefined
    let permitCall = '0x'
    const wrappedNative = WRAPPED_NATIVE_INFO[chainId].address as Address

    // native flags
    const userAssetIsNative = isNativeAddress(callerAssetAddress)
    const lenderAssetIsNative = isNativeAddress(lenderAssetAddress)

    // validate them for sanity
    if (userAssetIsNative && !lenderAssetIsNative && lenderAssetAddress.toLowerCase() !== wrappedNative)
      throw new Error('Wrong corresponding pool for native caller asset')

    if (lenderAssetIsNative && !userAssetIsNative && callerAssetAddress.toLowerCase() !== wrappedNative)
      throw new Error('Wrong corresponding caller asset for native pool')

    switch (actionType) {
      case QuickActionType.Deposit: {
        const depo = ComposerLendingActions.createDeposit({
          receiver,
          amount,
          asset: lenderAssetAddress,
          chainId,
          lender: lender as any,
          morphoParams,
          transferType: TransferToLenderType.Amount,
        })
        let transferCall: string
        let unwrapCall = '0x'
        // nonnative case
        if (!userAssetIsNative) {
          // unwrap if it is e.g. WETH->cETH
          // native pool: Compound V2 only
          if (lenderAssetIsNative) {
            validateCompoundV2WnativePayment(callerAssetAddress, wrappedNative, lender)
            // add unwrap call to get native
            unwrapCall = encodeUnwrap(wrappedNative, composerAddress as Address, amount, SweepType.AMOUNT)
          }
          transferCall = isPermit2
            ? encodePermit2TransferFrom(callerAssetAddress as Address, composerAddress as Address, amount)
            : encodeTransferIn(callerAssetAddress as Address, composerAddress as Address, amount)
          if (permitData && permitData.data !== '0x') {
            permitCall = encodePermit(BigInt(PermitIds.TOKEN_PERMIT), callerAssetAddress as Address, permitData.data)
          }
        } else {
          // native pool: Compound V2 only ETH->cETH
          if (lenderAssetIsNative) {
            validateCompoundV2Lender(lender)
            transferCall = '0x' // no transfer needed
          } else {
            transferCall = encodeWrap(amount, wrappedNative)
          }
          value = amount.toString()
        }
        return {
          calldata: packCommands([permitCall, transferCall, unwrapCall, depo]),
          value,
        }
      }
      case QuickActionType.Withdraw: {
        const [amountToUse, withdrawType, sweepType] = isAll
          ? [NO_VALUE, TransferToLenderType.UserBalance, SweepType.VALIDATE]
          : [amount, TransferToLenderType.Amount, SweepType.AMOUNT]

        // create withdraw call with adjustable receiver
        const withdraw = (withdrawReceiver: string) =>
          ComposerLendingActions.createWithdraw({
            receiver: withdrawReceiver,
            amount,
            chainId,
            asset: lenderAssetAddress,
            lender: lender as any,
            transferType: withdrawType,
            morphoParams,
          })
        let withdrawCall: string
        let transferCall: string
        if (!userAssetIsNative) {
          // native pool: Compound V2 only: Handle cETH->WETH
          if (lenderAssetIsNative) {
            // simple withdraw to composer
            withdrawCall = withdraw(composerAddress)
            // validate payment
            validateCompoundV2WnativePayment(callerAssetAddress, wrappedNative, lender)
            // add unwrap call
            transferCall = packCommands([
              encodeWrap(BigInt(amountToUse), wrappedNative), // ETH->WETH
              encodeSweep(wrappedNative as Address, receiver as Address, BigInt(amountToUse), sweepType), // WETH->caller
            ])
          } else {
            if (
              callerAssetAddress === wrappedNative &&
              isMoonwellWNativeTransferOut(lender, lenderAssetAddress, wrappedNative, chainId)
            ) {
              withdrawCall = packCommands([
                withdraw(composerAddress), // withdraw native to composer
                encodeWrap(0n, wrappedNative), // wrap to wnative
              ])
              transferCall = encodeSweep(
                callerAssetAddress as Address,
                receiver as Address,
                BigInt(amountToUse),
                sweepType
              ) // sweep wnative to receiver
            } else {
              // TODO: directly withdraw to receiver
              withdrawCall = withdraw(composerAddress)
              transferCall = encodeSweep(
                lenderAssetAddress as Address,
                receiver as Address,
                BigInt(amountToUse),
                sweepType
              )
            }
          }
        } else {
          // native pool: Compound V2 only
          if (lenderAssetIsNative) {
            withdrawCall = withdraw(composerAddress)
            // validate that the pool is compound V2 - the only case where this can happen
            validateCompoundV2Lender(lender)
            // sweep native
            transferCall = encodeSweep(
              lenderAssetAddress as Address,
              receiver as Address,
              BigInt(amountToUse),
              sweepType
            )
          } else {
            // wnative -> native
            if (isMoonwellWNativeTransferOut(lender, lenderAssetAddress, wrappedNative, chainId)) {
              // moonwell will auto-unwrap to receiver
              withdrawCall = withdraw(composerAddress)
              transferCall = encodeSweep(zeroAddress, receiver as Address, BigInt(amountToUse), sweepType)
            } else {
              withdrawCall = withdraw(composerAddress)
              // ERC20-ERC20 -> plain sweep
              transferCall = encodeUnwrap(wrappedNative, receiver as Address, BigInt(amountToUse), sweepType)
            }
          }
        }
        if (permitData && permitData.data !== '0x') {
          // withdrawal means that we need the collateral token
          // we override it here to be sure
          const permitAsset = getPermitAsset(lenderData.group, lenderData, AaveInterestMode.NONE)
          if (permitAsset)
            permitCall = encodePermit(
              BigInt(isAaveType(lenderData.group) ? PermitIds.TOKEN_PERMIT : PermitIds.ALLOW_CREDIT_PERMIT),
              permitAsset as Address,
              permitData.data
            )
        }

        return {
          calldata: packCommands([permitCall, withdrawCall, transferCall]),
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
          amount,
          lender: lender as any,
          aaveInterestMode: params.aaveBorrowMode,
          morphoParams,
          asset: lenderAssetAddress,
          chainId,
        })
        let transferCall: string
        // handle the caller asset details
        if (!userAssetIsNative) {
          transferCall = encodeSweep(callerAssetAddress as Address, receiver as Address, amount, SweepType.AMOUNT)
        } else {
          if (lenderAssetIsNative) throw new Error('Borrowing native via smart contract: not supported')
          transferCall = encodeUnwrap(wrappedNative, receiver as Address, amount, SweepType.AMOUNT)
        }
        // handle permit
        if (permitData && permitData.data !== '0x') {
          const permitAsset = getPermitAsset(lenderData.group, lenderData, params.aaveBorrowMode)
          if (permitAsset)
            permitCall = encodePermit(
              BigInt(isAaveType(lenderData.group) ? PermitIds.AAVE_V3_CREDIT_PERMIT : PermitIds.ALLOW_CREDIT_PERMIT),
              permitAsset as Address,
              permitData.data
            )
        }

        return {
          calldata: packCommands([permitCall, borrow, transferCall]),
          value: NO_VALUE,
        }
      }
      case QuickActionType.Repay: {
        const adjustedAmount = adjustAmountForAll(amount, isAll)

        const repay = ComposerLendingActions.createRepay({
          receiver,
          amount,
          lender: lender as any,
          aaveInterestMode: params.aaveBorrowMode,
          morphoParams,
          asset: lenderAssetAddress,
          chainId,
          transferType:
            isAll && !isAaveType(lenderData.group) ? TransferToLenderType.UserBalance : TransferToLenderType.Amount,
        })

        let transferCall: string
        let unwrapCall = '0x' // only compound V2s might need unwrap for e.g. WETH->cETH repays
        if (!userAssetIsNative) {
          // ERC20: handle transfer
          transferCall = isPermit2
            ? encodePermit2TransferFrom(
                callerAssetAddress as Address,
                composerAddress as Address,
                BigInt(adjustedAmount)
              )
            : encodeTransferIn(callerAssetAddress as Address, composerAddress as Address, BigInt(adjustedAmount))
          // attach permit
          if (permitData && permitData.data !== '0x') {
            permitCall = encodePermit(BigInt(PermitIds.TOKEN_PERMIT), callerAssetAddress as Address, permitData.data)
          }
          // compound v2: unwrap after transferring wrapped native
          if (lenderAssetIsNative) {
            validateCompoundV2Lender(lender)
            unwrapCall = encodeUnwrap(wrappedNative, composerAddress as Address, amount, SweepType.AMOUNT)
          }
        } else {
          // compound v2: unwrap after transferring wrapped native
          if (lenderAssetIsNative) {
            // lender asset is native: no wrap or transfer needed
            validateCompoundV2Lender(lender)
            transferCall = '0x' // no transfer needed
          } else {
            transferCall = encodeWrap(adjustedAmount, wrappedNative)
          }
          value = adjustedAmount.toString()
        }
        // wrap & repay as default
        const commands = [permitCall, transferCall, unwrapCall, repay]
        // for repaying all, sweep whatever is left in the contract to the receiver
        if (isAll) {
          // sweep leftovers - unwrap if paid in native (and pool has native asset)
          if (userAssetIsNative && !lenderAssetIsNative)
            commands.push(encodeUnwrap(wrappedNative, receiver as Address, 0n, SweepType.VALIDATE))
          else commands.push(encodeSweep(lenderAssetAddress as Address, receiver as Address, 0n, SweepType.VALIDATE))
        }

        return {
          calldata: packCommands(commands),
          value,
        }
      }
      default:
        throw new Error('Unsupported operation')
    }
  }
}
