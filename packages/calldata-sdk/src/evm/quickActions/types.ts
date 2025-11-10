import { Address } from 'viem'
import { Lender } from '@1delta/lender-registry'
import { LendingMode, MorphoParams, LendingOverrides, QuickActionType } from '../lending/types'
import { ExternalCallParams } from '../spot'
import { GenericTrade, PermitData } from '..'

export interface BaseQuickActionParams {
  trade: GenericTrade
  slippageBps: string
  receiver: Address
  lender: Lender
  morphoParams?: MorphoParams
  externalCall?: ExternalCallParams
  /** Optional: Composer address override */
  composer?: Address
  permitData?: PermitData
}

export interface SwapAndDepositParams extends BaseQuickActionParams {
  useOverride?: Pick<LendingOverrides, 'pool'>
}

export interface SwapAndRepayParams extends BaseQuickActionParams {
  repayMaximum?: boolean
  lendingMode?: LendingMode
  useOverride?: Pick<LendingOverrides, 'pool' | 'debtToken' | 'collateralToken'>
}

export interface BorrowAndSwapParams extends BaseQuickActionParams {
  lendingMode?: LendingMode
  useOverride?: Pick<LendingOverrides, 'pool' | 'collateralToken'>
}

export interface WithdrawAndSwapParams extends BaseQuickActionParams {
  withdrawMaximum?: boolean
  useOverride?: Pick<LendingOverrides, 'pool' | 'collateralToken' | 'isBase'>
}

export interface QuickActionParams extends BaseQuickActionParams {
  quickActionType: QuickActionType
  maximum?: boolean
  lendingMode?: LendingMode
  useOverride?: LendingOverrides
}
