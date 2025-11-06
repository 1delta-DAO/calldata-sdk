import { encodeFunctionData, maxUint256 } from 'viem'

import { PermitShared } from './utils/shared'
import { EvmTxUtilsLite } from '../../txUtils'

const Authorization = [
  { name: 'owner', type: 'address' },
  { name: 'manager', type: 'address' },
  { name: 'isAllowed', type: 'bool' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
]

export namespace CometCreditPermit {
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
    owner: string,
    manager: string,
    isAllowed: boolean,
    nonce: string | number,
    expiry: string | bigint | number = PermitShared.defaultDeadline.toString()
  ): EvmTxUtilsLite.EvmSignInputs {
    const data = {
      types: { EIP712Domain: PermitShared.EIP712Domain, Authorization },
      domain: { name, version, chainId, verifyingContract },
      message: { owner, manager, isAllowed, nonce, expiry },
    } as const
    return { typedData: { ...data, primaryType: 'Authorization' }, chainId }
  }

  export function processSignature(
    owner: string,
    manager: string,
    isAllowed: boolean,
    nonce: bigint,
    signature: any,
    expiry: string | bigint | number = PermitShared.defaultDeadline.toString(),
    compact = false
  ) {
    const { v, r, s } = PermitShared.splitSignatureToVRS(signature)

    const signatureCall = !compact
      ? PermitShared.cutSelector(encodeAllowBySig(owner, manager, isAllowed, nonce, expiry, v!, r, s))
      : getCompressedPermit(isAllowed, nonce, expiry, v!, r, s)

    return { signature, signatureCall }
  }

  function encodeAllowBySig(
    owner: string,
    manager: string,
    isAllowed: boolean,
    nonce: bigint,
    expiry: string | bigint | number,
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
              name: 'owner',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'manager',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'isAllowed_',
              type: 'bool',
            },
            {
              internalType: 'uint256',
              name: 'nonce',
              type: 'uint256',
            },
            { internalType: 'uint256', name: 'expiry', type: 'uint256' },
            { internalType: 'uint8', name: 'v', type: 'uint8' },
            { internalType: 'bytes32', name: 'r', type: 'bytes32' },
            { internalType: 'bytes32', name: 's', type: 'bytes32' },
          ],
          name: 'allowBySig',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'allowBySig',
      // @ts-ignore
      args: [owner, manager, isAllowed, nonce, expiry, v, r, s],
    })
  }

  const allowFlag = 1n << 255n
  const isMorphoFlag = 1n << 254n

  function getCompressedPermit(
    isAllowed: boolean,
    nonce: bigint,
    expiry: string | bigint | number,
    v: string | number | bigint,
    r: string,
    s: string | number,
    isMorpho = false
  ) {
    // Compact IAllowBySig.permit(uint256 nonceAndIsAllowed, uint32 deadline, uint256 r, uint256 vs)
    let nonceAndAllowed = BigInt(nonce)
    if (isAllowed) nonceAndAllowed = (nonceAndAllowed & ~allowFlag) | allowFlag
    if (isMorpho) nonceAndAllowed = (nonceAndAllowed & ~isMorphoFlag) | isMorphoFlag
    // Compact IAllowBySig.permit(uint256 nonceAndIsAllowed, uint32 deadline, uint256 r, uint256 vs)
    return (
      '0x' +
      nonceAndAllowed.toString(16).padStart(64, '0') +
      (BigInt(expiry) === maxUint256 ? '00000000' : (BigInt(expiry) + 1n).toString(16).padStart(8, '0')) +
      BigInt(r).toString(16).padStart(64, '0') +
      (((BigInt(v) - 27n) << 255n) | BigInt(s)).toString(16).padStart(64, '0')
    )
  }
}
