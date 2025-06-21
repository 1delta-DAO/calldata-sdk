import { Address, encodePacked, Hex, maxUint16 } from 'viem'
import { NATIVE_SUPPORTING_PROTOCOLS, PRE_FUNDABLE_DEXES } from '../evm/consts'
import { WRAPPED_NATIVE_INFO } from '@1delta/asset-registry'
import { SwapObject } from './genericTrade'
import { ChainIdLike, SerializedCurrencyAmount, SerializedSwapStep, SerializedTrade } from '@1delta/type-sdk'
import { CurrencyUtils } from './currencyUtils'
import { TradeType, BPS_BASE } from '../evm'

export function getSplits(inputAmount: bigint, splitShares: bigint[]) {
  if (splitShares.length === 1) return '0x'

  const splitData = encodePacked(
    Array(splitShares.length - 1).fill('uint16'),
    splitShares.slice(0, -1).map((share) => (share * maxUint16) / inputAmount),
  ) as Hex
  return splitData
}

function shiftLeft(data: Hex, shift: number): Hex {
  return `0x${data.slice(2).slice(shift * 2)}`
}

/**
 * Checks if a DEX protocol is pre-fundable
 */
export function isPreFundableDex(protocol: string): boolean {
  return PRE_FUNDABLE_DEXES.includes(protocol as any)
}

/**
 * Gets the minimum amount out from a trade with slippage tolerance
 * @param trade The trade to calculate minimum amount out for
 * @param slippageToleranceBps Slippage tolerance in basis points (e.g., 50 = 0.5%)
 * @param tradeType The type of trade
 */
export function minimumAmountOutFromTrade(
  trade: SwapObject,
  slippageToleranceBps: string,
  tradeType: TradeType,
): SerializedCurrencyAmount {
  if (tradeType !== TradeType.EXACT_INPUT) {
    throw new Error('Only exact input trades are supported')
  }

  const outputAmount = CurrencyUtils.getAmount(trade.outputAmount)
  const slippageAdjustedAmountOut = (outputAmount * (BPS_BASE - BigInt(slippageToleranceBps))) / BPS_BASE

  return CurrencyUtils.fromRawAmount(trade.outputAmount.currency, slippageAdjustedAmountOut)
}

export function supportsNativeToken(protocol: string): boolean {
  return NATIVE_SUPPORTING_PROTOCOLS.includes(protocol as any)
}

export function getWethAddress(chainId: ChainIdLike) {
  const wrappedNativeInfo = WRAPPED_NATIVE_INFO[chainId]
  if (!wrappedNativeInfo) {
    throw new Error(`No wrapped native token info for chain ${chainId}`)
  }

  return wrappedNativeInfo.address as Address
}

export function needsUnwrap(trade: SerializedTrade, chainId: ChainIdLike): boolean {
  const WETH_ADDRESS = getWethAddress(chainId)
  const pathLength = trade.swaps[0].route.path.length
  const outputTokenFromSwaps = trade.swaps[0].route.path[pathLength - 1]

  return CurrencyUtils.isNativeAmount(trade.outputAmount) && outputTokenFromSwaps.address === WETH_ADDRESS
}

// @ts-ignore
export function needsWrap(trade: SerializedTrade, chainId: ChainIdLike): boolean {
  return CurrencyUtils.isNativeAmount(trade.inputAmount)
}

export function getAdjustedHopCount(swap: SerializedSwapStep, numHops: number): number {
  const path = swap.route.path
  const pools = swap.route.pools
  let additionalHops = 0

  // Check each hop in the path
  // wrapping for the first hop is handled separately
  for (let i = 1; i < numHops; i++) {
    const currentToken = path[i]
    const pool = pools[i]

    // If current token is native and pool doesn't support native, we need a wrap
    if (CurrencyUtils.isNative(currentToken) && !supportsNativeToken(pool.protocol)) {
      additionalHops++
    }
  }

  return numHops + additionalHops
}

export function getAssetInFromTrade(trade: SwapObject | undefined) {
  if (!trade) throw new Error('tried to get assetIn from undefined trade')
  const { inputAmount } = trade
  return getAssetFromAmount(inputAmount)
}

export function getAssetOutFromTrade(trade: SwapObject | undefined) {
  if (!trade) throw new Error('tried to get assetIn from undefined trade')
  const { outputAmount } = trade
  return getAssetFromAmount(outputAmount)
}

export function getAssetFromAmount(amount: SerializedCurrencyAmount) {
  return amount.currency.address
}

export function getChainIdFromTrade(trade: SwapObject | undefined) {
  if (!trade) throw new Error('tried to get ChainId from undefined trade')
  const {
    inputAmount: {
      currency: { chainId },
    },
  } = trade
  return chainId
}

/**
 * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
 * @param trade The trade to calculate maximum amount in for
 * @param slippageToleranceBps The tolerance of unfavorable slippage in basis points (e.g., 50 = 0.5%)
 * @param tradeType The type of trade
 * @returns The amount in
 */
export function maximumAmountInFromTrade(
  trade: SwapObject,
  slippageToleranceBps: string,
  tradeType = TradeType.EXACT_INPUT,
): SerializedCurrencyAmount {
  const slippageToleranceBpsBigInt = BigInt(slippageToleranceBps)
  if (slippageToleranceBpsBigInt < 0n) {
    throw new Error('SLIPPAGE_TOLERANCE')
  }
  const tt = trade?.hasOwnProperty('tradeType') ? (trade as any).tradeType : tradeType
  if (tt === TradeType.EXACT_INPUT) {
    return trade.inputAmount
  } else {
    const inputAmount = CurrencyUtils.getAmount(trade.inputAmount)
    const slippageAdjustedAmountIn = (inputAmount * (BPS_BASE + slippageToleranceBpsBigInt)) / BPS_BASE

    return CurrencyUtils.fromRawAmount(trade.inputAmount.currency, slippageAdjustedAmountIn)
  }
}

/**
 * Get the maximum amount in that can be spent on this amount for the given slippage tolerance
 * @param amount The amount to calculate maximum input for
 * @param slippageToleranceBps The tolerance of unfavorable slippage in basis points (e.g., 50 = 0.5%)
 * @param tradeType The type of trade
 * @returns The amount in
 */
export function maximumAmountInFromAmount(
  amount: SerializedCurrencyAmount | undefined,
  slippageToleranceBps: string,
  tradeType = TradeType.EXACT_INPUT,
): bigint | undefined {
  if (!amount) return undefined
  if (tradeType === TradeType.EXACT_INPUT) {
    return CurrencyUtils.getAmount(amount)
  } else {
    const rawAmount = CurrencyUtils.getAmount(amount)
    return (rawAmount * (BPS_BASE + BigInt(slippageToleranceBps))) / BPS_BASE
  }
}
