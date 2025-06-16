import { CoinQuantity } from 'fuels'
import { BatchSwapStepInput, FuelCallParameters, FuelRoute } from '../../types'
import {
  addressInput,
  adjustInputForSlippge,
  adjustOutputForSlippage,
  aggregateInputs,
  contractIdInput,
  getDexContracts,
  getDexReceiver,
} from '../../utils'
import { populateStepFromSwap } from './step'
import { DEAD_LOGGER } from '../../constants'
import { SerializedTrade } from '@1delta/type-sdk'
import { CurrencyUtils } from '../../../utils'

export function getFuelParametersExactInFromTrade(
  trade: SerializedTrade,
  receiver: string,
  slippageToleranceBps: string,
): FuelCallParameters {
  let path: FuelRoute[] = []
  let allProtocols = []
  let inputAssets = []

  for (let swap of trade.swaps) {
    let pool = swap.route.pools[0]
    const amountIn = CurrencyUtils.getAmount(swap.inputAmount)

    const inputQuantity: CoinQuantity = {
      assetId: swap.inputAmount.currency.address,
      amount: amountIn as any,
    }

    inputAssets.push(inputQuantity)

    let steps: BatchSwapStepInput[] = []

    const length = swap.route.pools.length
    const tokenPath = swap.route.path
    const lastIndex = length - 1
    for (let i = 0; i < length; i++) {
      pool = swap.route.pools[i]
      const currentReceiver =
        i === lastIndex ? addressInput(receiver) : contractIdInput(getDexReceiver(swap.route.pools[i + 1].protocol))

      allProtocols.push(pool.protocol)

      const step = populateStepFromSwap(pool, tokenPath[i], tokenPath[i + 1], currentReceiver)

      steps.push(step)

      // access new pool
      if (i < lastIndex) pool = swap.route.pools[i + 1]
    }

    const minimumOut = adjustOutputForSlippage(CurrencyUtils.getAmount(swap.outputAmount), slippageToleranceBps)

    const routeEncoded: FuelRoute = [amountIn.toString(), minimumOut.toString(), true, steps]
    path.push(routeEncoded)
  }

  return {
    path,
    inputAssets: aggregateInputs(inputAssets),
    variableOutputs: trade.swaps.length,
    inputContracts: [...getDexContracts(allProtocols), DEAD_LOGGER],
  }
}

export function getFuelParametersExactOutFromTrade(
  trade: SerializedTrade,
  receiver: string,
  slippageToleranceBps: string,
): FuelCallParameters {
  let path: FuelRoute[] = []
  let allProtocols = []
  let inputAssets = []

  for (let swap of trade.swaps) {
    const length = swap.route.pools.length
    const lastIndex = length - 1
    let pool = swap.route.pools[lastIndex]
    const amountOut = CurrencyUtils.getAmount(swap.outputAmount)

    let steps: BatchSwapStepInput[] = []

    const tokenPath = swap.route.path
    for (let i = lastIndex; i > -1; i--) {
      const currentReceiver =
        i === lastIndex ? addressInput(receiver) : contractIdInput(getDexReceiver(swap.route.pools[i + 1].protocol))

      allProtocols.push(pool.protocol)

      const step = populateStepFromSwap(pool, tokenPath[i], tokenPath[i + 1], currentReceiver)

      steps.push(step)

      // access new pool
      if (i > 0) pool = swap.route.pools[i - 1]
    }

    const amount = CurrencyUtils.getAmount(swap.inputAmount)

    const maximumIn = adjustInputForSlippge(amount, slippageToleranceBps)

    const inputQuantity: CoinQuantity = {
      assetId: swap.inputAmount.currency.address,
      max: (maximumIn + 1n).toString() as any, // need buffer for correcly throwing slippage error
      amount: amount.toString() as any,
    }

    inputAssets.push(inputQuantity)

    const routeEncoded: FuelRoute = [amountOut.toString(), maximumIn.toString(), true, steps]
    path.push(routeEncoded)
  }

  return {
    path,
    inputAssets: aggregateInputs(inputAssets),
    variableOutputs: trade.swaps.length,
    inputContracts: [...getDexContracts(allProtocols), DEAD_LOGGER],
  }
}
