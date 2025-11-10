import { Lender } from '@1delta/lender-registry'
import { ChainIdLike } from '@1delta/type-sdk'
import { Hex } from 'viem'
import { PermitData } from '../..'

export interface ShallowCurrency {
  address: string
  chainId: string
  [k: string]: any // can have any other fields for convenience
}

export interface ShallowCurrencyAmount {
  currency: ShallowCurrency
  amount: string | bigint
}

export interface BaseLendingParams {
  lender: Lender
  amount: ShallowCurrencyAmount
}

export interface LenderTokens {
  collateral?: string
  debt?: string
  stableDebt?: string
  base?: string
}

export interface InterestRateParams {
  aaveBorrowMode: LendingMode
}

/** Matches Aave interest mode */
export enum LendingMode {
  /** This means collateral action / deposits*/
  NONE = 0,
  /** Stable borrowing */
  STABLE = 1,
  /** Variable borrowing */
  VARIABLE = 2,
}

export interface LendingOperation {
  amount: bigint
  lender: string
  chainId: string
  actionType: QuickActionType
  lendingMode: LendingMode | undefined
  receiver: string
  isAll?: boolean
  callerAssetAddress: string
  lenderAssetAddress: string
  composerAddress: string
  permitData?: PermitData
  morphoParams?: MorphoParams
  useOverride?: {
    pool?: string
    collateralToken?: string
    debtToken?: string
  }
}

export interface LenderData {
  pool?: string
  lenderTokens?: LenderTokens
  group: LenderGroups
  lender: Lender
}

export enum LenderGroups {
  AaveV2,
  AaveV3,
  CompoundV2,
  CompoundV3,
  MorphoBlue,
  SiloV2,
}

export enum QuickActionType {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Borrow = 'Borrow',
  Repay = 'Repay',
}

export enum TransferToLenderType {
  Amount, // Exact amount
  UserBalance, // Pull user balance
  ContractBalance, // Use contract balance
}

/** Morpho market params: MUST be attached when using MB */
export interface MorphoParams {
  /** tightly packed market as hex */
  market: Hex
  /** use shares - ignored for collateral */
  isShares: boolean
  /** morpho address */
  morphoB: string
  /** flash callback composer data */
  data: Hex
  /** fork id */
  pId: number
  /** confidently repay and fail if too much */
  unsafeRepayment: boolean
  /** loan token interaction: deposit/wirhdraw only */
  isLoanToken?: boolean
}

export interface LendingOverrides {
  pool?: string
  collateralToken?: string
  debtToken?: string
  isBase?: boolean
}

export interface CreateDepositParams {
  receiver: string
  amount: bigint
  asset: string
  chainId: string
  lender: Lender
  morphoParams?: MorphoParams
  transferType?: TransferToLenderType
  useOverride?: Pick<LendingOverrides, 'pool'>
}

export interface CreateWithdrawParams {
  receiver: string
  amount: bigint
  asset: string
  chainId: string
  lender: Lender
  transferType?: TransferToLenderType
  morphoParams?: MorphoParams
  useOverride?: Pick<LendingOverrides, 'pool' | 'collateralToken' | 'isBase'>
}

export interface CreateBorrowParams {
  receiver: string
  amount: bigint
  asset: string
  chainId: string
  lender: Lender
  lendingMode?: LendingMode
  morphoParams?: MorphoParams
  useOverride?: Pick<LendingOverrides, 'pool' | 'collateralToken'>
}

export interface CreateRepayParams {
  receiver: string
  amount: bigint
  asset: string
  chainId: string
  lender: Lender
  lendingMode?: LendingMode
  morphoParams?: MorphoParams
  transferType: TransferToLenderType
  useOverride?: Pick<LendingOverrides, 'pool' | 'debtToken' | 'collateralToken'>
}
