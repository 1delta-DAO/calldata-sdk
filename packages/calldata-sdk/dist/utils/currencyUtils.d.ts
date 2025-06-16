import { SerializedCurrency, SerializedCurrencyAmount } from "@1delta/type-sdk";
export declare namespace CurrencyUtils {
    function getAmount(c: SerializedCurrencyAmount): bigint;
    function isNative(c: SerializedCurrency): boolean;
    function isNativeAmount(c: SerializedCurrencyAmount): boolean;
    function fromRawAmount(currency: SerializedCurrency, amount: bigint | string | number): {
        currency: SerializedCurrency;
        amount: string;
    };
}
