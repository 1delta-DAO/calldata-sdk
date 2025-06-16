import { Interface } from 'fuels'
import EXACT_IN_SCRIPT_ABI from '../../abi/batch_swap_exact_in_script-loader-abi.json'
import EXACT_OUT_SCRIPT_ABI from '../../abi/batch_swap_exact_out_script-loader-abi.json'
import { FuelRawCallParameters, TradeType } from '../../types'
import { ScriptFunctions } from '../../constants/pathConstants'
import { getFuelParametersExactInFromTrade, getFuelParametersExactOutFromTrade } from './toParameters'
import { SerializedTrade } from '@1delta/type-sdk'

/** Encode the fuel path calldata based on a generix API response */
export function getEncodedFuelPathFromTrade(
  trade: SerializedTrade,
  receiver: string,
  slippageToleranceBps: string,
  deadline: number,
) {
  if (trade.tradeType === TradeType.EXACT_INPUT)
    return getEncodedFuelPathExactInFromTrade(trade, receiver, slippageToleranceBps, deadline)
  else return getEncodedFuelPathExactOutFromTrade(trade, receiver, slippageToleranceBps, deadline)
}

/** Encode the fuel path calldata based on a generix API response */
export function getFuelPathParamsFromTrade(trade: SerializedTrade, receiver: string, slippageToleranceBps: string) {
  if (trade.tradeType === TradeType.EXACT_INPUT)
    return getFuelParametersExactInFromTrade(trade, receiver, slippageToleranceBps)
  else return getFuelParametersExactOutFromTrade(trade, receiver, slippageToleranceBps)
}

function getEncodedFuelPathExactInFromTrade(
  trade: SerializedTrade,
  receiver: string,
  slippageToleranceBps: string,
  deadline: number,
): FuelRawCallParameters {
  const { path, inputAssets, variableOutputs, inputContracts } = getFuelParametersExactInFromTrade(
    trade,
    receiver,
    slippageToleranceBps,
  )

  const abiInterface = new Interface(EXACT_IN_SCRIPT_ABI)

  const functionName = ScriptFunctions.Main

  return {
    params: abiInterface.getFunction(functionName).encodeArguments([path, deadline]),
    inputAssets,
    variableOutputs,
    inputContracts,
  }
}

function getEncodedFuelPathExactOutFromTrade(
  trade: SerializedTrade,
  receiver: string,
  slippageToleranceBps: string,
  deadline: number,
): FuelRawCallParameters {
  const { path, inputAssets, variableOutputs, inputContracts } = getFuelParametersExactOutFromTrade(
    trade,
    receiver,
    slippageToleranceBps,
  )

  const abiInterface = new Interface(EXACT_OUT_SCRIPT_ABI)

  const functionName = ScriptFunctions.Main

  return {
    params: abiInterface.getFunction(functionName).encodeArguments([path, deadline]),
    inputAssets,
    variableOutputs,
    inputContracts,
  }
}
