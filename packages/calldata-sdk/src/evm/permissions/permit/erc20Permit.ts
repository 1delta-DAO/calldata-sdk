import { encodeFunctionData } from 'viem'

import { PermitShared } from './utils/shared'
import { EvmTxUtilsLite } from '../../txUtils'
import { TokenFunctions } from '../../generic/token'

const Permit = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
]

export namespace ERC20Permit {
  /**
   * @category permit
   * @dev Constructs structured data for EIP-2612 permit function, including types, domain, and message with details about the permit.
   * @param name The user readable name of signing EIP-712 domain
   * @param version The version of the signing EIP-712 domain.
   * @param chainId The unique identifier for the blockchain network.
   * @param verifyingContract The Ethereum address of the contract that will verify the signature. This ties the signature to a specific contract.
   * @param owner The Ethereum address of the token owner granting permission to spend tokens on their behalf.
   * @param spender The Ethereum address of the party being granted permission to spend tokens on behalf of the owner.
   * @param value The amount of tokens the spender is permitted to spend.
   * @param nonce An arbitrary number used once to prevent replay attacks. Typically, this is the number of transactions sent by the owner.
   * @param deadline The timestamp until which the permit is valid. This provides a window of time in which the permit can be used.
   */
  export function buildData(
    name: string,
    version: string,
    chainId: string,
    verifyingContract: string,
    owner: string,
    spender: string,
    value: string | bigint,
    nonce: string | number,
    deadline: string | bigint | number = PermitShared.defaultDeadline.toString()
  ): EvmTxUtilsLite.EvmSignInputs {
    return {
      typedData: {
        types: {
          EIP712Domain: PermitShared.EIP712Domain,
          Permit,
        },
        domain: { name, version, chainId, verifyingContract },
        message: { owner, spender, value, nonce, deadline },
        primaryType: 'Permit',
      },
      chainId,
    }
  }

  export function processSignature(
    owner: string,
    spender: string,
    value: string | bigint,
    signature: any,
    deadline: string | bigint | number = PermitShared.defaultDeadline.toString(),
    compact = false
  ) {
    const { v, r, s } = PermitShared.splitSignatureToVRS(signature)
    const permitCall = encodeERC20Permit(owner, spender, value, deadline, v!, r, s)

    // cut selector when compact
    const signatureCall = compact ? PermitShared.compressPermit(PermitShared.cutSelector(permitCall)) : permitCall
    return { signature, signatureCall }
  }

  function encodeERC20Permit(
    owner: string,
    spender: string,
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
          name: 'permit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: TokenFunctions.Permit,
      args: [owner, spender, value, deadline, v, r, s],
    })
  }
}
