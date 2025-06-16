import { BigNumberish, Bytes, CoinQuantity } from "fuels"

// we accept the redundancy vs. the base-sdk being a dependency
export enum TradeType {
    EXACT_INPUT,
    EXACT_OUTPUT,
  }

interface TokenWithAddress {
    address: string
}

export interface GenericFuelPoolInRoute {
    protocol: string
    tokenIn: TokenWithAddress
    tokenOut: TokenWithAddress
    tradeIdentifier: string[]
    amountIn: string
    amountOut: string
}

export type Enum<T> = {
    [K in keyof T]: Pick<T, K> & { [P in Exclude<keyof T, K>]?: never };
}[keyof T];

export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;

export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;
export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type AssetIdInput = { bits: string };
export type AssetIdOutput = AssetIdInput;

export type BatchSwapStepInput = { dex_id: BigNumberish, asset_in: AssetIdInput, asset_out: AssetIdInput, receiver: IdentityInput, data: Bytes };
export type FuelRoute = [BigNumberish, BigNumberish, true, BatchSwapStepInput[]]

export type SimpleRoute = GenericFuelPoolInRoute[]

export interface FuelRawCallParameters {
    params: Uint8Array,
    inputAssets: CoinQuantity[],
    variableOutputs: number
    inputContracts: string[]
}


export interface FuelCallParameters {
    path: FuelRoute[],
    inputAssets: CoinQuantity[],
    variableOutputs: number
    inputContracts: string[]
}