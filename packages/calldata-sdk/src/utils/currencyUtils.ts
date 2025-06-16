import { SerializedCurrency, SerializedCurrencyAmount } from "@1delta/type-sdk";
import { zeroAddress } from "viem";

export namespace CurrencyUtils {
    export function getAmount(c: SerializedCurrencyAmount) {
        return BigInt(c.amount)
    }

    export function isNative(c: SerializedCurrency) {
        return c.address === zeroAddress
    }

    export function isNativeAmount(c: SerializedCurrencyAmount) {
        return c.currency.address === zeroAddress
    }

    export function fromRawAmount(currency: SerializedCurrency, amount: bigint | string | number) {
        return {
            currency,
            amount: String(amount)
        }
    }
}