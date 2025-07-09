import { Lender } from '@1delta/asset-registry'
import { ChainIdLike, SerializedCurrencyAmount } from '@1delta/type-sdk'
import { Hex } from 'viem'
import { PermitData } from '../..'

export interface BaseLendingParams {
  lender: Lender
  amount: SerializedCurrencyAmount
}

export interface LenderTokens {
  collateral?: string
  debt?: string
  stableDebt?: string
  base?: string
}

export interface InterestRateParams {
  aaveBorrowMode: AaveInterestMode
}

export enum AaveInterestMode {
  NONE = 0,
  STABLE = 1,
  VARIABLE = 2,
}

export interface LendingOperation {
  params: BaseLendingParams & Partial<InterestRateParams>
  actionType: QuickActionType
  receiver: string
  isAll?: boolean
  inIsNative: boolean
  outIsNative: boolean
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

export const COMPOUND_V2_LENDERS: Lender[] = [
  Lender.COMPOUND_V2,
  Lender.OVIX,
  Lender.VENUS,
  Lender.VENUS_ETH,
  Lender.VENUS_BNB,
  Lender.VENUS_BTC,
  Lender.VENUS_MEME,
  Lender.VENUS_DEFI,
  Lender.VENUS_GAMEFI,
  Lender.VENUS_STABLE,
  Lender.VENUS_TRON,
  Lender.VENUS_ETHENA,
  Lender.VENUS_CURVE,
  Lender.SEGMENT,
  Lender.ENCLABS,
  Lender.ENCLABS_LST,
  Lender.ENCLABS_PT_USD,
  Lender.ENCLABS_PT_ETH,
  Lender.BENQI,
  Lender.BENQI_AVALANCE_ECOSYSTEM,
]

export const COMPOUND_V3_LENDERS: Lender[] = [
  Lender.COMPOUND_V3_USDC,
  Lender.COMPOUND_V3_USDT,
  Lender.COMPOUND_V3_USDE,
  Lender.COMPOUND_V3_USDBC,
  Lender.COMPOUND_V3_USDCE,
  Lender.COMPOUND_V3_USDS,
  Lender.COMPOUND_V3_WETH,
  Lender.COMPOUND_V3_AERO,
  Lender.COMPOUND_V3_WSTETH,
]

export enum LenderGroups {
  AaveV2,
  AaveV3,
  CompoundV2,
  CompoundV3,
  MorphoBlue,
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

export interface MorphoParams {
  market: Hex
  isShares: boolean
  morphoB: string
  data: Hex
  pId: number
  unsafeRepayment: boolean
}

export interface MorphoMarket {
  loanToken: string
  collateralToken: string
  oracle: string
  irm: string
  lltv: bigint
}

export interface OverrideAmount {
  asset: string
  amount: bigint
  chainId: ChainIdLike
}

export interface LendingOverrides {
  pool?: string
  collateralToken?: string
  debtToken?: string
  isBase?: boolean
}

export interface CreateDepositParams {
  receiver: string
  amount: SerializedCurrencyAmount | OverrideAmount
  lender: Lender
  morphoParams?: MorphoParams
  transferType?: TransferToLenderType
  useOverride?: Pick<LendingOverrides, 'pool'>
}

export interface createWithdrawParams {
  receiver: string
  amount: SerializedCurrencyAmount | OverrideAmount
  lender: Lender
  transferType?: TransferToLenderType
  morphoParams?: MorphoParams
  useOverride?: Pick<LendingOverrides, 'pool' | 'collateralToken' | 'isBase'>
}

export interface createBorrowParams {
  receiver: string
  amount: SerializedCurrencyAmount | OverrideAmount
  lender: Lender
  aaveInterestMode?: AaveInterestMode
  morphoParams?: MorphoParams
  useOverride?: Pick<LendingOverrides, 'pool' | 'collateralToken'>
}

export interface CreateRepayParams {
  receiver: string
  amount: SerializedCurrencyAmount | OverrideAmount
  lender: Lender
  aaveInterestMode?: AaveInterestMode
  morphoParams?: MorphoParams
  transferType: TransferToLenderType
  useOverride?: Pick<LendingOverrides, 'pool' | 'debtToken' | 'collateralToken'>
}
