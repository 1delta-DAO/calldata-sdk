import { isAave, isCompoundV2, isCompoundV3, isInit } from '../../flashloan'
import { CompoundV2Lending } from '../../generic/compoundV2'
import { CompoundV3Lending } from '../../generic/compoundV3'
import { PosManager } from '../../generic/init'
import { UniversalToken } from '../../generic/token'
import {
  getAaveCollateralTokenAddress,
  getAaveStyleLenderTokenAddress,
  getCompoundV2CollateralTokenAddress,
  getCompoundV2Comptroller,
  getCompoundV3CometAddress,
  getInitPosManagerAddress,
} from '../../getters'
import { LendingMode } from '../../lending'
import { EvmTxUtilsLite } from '../../txUtils'

/**
 * Create the withdraw or borrow delegation transaction
 * Note that for some lender
 */
export function getLenderApproveTransaction(
  chainId: string,
  account: string,
  lender: string,
  tokenAddress: string,
  spender: string,
  mode: LendingMode,
  amount: bigint | string,
  posId?: string | bigint
) {
  // withdraw approval
  if (mode === LendingMode.NONE) {
    if (isAave(lender)) {
      return EvmTxUtilsLite.createEVMTxn(
        chainId,
        getAaveCollateralTokenAddress(chainId, lender, tokenAddress),
        account,
        UniversalToken.encodeApprove(spender, amount)
      )
    }
    if (isCompoundV3(lender)) {
      return EvmTxUtilsLite.createEVMTxn(
        chainId,
        getCompoundV3CometAddress(chainId, lender)!,
        account,
        CompoundV3Lending.encodeAllow(spender, true)
      )
    }
    if (isCompoundV2(lender)) {
      const token = getCompoundV2CollateralTokenAddress(chainId, lender, tokenAddress)!

      return EvmTxUtilsLite.createEVMTxn(chainId, token, account, UniversalToken.encodeApprove(spender, amount))
    }
    if (isInit(lender)) {
      return EvmTxUtilsLite.createEVMTxn(
        chainId,
        getInitPosManagerAddress(chainId),
        account,
        PosManager.encodeApprove(spender, posId!)
      )
    }
  } else {
    // borrow approvals
    if (isAave(lender)) {
      return EvmTxUtilsLite.createEVMTxn(
        chainId,
        getAaveStyleLenderTokenAddress(chainId, tokenAddress, lender, mode),
        account,
        UniversalToken.encodeApproveDelegation(spender, amount)
      )
    }
    if (isCompoundV3(lender)) {
      return EvmTxUtilsLite.createEVMTxn(
        chainId,
        getCompoundV3CometAddress(chainId, lender)!,
        account,
        CompoundV3Lending.encodeAllow(spender, true)
      )
    }
    if (isInit(lender)) {
      return EvmTxUtilsLite.createEVMTxn(
        chainId,
        getInitPosManagerAddress(chainId),
        account,
        PosManager.encodeApprove(spender, posId!)
      )
    }

    if (isCompoundV2(lender)) {
      return EvmTxUtilsLite.createEVMTxn(
        chainId,
        getCompoundV2Comptroller(chainId, lender)!,
        account,
        CompoundV2Lending.encodeUpdateDelegate(spender, true)
      )
    }

    return undefined
  }
  return undefined
}
