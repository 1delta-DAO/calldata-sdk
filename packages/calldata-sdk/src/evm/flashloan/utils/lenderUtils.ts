import { AAVE_LENDERS, AAVE_V2_LENDERS, AAVE_V3_LENDERS, COMPOUND_V2_LENDERS, Lender } from '@1delta/lender-registry'
import { aaveReserves } from '@1delta/data-sdk'

export function isAaveV3Type(lender: string) {
  return AAVE_V3_LENDERS.includes(lender as any)
}

export function isAaveV2Type(lender: string) {
  return AAVE_V2_LENDERS.includes(lender as any)
}

export function isAave(lender: string) {
  return AAVE_LENDERS.includes(lender as any)
}

export function isCompoundV3(lender: string) {
  return lender.startsWith('COMPOUND_V3')
}

export function isCompoundV2(lender: string) {
  return COMPOUND_V2_LENDERS.includes(lender as any)
}

export function isInit(lender: string) {
  return lender === Lender.INIT
}

export function isMorphoType(lender: string) {
  return lender.startsWith('LISTA_DAO') || lender.startsWith('MORPHO_BLUE')
}

export const getLenderAssets = (chainId: string | undefined, lendingProtocol: string = Lender.AAVE_V3): string[] => {
  if (!chainId) return []
  if (isAave(lendingProtocol)) return aaveReserves()?.[lendingProtocol]?.[chainId] ?? []
  return []
}
