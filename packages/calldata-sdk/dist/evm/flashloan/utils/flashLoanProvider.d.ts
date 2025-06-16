import { Lender } from '@1delta/asset-registry';
import { FlashLoanData, FlashLoanProvider } from '../../../utils';
import { ChainIdLike } from '@1delta/type-sdk';
import { Address, Hex } from 'viem';
export declare function flashLoanIsFree(provider?: FlashLoanProvider): boolean | undefined;
export declare function flashLoanIsFromLender(provider?: FlashLoanProvider): boolean | undefined;
/** Retrieve the flash laon provider and flash loan fee on given chain */
export declare function getFlashLoanProviderAndFeePerChain(chainId: ChainIdLike, preSelectedSource: FlashLoanProvider | undefined, lenderInQuestion: Lender, assetToFlash?: string | undefined): {
    flashLoanData: import("../../../utils").FlashLoanProviderData;
    flashLoanProvider: FlashLoanProvider;
} | {
    flashLoanData: import("../../../utils").FlashLoanProviderData;
    flashLoanProvider: Lender;
};
/**
 * Adjust amount for flash loan fee (amount * (1 + fee))
 * @param amount bigint amount
 * @param provider flash pool
 * @returns adjusted amount
 */
export declare function adjustForFlashLoanFee(amount: string | bigint, fee: bigint | string): string;
/**
 * Create calldata for supported flash loan providers
 * @param provider flash loan provider
 * @param data flash loan data
 * @returns flash loan calldata
 */
export declare function createFlashLoan(provider: FlashLoanProvider, data: FlashLoanData): Hex;
export declare function getFlashLoanType(provider: FlashLoanProvider): "Singleton" | "Pool";
export declare function getProviderAddressForSingletonType(provider: FlashLoanProvider, chainId: ChainIdLike): {
    singleton: Address;
    poolId: bigint;
};
