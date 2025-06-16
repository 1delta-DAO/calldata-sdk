import { ContractIdInput, IdentityInput } from '../types'
import { Address, CoinQuantity } from 'fuels'
import { DexProtocol } from '@1delta/dex-registry'
import { BPS_BASE, DIESEL_AMM_ID, MIRA_AMM_ID, MIRA_HOOKS_ID } from '../constants/pathConstants'
import _ from 'lodash'

/**
 * Adjusts output amount for slippage tolerance
 * @param output The output amount to adjust
 * @param slippageToleranceBps Slippage tolerance in basis points (e.g., 50 = 0.5%)
 */
export function adjustOutputForSlippage(output: bigint, slippageToleranceBps: string) {
  return (output * BPS_BASE) / (BPS_BASE + BigInt(slippageToleranceBps))
}

/**
 * Adjusts input amount for slippage tolerance
 * @param input The input amount to adjust
 * @param slippageToleranceBps Slippage tolerance in basis points (e.g., 50 = 0.5%)
 */
export function adjustInputForSlippge(input: bigint, slippageToleranceBps: string) {
  return (input * (BPS_BASE + BigInt(slippageToleranceBps))) / BPS_BASE
}

/** get a valid assetID input from hex string */
export function assetIdInput(contractId: string): ContractIdInput {
  return { bits: contractId }
}

/** This is for EOAs as receiver addresses  */
export function addressInput(address: string): IdentityInput {
  return { Address: { bits: Address.fromAddressOrString(address).toB256() } }
}

/** This is for contracts as receiver addresses  */
export function contractIdInput(contractId: string): IdentityInput {
  return { ContractId: { bits: Address.fromAddressOrString(contractId).toB256() } }
}

/** Get the receiver address string for a dex */
export function getDexReceiver(protocol: DexProtocol) {
  switch (protocol) {
    case DexProtocol.MIRA_STABLE:
    case DexProtocol.MIRA_VOLATILE:
      return MIRA_AMM_ID
    case DexProtocol.DIESEL_STABLE:
    case DexProtocol.DIESEL_VOLATILE:
      return DIESEL_AMM_ID

    default:
      throw new Error('Invalid DEX')
  }
}

/** Get a unique list of dexs contract addresses included in array */
export function getDexContracts(protocols: DexProtocol[]) {
  return _.uniq(
    _.uniq(protocols)
      .map((protocol) => {
        switch (protocol) {
          case DexProtocol.MIRA_STABLE:
          case DexProtocol.MIRA_VOLATILE:
            return [MIRA_AMM_ID, MIRA_HOOKS_ID]
          case DexProtocol.DIESEL_STABLE:
          case DexProtocol.DIESEL_VOLATILE:
            return [DIESEL_AMM_ID]

          default:
            throw new Error('Invalid DEX')
        }
      })
      .flat(),
  )
}

/** Aggregate coin inputs into an array of unique entries by assetId */
export function aggregateInputs(qts: CoinQuantity[]): CoinQuantity[] {
  const ccys = _.uniq(qts.map((q) => q.assetId))
  let q: CoinQuantity[] = []
  ccys.map((assetId) => {
    const amount = qts
      .filter((q) => q.assetId === assetId)
      .reduce((a, b) => a + BigInt(b.amount.toString()), 0n)
      .toString()

    q.push({
      assetId,
      amount: amount as any,
    })
  })
  return q
}
