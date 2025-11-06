import { encodeFunctionData, zeroAddress } from 'viem'

import { EvmTxUtilsLite } from '../../txUtils'

import { PermitShared } from './utils/shared'

const DelegationWithSig = [
  { name: 'delegatee', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
]

export namespace CreditPermit {
  /**
   * @category credit permit
   * @dev same as for ERC20 permit, except that some of the names are different
   *      and the owner is not in the message
   */
  export function buildData(
    name: string,
    version: string,
    chainId: string,
    verifyingContract: string,
    delegatee: string,
    value: string | bigint,
    nonce: string | number,
    deadline: string | bigint | number = PermitShared.defaultDeadline.toString()
  ): EvmTxUtilsLite.EvmSignInputs {
    const data = {
      types: { EIP712Domain: PermitShared.EIP712Domain, DelegationWithSig },
      domain: { name, version, chainId, verifyingContract },
      message: { delegatee, value, nonce, deadline },
    } as const
    return { typedData: { ...data, primaryType: 'DelegationWithSig' }, chainId }
  }

  export function processSignature(
    delegator: string,
    delegatee: string,
    value: string | bigint,
    signature: any,
    deadline:
      | string
      | bigint
      | number = PermitShared.defaultDeadline.toString(),
    compact = false
  ) {
    const { v, r, s } = PermitShared.splitSignatureToVRS(signature)

    const permitCall = PermitShared.cutSelector(
      encodeDelegationWithSig(delegator, delegatee, value, deadline, v!, r, s)
    )

    const signatureCall = compact
      ? PermitShared.compressPermit(permitCall)
      : PermitShared.decompressPermit(
          PermitShared.compressPermit(permitCall),
          zeroAddress,
          delegator,
          delegatee
        )
    return { signature, signatureCall }
  }

  function encodeDelegationWithSig(
    delegator: string,
    delegatee: string,
    value: string | bigint,
    deadline: string | bigint | number,
    v: string | number | bigint,
    r: string,
    s: string | number
  ) {
    return encodeFunctionData({
      abi: [
        {
          inputs: PermitShared.ERC20PermitParams,
          name: 'delegationWithSig',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'delegationWithSig',
      // @ts-ignore
      args: [delegator, delegatee, value, deadline, v, r, s],
    })
  }
}
