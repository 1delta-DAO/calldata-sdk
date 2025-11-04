import { zeroAddress } from "viem";
import { ShallowCurrency, ShallowCurrencyAmount } from "../evm";

export namespace CurrencyUtils {
    export function getAmount(c: ShallowCurrencyAmount) {
        return BigInt(c.amount)
    }

    export function isNative(c: ShallowCurrency) {
        return c.address === zeroAddress
    }

    export function isNativeAmount(c: ShallowCurrencyAmount) {
        return c.currency.address === zeroAddress
    }

    export function fromRawAmount(currency: ShallowCurrency, amount: bigint | string | number) {
        return {
            currency,
            amount: String(amount)
        }
    }
}