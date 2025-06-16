import { BatchSwapStepInput, IdentityInput } from "../../types";
import { SerializedCurrency, SerializedPool } from "@1delta/type-sdk";
/** Converts a single generic pair to a step parameter */
export declare function populateStepFromSwap(pool: SerializedPool, tokenIn: SerializedCurrency, tokenOut: SerializedCurrency, currentReceiver: IdentityInput): BatchSwapStepInput;
