import { FlashLoanIds } from '@1delta/calldatalib';
import { ChainIdLike } from '@1delta/type-sdk';
import { Address, Hex } from 'viem';
export declare enum FlashLoanProvider {
    NONE = "None",
    LENDLE = "LENDLE",
    AAVE_V2 = "AAVE_V2",
    AAVE_V3 = "AAVE_V3",
    YLDR = "YLDR",
    MORPHO = "MORPHO_BLUE",
    AURELIUS = "AURELIUS",
    BALANCER_V2 = "BALANCER_V2",
    BALANCER_V3 = "BALANCER_V3",
    UNISWAP_V4 = "UNISWAP_V4",
    AVALON = "AVALON",
    MERIDIAN = "MERIDIAN",
    TAKOTAKO = "TAKOTAKO",
    GRANARY = "GRANARY",
    ZEROLEND = "ZEROLEND",
    LENDOS = "LENDOS"
}
export declare const SingletonTypeFlashLoanProvider: FlashLoanProvider[];
export declare const FLASH_LOAN_PROVIDERS: {
    [c: ChainIdLike]: {
        [l: string]: FlashLoanProviderData;
    };
};
export declare const DEFAULT_PROVIDER_PER_CHAIN: {
    "5000": FlashLoanProvider;
    "137": FlashLoanProvider;
    "167000": FlashLoanProvider;
    "42161": FlashLoanProvider;
    "10": FlashLoanProvider;
    "8453": FlashLoanProvider;
    "43111": FlashLoanProvider;
};
export declare const FLASH_PROVIDERS_WITHOUT_FEE: FlashLoanProvider[];
/**
 * Context for parametrizing a flash loan margin trade
 */
export interface DebasedContractCallsContext {
    callIn: string[];
    callOut: string[];
    manualFlashLoanRepayTransfer: string;
    cleanup: string;
}
/**
 * Context for parametrizing a flash loan margin trade
 */
export interface ContractCallsContext {
    callIn: string;
    callOut: string;
    manualFlashLoanRepayTransfer: string;
    cleanup: string;
}
export interface FlashLoanProviderData {
    id: number;
    fee: bigint;
}
export interface SingletonTypeFlashLoanData {
    singleton: Address;
    poolId: bigint;
    receiver: Address;
    type: 'Singleton';
}
export interface PoolTypeFlashLoanData {
    pool: Address | undefined;
    poolType: FlashLoanIds | undefined;
    flashloanId: number;
    type: 'Pool';
}
interface GenericFlashLoanData {
    asset: Address;
    amount: string;
    data: Hex;
}
export type FlashLoanData = GenericFlashLoanData & (PoolTypeFlashLoanData | SingletonTypeFlashLoanData);
export {};
