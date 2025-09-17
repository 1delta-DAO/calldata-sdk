import { Lender } from '@1delta/asset-registry'
import { AaveInterestMode, MorphoParams } from '../../lending/types'
import { GenericTrade, PermitData } from '../..'
import { SerializedCurrencyAmount } from '@1delta/type-sdk'

export enum MarginTradeType {
  Open = 'Open',
  Close = 'Close',
  CollateralSwap = 'CollateralSwap',
  DebtSwap = 'DebtSwap',
  ZapIn = 'ZapIn',
}

export interface MarginData {
  /** operation */
  marginTradeType: MarginTradeType
  /** Aave style interest mode for input */
  irModeIn: AaveInterestMode
  /** Aave style interest mode for output */
  irModeOut: AaveInterestMode
  /** lender id */
  lender: Lender
  /** input morpho parameters */
  morphoParamsIn?: MorphoParams
  /** output morpho parameters */
  morphoParamsOut?: MorphoParams
  /** permit */
  permitData?: PermitData
  /** zap data */
  zapData?: ZapData
}

export interface ZapData {
  inAsset: SerializedCurrencyAmount
  /** if true, use the collateral asset, otherwise use the debt asset */
  useCollateralAsset: boolean
  trades: GenericTrade[]
  /** Explicit borrow amount (debt asset) used to size the flash loan */
  borrowAmount?: SerializedCurrencyAmount
  /** Optional permit to pull user funds */
  userPermit?: PermitData
}
