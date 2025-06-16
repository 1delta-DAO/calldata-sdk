import { Lender } from '@1delta/asset-registry'
import { AaveInterestMode, MorphoParams } from '../../lending/types'
import { PermitData } from '../..'

export enum MarginTradeType {
  Open = 'Open',
  Close = 'Close',
  CollateralSwap = 'CollateralSwap',
  DebtSwap = 'DebtSwap',
}

export interface MarginData {
  marginTradeType: MarginTradeType
  irModeIn: AaveInterestMode
  irModeOut: AaveInterestMode
  lender: Lender
  morphoParams?: MorphoParams
  permitData?: PermitData
}
