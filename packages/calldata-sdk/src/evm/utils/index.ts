import { ChainIdLike } from '@1delta/type-sdk'
import { ONE_DELTA_COMPOSER } from '../consts/composer'
import { Address } from 'viem'
import { TradeType } from '../types'
import { GenericTrade } from '../../utils'

export function getComposerAddress(chainId: ChainIdLike): Address {
  try {
    return ONE_DELTA_COMPOSER[chainId as keyof typeof ONE_DELTA_COMPOSER] as Address
  } catch (error) {
    throw new Error(`Composer not deployed on chain ${chainId}`)
  }
}

export function validateExactInputTrade(trade: GenericTrade): void {
  if (trade.tradeType !== TradeType.EXACT_INPUT) {
    throw new Error('Only exact input swaps are supported for quick actions')
  }
}
