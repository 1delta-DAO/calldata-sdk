import { BatchSwapStepInput, IdentityInput } from "../../types";
import { assetIdInput } from "../../utils";
import { SerializedCurrency, SerializedPool } from "@1delta/type-sdk";

/** Converts a single generic pair to a step parameter */
export function populateStepFromSwap(pool: SerializedPool, tokenIn: SerializedCurrency, tokenOut: SerializedCurrency, currentReceiver: IdentityInput): BatchSwapStepInput {
    return {
        dex_id: 0, // only diesel and mira as v2 forks
        asset_in: assetIdInput(tokenIn.address),
        asset_out: assetIdInput(tokenOut.address),
        receiver: currentReceiver,
        data: (pool.swapParams.data as string[]).map(id => Number(id))
    }
}
