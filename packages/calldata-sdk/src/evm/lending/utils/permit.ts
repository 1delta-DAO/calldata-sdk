import { isAaveType, AaveInterestMode, LenderData, LenderGroups } from '..'

export function getPermitAsset(lender: LenderGroups, lenderData: LenderData, mode = AaveInterestMode.NONE) {
  if (isAaveType(lender)) {
    if (mode === AaveInterestMode.VARIABLE) {
      return lenderData.lenderTokens?.debt
    }
    if (mode === AaveInterestMode.STABLE) {
      return lenderData.lenderTokens?.stableDebt
    }
    return lenderData.lenderTokens?.collateral
  }

  if (lender === LenderGroups.CompoundV3 || lender === LenderGroups.MorphoBlue) {
    return lenderData.pool
  }

  return undefined
}
