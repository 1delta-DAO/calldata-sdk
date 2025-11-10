import { SweepType } from '@1delta/calldatalib'

interface OptionalChainId {
  chainId?: string // optional to be used as internal override
}

export interface TransferParams extends OptionalChainId {
  asset: string
  amount: bigint
  receiver: string
}

export interface WrapParams extends OptionalChainId {
  amount: bigint
}

export interface UnwrapParams extends OptionalChainId {
  amount: bigint
  receiver: string
  sweepType: SweepType
}

export interface SweepParams extends OptionalChainId {
  asset: string
  receiver: string
  amount: bigint
  sweepType: SweepType
}

export { SweepType }

export enum TransferOp {
  Transfer = 'Transfer',
  Wrap = 'Wrap',
  Unwrap = 'Unwrap',
  Sweep = 'Sweep',
}
