import { Hex } from 'viem'

/**
 * Interface for EVM calldata parameters
 */
export interface EVMCallParams {
  calldata: Hex
  value: bigint
}

/**
 * Trade type
 * @notice ExactOutput is not supported is only added for backward compatibility with frontend codebase
 */
export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export interface PermitData {
  data: Hex
  isPermit2: boolean
}
