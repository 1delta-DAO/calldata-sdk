import { AAVE_LENDERS, AAVE_V2_LENDERS, AAVE_V3_LENDERS, COMPOUND_V2_LENDERS, Lender } from '@1delta/lender-registry'
import { aaveReserves } from '@1delta/data-sdk'

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

export function isMorphoType(lender: Lender) {
  return lender.startsWith('LISTA_DAO') || lender.startsWith('MORPHO_BLUE')
}

export const getLenderAssets = (chainId: string | undefined, lendingProtocol = Lender.AAVE_V3): string[] => {
  if (!chainId) return []
  if (isAave(lendingProtocol)) return aaveReserves()?.[lendingProtocol]?.[chainId] ?? []
  return []
}
