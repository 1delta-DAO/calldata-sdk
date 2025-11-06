import { isNativeAddress, isVenusType } from '../utils'
import { isCompoundV2 } from '../../flashloan'
import { compoundV2Tokens } from '@1delta/data-sdk'
import { ShallowCurrencyAmount } from '../types'
import { CompoundV2Lending } from '../../generic/compoundV2'

export namespace CompoundV2NativeLending {
  /**
   * Create direct borrow transaction for compound V2s
   * Only to be used for old forks that do not have delegation.
   * Always borrows to caller!
   */
  export function createCompoundV2Borrow(params: { amount: ShallowCurrencyAmount; lender: any }) {
    const { amount, lender } = params
    const rawAmount = BigInt(amount.amount)
    const { chainId, address } = amount.currency
    const lcAddress = address.toLowerCase()
    const cToken = compoundV2Tokens()?.[lender]?.[chainId]?.[lcAddress]

    // only compound V2s
    if (!isCompoundV2(lender)) throw new Error('Only Compound V2 allowed')

    // for venus we only allow this for bnb
    if (isVenusType(lender) && !isNativeAddress(lcAddress)) {
      throw new Error('Use delegation for Venus non-natives')
    }

    if (!cToken) throw new Error('cToken not provided')
    if (!amount.amount) throw new Error('No amount')

    return {
      to: cToken,
      data: CompoundV2Lending.encodeBorrow(rawAmount),
      value: '0',
    }
  }
}
