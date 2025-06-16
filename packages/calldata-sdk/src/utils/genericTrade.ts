import { TradeType } from '../evm/types'
import { FlashLoanProvider } from './flashLoanProvider'
import { SerializedCurrencyAmount, SerializedTrade } from '@1delta/type-sdk'

export interface SwapObject {
  /** input currency amount that also holds currency data */
  inputAmount: SerializedCurrencyAmount
  /** output currency amount that also holds currency data */
  outputAmount: SerializedCurrencyAmount
}

export interface GenericTrade extends SwapObject {
  /** exact input or output */
  tradeType: TradeType
  /** 1delta trade object that is created if aggregator=1delta */
  interfaceTrade?: SerializedTrade
  /** send txn to this address */
  target?: string
  /** approve this address to swap */
  approvalTarget?: string
  /** Sweep the output to the receiver */
  sweepToReceiver?: boolean
  /** flash loan provider (margin only) */
  flashLoanSource?: FlashLoanProvider
}
