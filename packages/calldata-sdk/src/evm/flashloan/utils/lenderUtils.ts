import {
  AAVE_LENDERS,
  AAVE_STYLE_RESERVE_ASSETS,
  AAVE_V2_LENDERS,
  AAVE_V3_LENDERS,
  COMPOUND_STYLE_RESERVE_ASSETS,
  INIT_STYLE_RESERVE_ASSETS,
  Lender,
} from '@1delta/lender-registry'
import { COMPOUND_V2_LENDERS } from '../../lending/types'
import { ChainIdLike } from '@1delta/type-sdk'

export function isAaveV3Type(lender: Lender) {
  return AAVE_V3_LENDERS.includes(lender)
}

export function isAaveV2Type(lender: Lender) {
  return AAVE_V2_LENDERS.includes(lender)
}

export function isAave(lender: Lender) {
  return AAVE_LENDERS.includes(lender)
}

export function isCompoundV3(lender: Lender) {
  return lender.startsWith('COMPOUND_V3')
}

export function isCompoundV2(lender: Lender) {
  return COMPOUND_V2_LENDERS.includes(lender)
}

export const getLenderAssets = (chainId: ChainIdLike | undefined, lendingProtocol = Lender.AAVE_V3): string[] => {
  if (!chainId) return []
  if (isAave(lendingProtocol)) return AAVE_STYLE_RESERVE_ASSETS[lendingProtocol]?.[chainId] ?? []
  if (isCompoundV3(lendingProtocol)) return COMPOUND_STYLE_RESERVE_ASSETS[lendingProtocol]?.[chainId] ?? []
  if (lendingProtocol === Lender.INIT) return INIT_STYLE_RESERVE_ASSETS[lendingProtocol]?.[chainId] ?? []
  return []
}
