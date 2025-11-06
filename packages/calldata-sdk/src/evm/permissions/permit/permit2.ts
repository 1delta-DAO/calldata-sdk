import { encodeFunctionData, maxUint160, maxUint48, signatureToCompactSignature, TypedData, TypedDataDomain } from 'viem'

import { PermitShared } from './utils/shared'
import { EvmTxUtilsLite } from '../../txUtils'

/** the only accepted permit2 address */
const DEFAULT_PERMIT2_ADDRESS = '0x000000000022d473030f116ddee9f6b43ac78ba3'

const Permit2Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint160',
        name: 'amount',
        type: 'uint160',
      },
      {
        internalType: 'uint48',
        name: 'expiration',
        type: 'uint48',
      },
      {
        internalType: 'uint48',
        name: 'nonce',
        type: 'uint48',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint160',
                name: 'amount',
                type: 'uint160',
              },
              {
                internalType: 'uint48',
                name: 'expiration',
                type: 'uint48',
              },
              {
                internalType: 'uint48',
                name: 'nonce',
                type: 'uint48',
              },
            ],
            internalType: 'struct IAllowanceTransfer.PermitDetails',
            name: 'details',
            type: 'tuple',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'sigDeadline',
            type: 'uint256',
          },
        ],
        internalType: 'struct IAllowanceTransfer.PermitSingle',
        name: 'permitSingle',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint160', name: 'amount', type: 'uint160' },
      { internalType: 'address', name: 'token', type: 'address' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export function getPermit2ContractAddress(chainId: string): string {
  switch (chainId) {
    default:
      return DEFAULT_PERMIT2_ADDRESS
  }
}

export namespace Permit2 {
  export enum Permit2Selectors {
    Permit = 'permit',
    Allowance = 'allowance',
  }

  /**
   * @category permit
   * @dev Constructs structured data for EIP-2612 permit function, including types, domain, and message with details about the permit.
   * @param token The user readable name of signing EIP-712 domain
   * @param chainId The unique identifier for the blockchain network.
   * @param spender The Ethereum address of the party being granted permission to spend tokens on behalf of the owner.
   * @param amount The amount of tokens the spender is permitted to spend.
   * @param nonce An arbitrary number used once to prevent replay attacks. Typically, this is the number of transactions sent by the owner.
   * @param expiration Time until when the permit is valid.
   * @param sigDeadline The timestamp until which the permit is valid. This provides a window of time in which the permit can be used.
   * @param batch Flag if batch or single.
   */
  export function buildData(
    token: string,
    chainId: string,
    spender: string,
    amount: bigint,
    nonce: string | number,
    expiration: string | bigint | number = PermitShared.defaultDeadlinePermit2.toString(),
    sigDeadline: string | bigint | number = PermitShared.defaultDeadlinePermit2.toString(),
    batch = false
  ): EvmTxUtilsLite.EvmSignInputs {
    const details = {
      token,
      amount,
      expiration,
      nonce,
    }
    const permit = batch
      ? {
          details: [details],
          spender,
          sigDeadline,
        }
      : {
          details,
          spender,
          sigDeadline,
        }
    const permit2ContractAddress = getPermit2ContractAddress(chainId)
    const data = getPermitData(permit as any, permit2ContractAddress, chainId)
    return {
      typedData: {
        ...data,
        message: data.values,
        primaryType: batch ? 'PermitBatch' : 'PermitSingle',
      },
      chainId,
    }
  }

  export function processSignature(
    owner: string,
    token: string,
    spender: string,
    amount: bigint,
    nonce: string | number,
    signature: string,
    compact = false,
    expiration: string | bigint | number = PermitShared.defaultDeadlinePermit2.toString(),
    sigDeadline: string | bigint | number = PermitShared.defaultDeadlinePermit2.toString(),
    batch = false
  ) {
    const details = {
      token,
      amount,
      expiration,
      nonce,
    }
    const permit = batch
      ? {
          details: [details],
          spender,
          sigDeadline,
        }
      : {
          details,
          spender,
          sigDeadline,
        }

    if (batch) {
      return { signature, signatureCall: '' }
    }

    // split the sig
    const split = PermitShared.splitSignatureToVRS(signature as any)
    const { r, yParityAndS } = signatureToCompactSignature(split)

    // encode call
    const permitCall = encodePermit2Permit(owner, permit, r + PermitShared.trim0x(yParityAndS))

    // cut selector when compact
    const signatureCall = compact ? PermitShared.compressPermit(PermitShared.cutSelector(permitCall)) : permitCall

    return { signature, signatureCall }
  }

  function encodePermit2Permit(owner: string, permit: any, rYs: string) {
    return encodeFunctionData({
      abi: Permit2Abi,
      functionName: Permit2Selectors.Permit,
      args: [owner, permit, rYs],
    })
  }
}

// // return the data to be sent in a eth_signTypedData RPC call
// // for signing the given permit data
// function getPermitSingleData(permit: PermitSingle, permit2Address: string, chainId: string) {

//   const domain = permit2Domain(permit2Address, chainId)
//   validatePermitDetails(permit.details)

//   return {
//     domain,
//     values: permit,
//   }
// }

// // return the data to be sent in a eth_signTypedData RPC call
// // for signing the given permit data
// function getPermitBatchData(permit: PermitBatch, permit2Address: string, chainId: string) {

//   const domain = permit2Domain(permit2Address, chainId)
//   permit.details.forEach(validatePermitDetails)

//   return {
//     domain,
//     values: permit,
//   }
// }

const PERMIT_DETAILS = [
  { name: 'token', type: 'address' },
  { name: 'amount', type: 'uint160' },
  { name: 'expiration', type: 'uint48' },
  { name: 'nonce', type: 'uint48' },
] as const

const PERMIT_TYPES = {
  PermitDetails: PERMIT_DETAILS,
  PermitSingle: [
    { name: 'details', type: 'PermitDetails' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
} as const

const PERMIT_BATCH_TYPES = {
  PermitDetails: PERMIT_DETAILS,
  PermitBatch: [
    { name: 'details', type: 'PermitDetails[]' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
} as const

interface PermitDetails {
  token: string
  amount: bigint
  expiration: number
  nonce: number
}

interface PermitSingle {
  details: PermitDetails
  spender: string
  sigDeadline: bigint
}

interface PermitBatch {
  details: PermitDetails[]
  spender: string
  sigDeadline: bigint
}

type PermitSingleData = {
  domain: TypedDataDomain
  types: TypedData
  values: PermitSingle
}

type PermitBatchData = {
  domain: TypedDataDomain
  types: TypedData
  values: PermitBatch
}

// return the data to be sent in a eth_signTypedData RPC call
// for signing the given permit data
function getPermitData(
  permit: PermitSingle | PermitBatch,
  permit2Address: string,
  chainId: string
): PermitSingleData | PermitBatchData {
  const domain = permit2Domain(permit2Address, chainId)
  if (isPermit(permit)) {
    validatePermitDetails(permit.details)
    return {
      domain,
      types: PERMIT_TYPES,
      values: permit,
    }
  } else {
    permit.details.forEach(validatePermitDetails)
    return {
      domain,
      types: PERMIT_BATCH_TYPES,
      values: permit,
    }
  }
}

const PERMIT2_DOMAIN_NAME = 'Permit2'

// alias max types for their usages
// allowance transfer types
export const MaxAllowanceTransferAmount = maxUint160
export const MaxAllowanceExpiration = maxUint48
export const MaxOrderedNonce = maxUint48

function permit2Domain(permit2Address: string, chainId: string): TypedDataDomain {
  return {
    name: PERMIT2_DOMAIN_NAME,
    chainId: Number(chainId),
    verifyingContract: permit2Address as any,
  }
}

function validatePermitDetails(details: PermitDetails) {
  if (MaxOrderedNonce < details.nonce) throw new Error('NONCE_OUT_OF_RANGE')
  if (MaxAllowanceTransferAmount < details.amount) throw new Error('AMOUNT_OUT_OF_RANGE')
  if (MaxAllowanceExpiration < details.expiration) throw new Error('EXPIRATION_OUT_OF_RANGE')
}

function isPermit(permit: PermitSingle | PermitBatch): permit is PermitSingle {
  return !Array.isArray(permit.details)
}
