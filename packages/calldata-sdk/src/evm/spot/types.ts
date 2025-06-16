import { SerializedCurrencyAmount } from '@1delta/type-sdk'
import { Hex, Address } from 'viem'
import { GenericTrade, PermitData } from '../..'

export type SpotCalldataParams = {
  /** General trade object */
  trade: GenericTrade
  /** If the trade has no interface trade path definition, use external call data */
  externalCall?: ExternalCallParams
  /** Slippage as stringified bigint in bps */
  slippageTolerance: string
  /** receiver address */
  receiver: Address
  /** Composer address override */
  composer?: Address
  /** Optional permit info */
  permitData?: PermitData
  /** 
   * If true, assume that the contract is funded
   * For composer direct swaps, composer hjolds the funds
   * For forwarded aggregator swaps, the forwarder holds the funds 
   */
  skipFunding?: boolean

  /** If true, we assume that the input is an FOT token */
  fotInput?: boolean
}

export interface HandleExternalAggregatorSwapParams {
  externalCall: ExternalCallParams
  inputAmount: SerializedCurrencyAmount
  outputAmount: SerializedCurrencyAmount
  receiver: Address
  callForwarder: Address
  sweepToReceiver?: boolean
  permitData?: PermitData
}

export interface ExternalCallParams {
  target: Address
  calldata: Hex
  additionalData?: Hex
  callForwarder: Address
  value?: string
  useSelfBalance?: boolean
}
