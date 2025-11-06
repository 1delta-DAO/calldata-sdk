import { encodeFunctionData } from 'viem'

import { PermitShared } from './utils/shared'
import { EvmTxUtilsLite } from '../../txUtils'
import { TokenFunctions } from '../../generic/token'

export const DaiLikePermit = [
  { name: 'holder', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
  { name: 'allowed', type: 'bool' },
]

export namespace DaiPermit {
  /**
   * @category permit
   * @notice Generates data to sign for Dai-like permit.
   * @param name The user readable name of signing EIP-712 domain
   * @param version The version of the token's EIP-712 domain.
   * @param chainId The unique identifier for the blockchain network.
   * @param verifyingContract The Ethereum address of the contract that will verify the signature. This ties the signature to a specific contract.
   * @param holder The wallet or signer issuing the permit.
   * @param spender The address allowed to spend the tokens.
   * @param allowed Boolean indicating whether the spender is allowed to spend.
   * @param nonce An arbitrary number used once to prevent replay attacks. Typically, this is the number of transactions sent by the owner.
   * @param expiry Time until when the permit is valid.
   * @return The data in Dai-like format.
   */
  export function buildData(
    name: string,
    version: string,
    chainId: string,
    verifyingContract: string,
    holder: string,
    spender: string,
    allowed: boolean,
    nonce: number | bigint | string,
    expiry: string | bigint | number = PermitShared.defaultDeadline.toString()
  ): EvmTxUtilsLite.EvmSignInputs {
    const data = {
      types: { Permit: DaiLikePermit },
      domain: { name, version, chainId, verifyingContract },
      message: { holder, spender, nonce, expiry, allowed },
    } as const
    return { typedData: { ...data, primaryType: 'Permit' }, chainId }
  }

  export function processSignature(
    holder: string,
    spender: string,
    allowed: boolean,
    nonce: number | bigint | string,
    signature: any,
    expiry: string | bigint | number = PermitShared.defaultDeadline.toString(),
    compact = false
  ) {
    const { v, r, s } = PermitShared.splitSignatureToVRS(signature)

    const permitCall = encodeDaiLikePermit(holder, spender, nonce, expiry, allowed, v!, r, s)

    // cut selector when compact
    const signatureCall = compact ? PermitShared.compressPermit(PermitShared.cutSelector(permitCall)) : permitCall
    return { signature, signatureCall }
  }

  function encodeDaiLikePermit(
    holder: string,
    spender: string,
    nonce: number | bigint | string,
    expiry: number | bigint | string,
    allowed: boolean,
    v: bigint | string,
    r: string,
    s: string
  ) {
    return encodeFunctionData({
      abi: [
        {
          inputs: PermitShared.DaiPermitParams,
          name: 'permit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: TokenFunctions.Permit,
      args: [holder, spender, nonce, expiry, allowed, v, r, s],
    })
  }
}
