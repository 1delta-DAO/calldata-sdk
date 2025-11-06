import { isAaveType, LendingMode, LenderData, LenderGroups } from '..'

export function getPermitAsset(lender: LenderGroups, lenderData: LenderData, mode = LendingMode.NONE) {
  if (isAaveType(lender)) {
    if (mode === LendingMode.VARIABLE) {
      return lenderData.lenderTokens?.debt
    }
    if (mode === LendingMode.STABLE) {
      return lenderData.lenderTokens?.stableDebt
    }
    return lenderData.lenderTokens?.collateral
  }

  if (lender === LenderGroups.CompoundV3 || lender === LenderGroups.MorphoBlue) {
    return lenderData.pool
  }

  return undefined
}
