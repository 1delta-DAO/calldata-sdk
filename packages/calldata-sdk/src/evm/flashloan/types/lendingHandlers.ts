import { Address } from 'viem'
import { Lender } from '@1delta/lender-registry'
import { MarginData } from '../types'
import { ContractCallsContext } from '../../../utils'
import { MorphoParams, ShallowCurrency } from '../../lending/types'
import { PermitData } from '../..'

export interface HandleRepayParams {
  isMaxOut: boolean
  lender: Lender
  account: Address
  repayAmount: string | bigint
  marginData: MarginData
  tokenOut: ShallowCurrency
  context: ContractCallsContext
  morphoParams: MorphoParams | undefined
}

export interface HandleWithdrawParams {
  isMaxIn: boolean
  lender: Lender
  account: Address
  tokenIn: ShallowCurrency
  intermediate: Address
  flashRepayBalanceHolder: Address
  flashLoanAmountWithFee: string
  context: ContractCallsContext
  morphoParams: MorphoParams | undefined
  permitData?: PermitData
  composerAddress:string
}
