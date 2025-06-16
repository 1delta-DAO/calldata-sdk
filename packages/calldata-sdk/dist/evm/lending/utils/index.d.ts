import { Lender } from '@1delta/asset-registry';
import { LenderData, LenderGroups } from '../types';
import { PermitIds } from '@1delta/calldatalib';
import { Hex } from 'viem';
import { ChainIdLike, SerializedCurrencyAmount } from '@1delta/type-sdk';
import { FlashLoanProvider } from '../../../utils';
import { FlashInfo } from '../../flashloan/types/marginHandlers';
export * from './permit';
export declare function getLenderData(lender: Lender, chainId: ChainIdLike, asset: string): LenderData;
/**
 * Get the flash loan details from a provider on chain
 */
export declare function getFlashInfo(provider: FlashLoanProvider, chainId: ChainIdLike, composer: string): FlashInfo;
export declare function getAssetParamsFromAmount(amount: SerializedCurrencyAmount): {
    asset: string;
    rawAmount: string | bigint;
    chainId: string;
};
export declare function getLenderIdFromLender(lender: Lender): number;
export declare function getLenderId(lender: LenderGroups): number;
export declare function encodePermit(asset: string, permitId: PermitIds, permitData: Hex): Hex;
/**
 * Packs sequence of commands into a singel compose instruction
 * @param commands compose commands bytes packed
 * @returns sequence of commands
 */
export declare function packCommands(commands: string[]): Hex;
export declare function adjustAmountForAll(amount: string | bigint, isAll: boolean | undefined): bigint;
export declare function isAaveType(lender: LenderGroups): boolean;
export declare function getPool(lenderData: LenderData): string | undefined;
export declare function getCollateralToken(lenderData: LenderData): string | undefined;
export declare function getDebtToken(lenderData: LenderData): string | undefined;
export declare function getIsBaseToken(lenderData: LenderData, asset: string): boolean | undefined;
export declare function getLenderGroup(lender: Lender): LenderGroups;
