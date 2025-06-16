import { DexPayConfig } from "@1delta/calldatalib";
export type SwapParams = Record<string, string>;
export interface AdditionalSwapInfo {
    payConfig: DexPayConfig;
    callbackData?: string | undefined;
}
export declare namespace SwapEncoder {
    function encodeSwapCall(swapParams: SwapParams, additionalData: AdditionalSwapInfo): `0x${string}`;
}
