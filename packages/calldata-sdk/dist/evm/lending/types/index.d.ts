import { Lender } from '@1delta/asset-registry';
import { ChainIdLike, SerializedCurrencyAmount } from '@1delta/type-sdk';
import { Hex } from 'viem';
import { PermitData } from '../..';
export interface BaseLendingParams {
    lender: Lender;
    amount: SerializedCurrencyAmount;
}
export interface LenderTokens {
    collateral?: string;
    debt?: string;
    stableDebt?: string;
    base?: string;
}
export interface InterestRateParams {
    aaveBorrowMode: AaveInterestMode;
}
export declare enum AaveInterestMode {
    NONE = 0,
    STABLE = 1,
    VARIABLE = 2
}
export interface LendingOperation {
    params: BaseLendingParams & Partial<InterestRateParams>;
    actionType: QuickActionType;
    receiver: string;
    isAll?: boolean;
    inIsNative: boolean;
    outIsNative: boolean;
    composerAddress: string;
    permitData?: PermitData;
    morphoParams?: MorphoParams;
    useOverride?: {
        pool?: string;
        collateralToken?: string;
        debtToken?: string;
    };
}
export interface LenderData {
    pool?: string;
    lenderTokens?: LenderTokens;
    group: LenderGroups;
    lender: Lender;
}
export declare const COMPOUND_V2_LENDERS: Lender[];
export declare const COMPOUND_V3_LENDERS: Lender[];
export declare enum LenderGroups {
    AaveV2 = 0,
    AaveV3 = 1,
    CompoundV2 = 2,
    CompoundV3 = 3,
    MorphoBlue = 4
}
export declare enum QuickActionType {
    Deposit = "Deposit",
    Withdraw = "Withdraw",
    Borrow = "Borrow",
    Repay = "Repay"
}
export declare enum TransferToLenderType {
    Amount = 0,// Exact amount
    UserBalance = 1,// Pull user balance
    ContractBalance = 2
}
export interface MorphoParams {
    market: Hex;
    isShares: boolean;
    morphoB: string;
    data: Hex;
    pId: number;
    unsafeRepayment: boolean;
}
export interface MorphoMarket {
    loanToken: string;
    collateralToken: string;
    oracle: string;
    irm: string;
    lltv: bigint;
}
export interface OverrideAmount {
    asset: string;
    amount: bigint;
    chainId: ChainIdLike;
}
export interface LendingOverrides {
    pool?: string;
    collateralToken?: string;
    debtToken?: string;
    isBase?: boolean;
}
export interface CreateDepositParams {
    receiver: string;
    amount: SerializedCurrencyAmount | OverrideAmount;
    lender: Lender;
    morphoParams?: MorphoParams;
    transferType?: TransferToLenderType;
    useOverride?: Pick<LendingOverrides, 'pool'>;
}
export interface createWithdrawParams {
    receiver: string;
    amount: SerializedCurrencyAmount | OverrideAmount;
    lender: Lender;
    transferType?: TransferToLenderType;
    morphoParams?: MorphoParams;
    useOverride?: Pick<LendingOverrides, 'pool' | 'collateralToken' | 'isBase'>;
}
export interface createBorrowParams {
    receiver: string;
    amount: SerializedCurrencyAmount | OverrideAmount;
    lender: Lender;
    aaveInterestMode?: AaveInterestMode;
    morphoParams?: MorphoParams;
    useOverride?: Pick<LendingOverrides, 'pool' | 'collateralToken'>;
}
export interface CreateRepayParams {
    receiver: string;
    amount: SerializedCurrencyAmount | OverrideAmount;
    lender: Lender;
    aaveInterestMode?: AaveInterestMode;
    morphoParams?: MorphoParams;
    transferType: TransferToLenderType;
    useOverride?: Pick<LendingOverrides, 'pool' | 'debtToken' | 'collateralToken'>;
}
