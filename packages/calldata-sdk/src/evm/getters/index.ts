import { aaveTokens, compoundV2Pools, compoundV2Tokens, compoundV3Pools } from '@1delta/data-sdk'
import { LendingMode } from '../lending'
import { Lender } from '@1delta/lender-registry'
import { Chain } from '@1delta/chain-registry'

export function getAaveStyleProtocolTokenMap(chainId: string, lender: string) {
  return aaveTokens()?.[lender]?.[chainId]
}

export function getAaveStyleLenderTokenAddress(
  chainId: string,
  asset: string,
  lender: string,
  irMode: LendingMode = LendingMode.VARIABLE
) {
  return addressToAaveStyleLenderTokenAddress(chainId, asset, lender, irMode)
}

export function addressToAaveStyleLenderTokenAddress(
  chainId: string,
  assetAddress: string,
  lender: string,
  irMode: LendingMode = LendingMode.VARIABLE
) {
  const asset = assetAddress?.toLowerCase()
  if (irMode === LendingMode.VARIABLE) return getAaveStyleProtocolTokenMap(chainId, lender)?.[asset]?.vToken
  if (irMode === LendingMode.STABLE) return getAaveStyleProtocolTokenMap(chainId, lender)?.[asset]?.sToken
  return getAaveStyleProtocolTokenMap(chainId, lender)?.[asset]?.aToken
}

export const getAaveCollateralTokenAddress = (
  chainId: string | undefined,
  lender: string | undefined,
  asset: string | undefined
) => {
  if (!chainId || !asset || !lender) throw new Error('getAaveCollateralTokenAddress: missing parameters')
  const token = getAaveStyleProtocolTokenMap(chainId, lender)?.[asset.toLowerCase()].aToken
  if (!token) throw new Error('No collateral token found for ' + asset)
  return token
}

export const getCompoundV2CollateralTokenAddress = (
  chainId: string | undefined,
  lender: string | undefined,
  asset: string | undefined
) => {
  if (!chainId || !asset || !lender) throw new Error('getCompoundV2CollateralTokenAddress: missing parameters')
  return compoundV2Tokens()?.[lender]?.[chainId]?.[asset.toLowerCase()]
}

export function getCompoundV3CometAddress(chainId?: string, lender: string = Lender.COMPOUND_V3_USDC): string {
  if (!chainId || !lender) throw new Error('getCompoundV3CometAddress: missing parameters')
  const comet = compoundV3Pools()?.[chainId]?.[lender]
  if (!comet) throw new Error('getCompoundV3Comet: comet not found for ' + chainId + ' ' + lender)
  return comet
}

export function getInitPosManagerAddress(chainId?: string) {
  if (chainId !== Chain.MANTLE) throw new Error('getInitPosManagerAddress: only supported on Mantle')
  return '0x0e7401707CD08c03CDb53DAEF3295DDFb68BBa92'
}

export function getCompoundV2Comptroller(chainId: string, lender: string = Lender.VENUS): string {
  if (!chainId || !lender) throw new Error('getCompoundV2Comptroller: missing parameters')
  const comptroller = compoundV2Pools()?.[lender]?.[chainId]?.toLowerCase()
  if (!comptroller) throw new Error('getCompoundV2Comptroller: comptroller not found for ' + chainId + ' ' + lender)
  return comptroller
}
