import { ContractIdInput, IdentityInput } from '../types';
import { CoinQuantity } from 'fuels';
import { DexProtocol } from '@1delta/dex-registry';
/**
 * Adjusts output amount for slippage tolerance
 * @param output The output amount to adjust
 * @param slippageToleranceBps Slippage tolerance in basis points (e.g., 50 = 0.5%)
 */
export declare function adjustOutputForSlippage(output: bigint, slippageToleranceBps: string): bigint;
/**
 * Adjusts input amount for slippage tolerance
 * @param input The input amount to adjust
 * @param slippageToleranceBps Slippage tolerance in basis points (e.g., 50 = 0.5%)
 */
export declare function adjustInputForSlippge(input: bigint, slippageToleranceBps: string): bigint;
/** get a valid assetID input from hex string */
export declare function assetIdInput(contractId: string): ContractIdInput;
/** This is for EOAs as receiver addresses  */
export declare function addressInput(address: string): IdentityInput;
/** This is for contracts as receiver addresses  */
export declare function contractIdInput(contractId: string): IdentityInput;
/** Get the receiver address string for a dex */
export declare function getDexReceiver(protocol: DexProtocol): "0x2e40f2b244b98ed6b8204b3de0156c6961f98525c8162f80162fcf53eebd90e7" | "0x7c293b054938bedca41354203be4c08aec2c3466412cac803f4ad62abf22e476";
/** Get a unique list of dexs contract addresses included in array */
export declare function getDexContracts(protocols: DexProtocol[]): string[];
/** Aggregate coin inputs into an array of unique entries by assetId */
export declare function aggregateInputs(qts: CoinQuantity[]): CoinQuantity[];
