import { encodeFunctionData, maxUint256 } from 'viem'

import { PermitShared } from './utils/shared'
import { Chain } from '@1delta/chain-registry'
import { EvmTxUtilsLite } from '../../txUtils'

/** Moprho has a smaller domain than usual */
const EIP712Domain = [
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]

const Authorization = [
  { name: 'authorizer', type: 'address' },
  { name: 'authorized', type: 'address' },
  { name: 'isAuthorized', type: 'bool' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
]

/**
 * Verifying contract for Lista is the implementation
 * This is likely an error due to misunderstanding of how to ecrecover in a proxy
 */
const listaImpls: any = {
  [Chain.ETHEREUM_MAINNET]: '0x703ac563d4dfb3404dd8a31551f978e85eebb1ce',
  [Chain.BNB_SMART_CHAIN_MAINNET]: '0xa621ef111f3fca840bfcc6db5d0e534636f14dca',
}

export namespace MorphoCreditPermit {
  /**
   * @category credit permit
   * @dev same as for ERC20 permit, except that some of the names are different
   *      and the authorizer is not in the message
   */
  export function buildData(
    chainId: string,
    verifyingContract: string,
    authorizer: string,
    authorized: string,
    isAuthorized: boolean,
    nonce: string | number,
    deadline: string | bigint | number = PermitShared.defaultDeadline.toString(),
    isLista = false
  ): EvmTxUtilsLite.EvmSignInputs {
    const data = {
      types: { EIP712Domain, Authorization },
      domain: {
        chainId,
        verifyingContract: isLista ? listaImpls[chainId] : verifyingContract,
      },
      message: { authorizer, authorized, isAuthorized, nonce, deadline },
    } as const
    return { typedData: { ...data, primaryType: 'Authorization' }, chainId }
  }

  export function processSignature(
    authorizer: string,
    authorized: string,
    isAuthorized: boolean,
    nonce: bigint,
    signature: any,
    deadline: string | bigint | number = PermitShared.defaultDeadline.toString(),
    compact = false
  ) {
    const { v, r, s } = PermitShared.splitSignatureToVRS(signature)

    const signatureCall = !compact
      ? PermitShared.cutSelector(encodeAuthorizewBySig(authorizer, authorized, isAuthorized, nonce, deadline, v!, r, s))
      : getCompressedPermit(isAuthorized, nonce, deadline, v!, r, s)

    return { signature, signatureCall }
  }

  function encodeAuthorizewBySig(
    authorizer: string,
    authorized: string,
    isAuthorized: boolean,
    nonce: bigint,
    deadline: string | bigint | number,
    v: string | number | bigint,
    r: string,
    s: string | number
  ) {
    return encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'authorizer',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'authorized',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'isAuthorized',
              type: 'bool',
            },
            {
              internalType: 'uint256',
              name: 'nonce',
              type: 'uint256',
            },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' },
          ],
          name: 'setAuthorizationWithSig',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'setAuthorizationWithSig',
      // @ts-ignore
      args: [authorizer, authorized, isAuthorized, nonce, deadline, v, r, s],
    })
  }

  const allowFlag = 1n << 255n
  const isMorphoFlag = 1n << 254n

  function getCompressedPermit(
    isAuthorized: boolean,
    nonce: bigint,
    deadline: string | bigint | number,
    v: string | number | bigint,
    r: string,
    s: string | number,
    isMorpho = true
  ) {
    // Compact IAuthorizeBySig.permit(uint256 nonceAndisAuthorized, uint32 deadline, uint256 r, uint256 vs)
    let nonceAndAllowed = BigInt(nonce)
    if (isAuthorized) nonceAndAllowed = (nonceAndAllowed & ~allowFlag) | allowFlag
    if (isMorpho) nonceAndAllowed = (nonceAndAllowed & ~isMorphoFlag) | isMorphoFlag
    // Compact IAuthorizeBySig.permit(uint256 nonceAndisAuthorized, uint32 deadline, uint256 r, uint256 vs)
    return (
      '0x' +
      nonceAndAllowed.toString(16).padStart(64, '0') +
      (BigInt(deadline) === maxUint256 ? '00000000' : (BigInt(deadline) + 1n).toString(16).padStart(8, '0')) +
      BigInt(r).toString(16).padStart(64, '0') +
      (((BigInt(v) - 27n) << 255n) | BigInt(s)).toString(16).padStart(64, '0')
    )
  }
}
