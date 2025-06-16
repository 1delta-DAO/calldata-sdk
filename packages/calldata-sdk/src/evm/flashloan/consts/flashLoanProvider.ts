import {
  ContractCallsContext,
  DebasedContractCallsContext,
  FlashLoanProvider,
} from '../../../utils'
import { flashLoanIsFree } from '../utils'
import { Chain } from '@1delta/asset-registry'

export function needsFlashLoanAdjustment(provider?: FlashLoanProvider) {
  if (!provider) return false
  // either it is already adjusted, or the source does not have a fee
  return !flashLoanIsFree(provider)
}


/** BPS denominator */
export const BPS = 10000n

/** empty context */
export const NO_CONTEXT: ContractCallsContext = {
  callIn: '0x',
  callOut: '0x',
  manualFlashLoanRepayTransfer: '0x',
  cleanup: '0x',
}

/** empty context */
export const DEBASED_NO_CONTEXT: DebasedContractCallsContext = {
  callIn: [],
  callOut: [],
  manualFlashLoanRepayTransfer: '0x',
  cleanup: '0x',
}
