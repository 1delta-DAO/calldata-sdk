import { Address } from 'viem';
import { SwapObject } from './genericTrade';
import { ChainIdLike, SerializedCurrencyAmount, SerializedSwapStep, SerializedTrade } from '@1delta/type-sdk';
import { TradeType } from '../evm';
export declare function getSplits(inputAmount: bigint, splitShares: bigint[]): `0x${string}`;
/**
 * Checks if a DEX protocol is pre-fundable
 */
export declare function isPreFundableDex(protocol: string): boolean;
/**
 * Gets the minimum amount out from a trade with slippage tolerance
 * @param trade The trade to calculate minimum amount out for
 * @param slippageToleranceBps Slippage tolerance in basis points (e.g., 50 = 0.5%)
 * @param tradeType The type of trade
 */
export declare function minimumAmountOutFromTrade(trade: SwapObject, slippageToleranceBps: string, tradeType: TradeType): SerializedCurrencyAmount;
export declare function supportsNativeToken(protocol: string): boolean;
export declare function getWethAddress(chainId: ChainIdLike): Address;
export declare function needsUnwrap(trade: SerializedTrade, chainId: ChainIdLike): boolean;
export declare function needsWrap(trade: SerializedTrade, chainId: ChainIdLike): boolean;
export declare function getAdjustedHopCount(swap: SerializedSwapStep, numHops: number): number;
export declare function getAssetInFromTrade(trade: SwapObject | undefined): string;
export declare function getAssetOutFromTrade(trade: SwapObject | undefined): string;
export declare function getAssetFromAmount(amount: SerializedCurrencyAmount): string;
export declare function getChainIdFromTrade(trade: SwapObject | undefined): string;
/**
 * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
 * @param trade The trade to calculate maximum amount in for
 * @param slippageToleranceBps The tolerance of unfavorable slippage in basis points (e.g., 50 = 0.5%)
 * @param tradeType The type of trade
 * @returns The amount in
 */
export declare function maximumAmountInFromTrade(trade: SwapObject, slippageToleranceBps: string, tradeType?: TradeType): SerializedCurrencyAmount;
/**
 * Get the maximum amount in that can be spent on this amount for the given slippage tolerance
 * @param amount The amount to calculate maximum input for
 * @param slippageToleranceBps The tolerance of unfavorable slippage in basis points (e.g., 50 = 0.5%)
 * @param tradeType The type of trade
 * @returns The amount in
 */
export declare function maximumAmountInFromAmount(amount: SerializedCurrencyAmount | undefined, slippageToleranceBps: string, tradeType?: TradeType): bigint | undefined;
