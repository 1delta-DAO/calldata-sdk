import { FuelCallParameters } from '../../types';
import { SerializedTrade } from '@1delta/type-sdk';
export declare function getFuelParametersExactInFromTrade(trade: SerializedTrade, receiver: string, slippageToleranceBps: string): FuelCallParameters;
export declare function getFuelParametersExactOutFromTrade(trade: SerializedTrade, receiver: string, slippageToleranceBps: string): FuelCallParameters;
