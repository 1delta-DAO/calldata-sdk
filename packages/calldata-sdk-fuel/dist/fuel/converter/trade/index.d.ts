import { FuelRawCallParameters } from '../../types';
import { SerializedTrade } from '@1delta/type-sdk';
/** Encode the fuel path calldata based on a generix API response */
export declare function getEncodedFuelPathFromTrade(trade: SerializedTrade, receiver: string, slippageToleranceBps: string, deadline: number): FuelRawCallParameters;
/** Encode the fuel path calldata based on a generix API response */
export declare function getFuelPathParamsFromTrade(trade: SerializedTrade, receiver: string, slippageToleranceBps: string): import("../../types").FuelCallParameters;
