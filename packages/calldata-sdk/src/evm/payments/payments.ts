import { encodeSweep, encodeTransferIn, encodeUnwrap } from '@1delta/calldatalib'
import { SweepParams, TransferParams, UnwrapParams, WrapParams } from './types'
import { WRAPPED_NATIVE_INFO } from '@1delta/wnative'
import { safeEncodeWrap } from '../lending'

/** basic payments operations */
export namespace ComposerPayments {
  /** Transfer funds from caller to specified target */
  export function createTransfer(params: TransferParams) {
    return encodeTransferIn(params.asset as any, params.receiver as any, params.amount)
  }

  /** Wrap native to wnative (remains in contract) */
  export function createWrap(params: WrapParams) {
    const wrapTarget = WRAPPED_NATIVE_INFO[params.chainId as any].address
    return safeEncodeWrap(params.amount, wrapTarget as any)
  }

  /** Unwrap and transfer native to receiver with optional checks */
  export function createUnwrap(params: UnwrapParams) {
    if (!params.chainId) throw new Error('chainId required')
    const wrapTarget = WRAPPED_NATIVE_INFO[params.chainId as any].address
    return encodeUnwrap(wrapTarget as any, params.receiver as any, params.amount, params.sweepType)
  }

  /** Transfer erc20 to receiver with optional checks */
  export function createSweepCalldata(params: SweepParams) {
    return encodeSweep(params.asset as any, params.receiver as any, params.amount, params.sweepType)
  }
}
