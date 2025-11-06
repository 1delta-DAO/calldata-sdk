import {
  decodeAbiParameters,
  encodeAbiParameters,
  parseAbiParameters,
  parseSignature,
} from 'viem'

/**
 * EVM: Relevant functions for
 * - encoding data for signatures
 * - decoding signatures
 * - compress calls 1inch-style
 */
export namespace PermitShared {
  export enum SignTypedDataVersion {
    V4 = 'V4',
  }

  export interface PermitSignature {
    signature: string
    signatureCall: string
  }

  export const constants = {
    EEE_ADDRESS: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    ZERO_BYTES32:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    MAX_UINT256: 2n ** 256n - 1n,
    MAX_INT256: 2n ** 255n - 1n,
    MAX_UINT48: 2n ** 48n - 1n,
    MIN_INT256: -(2n ** 255n),
    MAX_UINT128: 2n ** 128n - 1n,
    MAX_UINT32: 2n ** 32n - 1n,
  } as const

  export const TypedDataVersion = SignTypedDataVersion.V4
  export const defaultDeadline = constants.MAX_UINT256
  export const defaultDeadlinePermit2 = constants.MAX_UINT48

  export const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ]

  /** Input parameters for ERC20Permit permit (and delegationWithSig) ABI function */
  export const ERC20PermitParams = [
    {
      internalType: 'address',
      name: 'owner',
      type: 'address',
    },
    {
      internalType: 'address',
      name: 'spender',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: 'value',
      type: 'uint256',
    },
    {
      internalType: 'uint256',
      name: 'deadline',
      type: 'uint256',
    },
    {
      internalType: 'uint8',
      name: 'v',
      type: 'uint8',
    },
    {
      internalType: 'bytes32',
      name: 'r',
      type: 'bytes32',
    },
    {
      internalType: 'bytes32',
      name: 's',
      type: 'bytes32',
    },
  ] as const

  /**  Input parameters for Dai permit ABI function */
  export const DaiPermitParams = [
    {
      internalType: 'address',
      name: 'holder',
      type: 'address',
    },
    {
      internalType: 'address',
      name: 'spender',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: 'nonce',
      type: 'uint256',
    },
    {
      internalType: 'uint256',
      name: 'expiry',
      type: 'uint256',
    },
    {
      internalType: 'bool',
      name: 'allowed',
      type: 'bool',
    },
    {
      internalType: 'uint8',
      name: 'v',
      type: 'uint8',
    },
    {
      internalType: 'bytes32',
      name: 'r',
      type: 'bytes32',
    },
    {
      internalType: 'bytes32',
      name: 's',
      type: 'bytes32',
    },
  ] as const

  export function splitSignatureToVRS(sig: string) {
    return parseSignature(sig as any)
  }

  /**
   * @category permit
   * @dev Removes the '0x' prefix from a string. If no '0x' prefix is found, returns the original string.
   * @param bigNumber The number (as a bigint or string) from which to remove the '0x' prefix.
   * @return The string without the '0x' prefix.
   */
  export function trim0x(bigNumber: bigint | string): string {
    const s = bigNumber.toString()
    if (s.startsWith('0x')) {
      return s.substring(2)
    }
    return s
  }

  /**
   * @category permit
   * @dev Trims the method selector from transaction data, removing the first 8 characters (4 bytes of hexable string) after '0x' prefix.
   * @param data The transaction data string from which to trim the selector.
   * @return The trimmed selector string.
   */
  export function cutSelector(data: string): string {
    const hexPrefix = '0x'
    return hexPrefix + data.substring(hexPrefix.length + 8)
  }

  /** Indexes the ERC20 standard permit decoded params */
  enum ERC20PermitParamsIndexes {
    owner = 0,
    spender,
    value,
    deadline,
    v,
    r,
    s,
  }

  /** Indexes the Dai permit decoded params */
  enum DaiPermitParamsIndexes {
    holder = 0,
    spender,
    nonce,
    expiry,
    allowed,
    v,
    r,
    s,
  }

  /** Indexes the permit2 permit decoded params */
  enum Permit2PermitIndexes {
    owner = 0,
    token,
    amount,
    expiration,
    nonce,
    spender,
    sigDeadline,
    signature,
  }

  /**
   * @category permit
   * @notice Compresses a permit function call to a shorter format based on its type.
   *   Type         | EIP-2612 | DAI | Permit2
   *   Uncompressed |    224   | 256 | 352
   *   Compressed   |    100   |  72 | 96
   * @param permit The full permit function call string.
   * @return A compressed permit string.
   */
  export function compressPermit(permit: string): string {
    switch (permit.length) {
      case 450: {
        // IERC20Permit.permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s)
        const args = decodeAbiParameters(
          [
            { type: 'address', name: 'owner' },
            { type: 'address', name: 'spender' },
            { type: 'uint256', name: 'value' },
            { type: 'uint256', name: 'deadline' },
            { type: 'uint8', name: 'v' },
            { type: 'bytes32', name: 'r' },
            { type: 'bytes32', name: 's' },
          ], // @ts-ignore
          permit
        )

        // Compact IERC20Permit.permit(uint256 value, uint32 deadline, uint256 r, uint256 vs)
        return (
          '0x' +
          args[ERC20PermitParamsIndexes.value].toString(16).padStart(64, '0') +
          (args[ERC20PermitParamsIndexes.deadline].toString() ===
          constants.MAX_UINT256.toString()
            ? '00000000'
            : (args[ERC20PermitParamsIndexes.deadline] + 1n)
                .toString(16)
                .padStart(8, '0')) +
          BigInt(args[ERC20PermitParamsIndexes.r])
            .toString(16)
            .padStart(64, '0') +
          (
            ((BigInt(args[ERC20PermitParamsIndexes.v]) - 27n) << 255n) |
            BigInt(args[ERC20PermitParamsIndexes.s])
          )
            .toString(16)
            .padStart(64, '0')
        )
      }
      case 514: {
        // IDaiLikePermit.permit(address holder, address spender, uint256 nonce, uint256 expiry, bool allowed, uint8 v, bytes32 r, bytes32 s)
        const args = decodeAbiParameters(
          [
            { type: 'address', name: 'holder' },
            { type: 'address', name: 'spender' },
            { type: 'uint256', name: 'nonce' },
            { type: 'uint256', name: 'expiry' },
            { type: 'bool', name: 'allowed' },
            { type: 'uint8', name: 'v' },
            { type: 'bytes32', name: 'r' },
            { type: 'bytes32', name: 's' },
          ],
          permit as any
        )

        // Compact IDaiLikePermit.permit(uint32 nonce, uint32 expiry, uint256 r, uint256 vs)
        return (
          '0x' +
          args[DaiPermitParamsIndexes.nonce].toString(16).padStart(8, '0') +
          (args[DaiPermitParamsIndexes.expiry].toString() ===
          constants.MAX_UINT256.toString()
            ? '00000000'
            : (args[DaiPermitParamsIndexes.expiry] + 1n)
                .toString(16)
                .padStart(8, '0')) +
          BigInt(args[DaiPermitParamsIndexes.r])
            .toString(16)
            .padStart(64, '0') +
          (
            ((BigInt(args[DaiPermitParamsIndexes.v]) - 27n) << 255n) |
            BigInt(args[DaiPermitParamsIndexes.s])
          )
            .toString(16)
            .padStart(64, '0')
        )
      }
      case 706: {
        // IPermit2.permit(address owner, PermitSingle calldata permitSingle, bytes calldata signature)
        const args = decodeAbiParameters(
          [
            { type: 'address', name: 'owner' },
            { type: 'address', name: 'token' },
            { type: 'uint160', name: 'amount' },
            { type: 'uint48', name: 'expiration' },
            { type: 'uint48', name: 'nonce' },
            { type: 'address', name: 'spender' },
            { type: 'uint256', name: 'sigDeadline' },
            { type: 'bytes', name: 'signature' },
          ],
          permit as any
        )

        // Compact IPermit2.permit(uint160 amount, uint32 expiration, uint32 nonce, uint32 sigDeadline, uint256 r, uint256 vs)
        return (
          '0x' +
          args[Permit2PermitIndexes.amount].toString(16).padStart(40, '0') +
          (args[Permit2PermitIndexes.expiration].toString() ===
          constants.MAX_UINT48.toString()
            ? '00000000'
            : (BigInt(args[Permit2PermitIndexes.expiration]) + 1n)
                .toString(16)
                .padStart(8, '0')) +
          args[Permit2PermitIndexes.nonce].toString(16).padStart(8, '0') +
          (args[Permit2PermitIndexes.sigDeadline].toString() ===
          constants.MAX_UINT48.toString()
            ? '00000000'
            : (args[Permit2PermitIndexes.sigDeadline] + 1n)
                .toString(16)
                .padStart(8, '0')) +
          BigInt(args[Permit2PermitIndexes.signature])
            .toString(16)
            .padStart(128, '0')
        )
      }
      case 202:
      case 146:
      case 194:
        throw new Error('Permit is already compressed')
      default:
        throw new Error('Invalid permit length')
    }
  }

  /**
   * @category permit
   * @notice Decompresses a compressed permit function call back to its original full format.
   * @param permit The compressed permit function call string.
   * @param token The token address involved in the permit (for Permit2 type).
   * @param owner The owner address involved in the permit.
   * @param spender The spender address involved in the permit.
   * @return The decompressed permit function call string.
   */
  export function decompressPermit(
    permit: string,
    token: string,
    owner: string,
    spender: string
  ): string {
    switch (permit.length) {
      case 202: {
        // Compact IERC20Permit.permit(uint256 value, uint32 deadline, uint256 r, uint256 vs)
        const args = {
          value: BigInt(permit.slice(0, 66)),
          deadline: BigInt('0x' + permit.slice(66, 74)),
          r: '0x' + permit.slice(74, 138),
          vs: BigInt('0x' + permit.slice(138, 202)),
        }
        // IERC20Permit.permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s)
        return encodeAbiParameters(
          parseAbiParameters(
            'address, address, uint256, uint256, uint8, bytes32, bytes32'
          ),
          [
            owner as any,
            spender as any,
            args.value,
            args.deadline === 0n ? constants.MAX_UINT256 : args.deadline - 1n,
            ((args.vs >> 255n) + 27n) as any,
            args.r as any,
            ('0x' +
              (
                args.vs &
                0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
              )
                .toString(16)
                .padStart(64, '0')) as any,
          ]
        )
      }
      case 146: {
        // Compact IDaiLikePermit.permit(uint32 nonce, uint32 expiry, uint256 r, uint256 vs)
        const args = {
          nonce: BigInt(permit.slice(0, 10)),
          expiry: BigInt('0x' + permit.slice(10, 18)),
          r: '0x' + permit.slice(18, 82),
          vs: BigInt('0x' + permit.slice(82, 146)),
        }
        return encodeAbiParameters(
          parseAbiParameters(
            'address holder, address spender, uint256 nonce, uint256 expiry, bool allowed, uint8 v, bytes32 r, bytes32 s'
          ),
          [
            owner as any,
            spender as any,
            args.nonce,
            args.expiry === 0n ? constants.MAX_UINT256 : args.expiry - 1n,
            true,
            ((args.vs >> 255n) + 27n) as any,
            args.r as any,
            ('0x' +
              (
                args.vs &
                0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
              )
                .toString(16)
                .padStart(64, '0')) as any,
          ]
        )
      }
      case 194: {
        // Compact IPermit2.permit(uint160 amount, uint32 expiration, uint32 nonce, uint32 sigDeadline, uint256 r, uint256 vs)
        const args = {
          amount: BigInt(permit.slice(0, 42)),
          expiration: BigInt('0x' + permit.slice(42, 50)),
          nonce: BigInt('0x' + permit.slice(50, 58)),
          sigDeadline: BigInt('0x' + permit.slice(58, 66)),
          r: '0x' + permit.slice(66, 130),
          vs: '0x' + permit.slice(130, 194),
        }
        // IPermit2.permit(address owner, PermitSingle calldata permitSingle, bytes calldata signature)
        return encodeAbiParameters(
          parseAbiParameters(
            'address owner, address token, uint160 amount, uint48 expiration, uint48 nonce, address spender, uint256 sigDeadline, bytes signature'
          ),
          [
            owner as any,
            token as any,
            args.amount,
            args.expiration === 0n
              ? constants.MAX_UINT48
              : ((args.expiration - 1n) as any),
            args.nonce as any,
            spender as any,
            args.sigDeadline === 0n
              ? constants.MAX_UINT48
              : args.sigDeadline - 1n,
            (args.r + trim0x(args.vs)) as any,
          ]
        )
      }
      case 450:
      case 514:
      case 706:
        throw new Error('Permit is already decompressed')
      default:
        throw new Error('Invalid permit length')
    }
  }
}
