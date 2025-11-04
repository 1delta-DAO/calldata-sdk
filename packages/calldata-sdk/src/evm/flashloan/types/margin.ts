import { Lender } from '@1delta/lender-registry'
import { AaveInterestMode, MorphoParams } from '../../lending/types'
import { PermitData } from '../..'

export enum MarginTradeType {
  Open = 'Open',
  Close = 'Close',
  CollateralSwap = 'CollateralSwap',
  DebtSwap = 'DebtSwap',
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
}
