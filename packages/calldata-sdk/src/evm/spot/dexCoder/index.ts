import { DexPayConfig, DexTypeMappings, encodePacked } from "@1delta/calldatalib"

export type SwapParams = Record<string, string>

export interface AdditionalSwapInfo {
    payConfig: DexPayConfig
    callbackData?: string | undefined
}

export namespace SwapEncoder {
    export function encodeSwapCall(swapParams: SwapParams, additionalData: AdditionalSwapInfo) {
        switch (swapParams.dexId as any) {
            case DexTypeMappings.UNISWAP_V3_ID:
            case DexTypeMappings.IZI_ID:
                return encodePacked(
                    ['uint8', 'uint16', 'uint16', 'bytes'],
                    [
                        swapParams.forkId,
                        swapParams.fee,
                        ...mapConfigWithCallbackData(additionalData)
                    ],
                )
            case DexTypeMappings.UNISWAP_V2_ID:
            case DexTypeMappings.UNISWAP_V2_FOT_ID:
                return encodePacked(
                    ['uint16', 'uint8', 'uint16', 'bytes'],
                    [
                        swapParams.feeDenom,
                        swapParams.forkId,
                        ...mapConfigWithCallbackData(additionalData)
                    ],
                )
            case DexTypeMappings.LB_ID:
                return encodePacked(
                    ['uint8', 'uint8'],
                    [
                        swapParams.swapForY ? 1 : 0,
                        additionalData.payConfig,
                    ],
                )
            case DexTypeMappings.SYNC_SWAP_ID:
            case DexTypeMappings.GMX_ID:
            case DexTypeMappings.WOO_FI_ID:
            case DexTypeMappings.KTX_ID:
                return encodePacked(
                    ['uint8'],
                    [
                        additionalData.payConfig,
                    ],
                )
            case DexTypeMappings.DODO_ID:
                return encodePacked(
                    ['uint8', 'uint16', 'uint16', 'bytes'],
                    [
                        swapParams.sellQuote,
                        swapParams.index,
                        ...mapConfigWithCallbackData(additionalData)
                    ],
                )

            case DexTypeMappings.CURVE_FORK_ID:
            case DexTypeMappings.CURVE_RECEIVED_ID:
            case DexTypeMappings.CURVE_V1_STANDARD_ID:
                return encodePacked(
                    ["uint8", "uint8", "uint8", "uint16"],
                    [
                        swapParams.indexIn,
                        swapParams.indexOut,
                        swapParams.selectorId,
                        additionalData.payConfig,
                    ],
                )

            case DexTypeMappings.UNISWAP_V4_ID:
            case DexTypeMappings.BALANCER_V3_ID:
            case DexTypeMappings.ERC4626_ID:
            case DexTypeMappings.ASSET_WRAP_ID:
            case DexTypeMappings.BALANCER_V2_ID:
            default:
                throw new Error("Not yet implemented")
        }
    }

    /**
     * 
     * @param additionalData payConfig, callbackData (if any)
     * @returns 
     */
    function mapConfigWithCallbackData(additionalData: AdditionalSwapInfo) {
        if (!additionalData.callbackData) return [additionalData.payConfig, "0x"]
        if (additionalData.payConfig < 2 && additionalData.callbackData.length / 2 - 1 > 2) throw new Error("Invalid config for callback");

        const { payConfig, callbackData } = additionalData
        return [
            (payConfig === DexPayConfig.FLASH ? callbackData.length / 2 - 1 : payConfig),
            (payConfig === DexPayConfig.FLASH ? callbackData : "0x"),
        ]

    }
}