import { SerializedTrade } from '@1delta/type-sdk';
/** Convert raw path data to usable fuel calldata */
export declare class FuelPathConverter {
    /** Use InterfaceTrade object to encode paths for injecting it as `scriptData` */
    static encodeFuelPaths(trade: SerializedTrade, receiver: string, slippageToleranceBps: string, deadline: number): import("../types").FuelRawCallParameters;
    /** Use InterfaceTrade object to get parameters for `main` */
    static getFuelPathParameters(trade: SerializedTrade, receiver: string, slippageToleranceBps: string): import("../types").FuelCallParameters;
}
