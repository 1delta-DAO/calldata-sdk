import { getAssetData, isNativeAddress, isVenusType } from '../utils'
import { isCompoundV2 } from '../../flashloan'
import { encodeFunctionData, parseAbi } from 'viem'
import { SerializedCurrencyAmount } from '@1delta/type-sdk'

export namespace CompoundV2NativeLending {
  /**
   * Create direct borrow transaction for compound V2s
   * Only to be used for old forks that do not have delegation.
   * Always borrows to caller!
   */
  export function createCompoundV2Borrow(params: { amount: SerializedCurrencyAmount; lender: any }) {
    const { amount, lender } = params

    const { asset, lenderData } = getAssetData(amount, lender)

    // only compound V2s
    if (!isCompoundV2(lender)) throw new Error('Only Compound V2 allowed')

    // for venus we only allow this for bnb
    if (isVenusType(lender) && !isNativeAddress(asset)) {
      throw new Error('Use delegation for Venus non-natives')
    }

    if (!lenderData.pool) throw new Error('cToken not provided')
    if (!amount.amount) throw new Error('No amount')

    const abi = parseAbi(['function borrow(uint256 amount) external returns (uint256)'])
    return {
      to: lenderData.pool,
      data: encodeFunctionData({
        abi,
        functionName: 'borrow',
        args: [BigInt(amount.amount)],
      }),
      value: '0',
    }
  }
}
