import { isAddress, isHex, TransactionRequest } from 'viem'

/** Doing everything EMV style */
export namespace EvmTxUtilsLite {
  /** data to use for `.signTypedData({...})` */
  interface TypedEvmData {
    domain: Record<string, any>
    types: Record<string, any>
    message: Record<string, any>
    primaryType: string
  }

  /** message to use for `.signMessage({...})` */
  type TypedEvmMessageData = string

  type InternalEvmSignInputs = {
    typedData?: TypedEvmData
    message?: TypedEvmMessageData
    chainId: string
  }

  /** Generalized inputs for EVM off-chain signing */
  export type EvmSignInputs = InternalEvmSignInputs

  /* standard Evm transaction  object */
  export type EvmTransaction = TransactionRequest & { chainId: string }

  /** create a general EVM txn */
  export const createEVMTxn = (
    chainId: string,
    to: string,
    from: string,
    calldata: string,
    value: bigint | number | string = 0n
  ): EvmTransaction => {
    if (!isAddress(to)) throw new Error('Evm: Cannot create EVM txn without to address')
    if (!isAddress(from)) throw new Error('Cannot create EVM txn without from address')
    if (!isHex(calldata)) throw new Error('Cannot create EVM txn without calldata')
    return {
      chainId,
      to,
      from,
      data: calldata,
      value: BigInt(value),
    }
  }
}
