import { UniversalToken } from "../../generic/token"
import { EvmTxUtilsLite } from "../../txUtils"

export const createApproveTransaction = (
  chainId: string,
  account: string,
  spender: string,
  token: string,
  amount: bigint | string
) => {
  return EvmTxUtilsLite.createEVMTxn(
    chainId,
    token,
    account,
    UniversalToken.encodeApprove(spender, amount) // no value
  )
}