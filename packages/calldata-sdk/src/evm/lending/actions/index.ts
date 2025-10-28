import { Address, encodePacked, Hex, zeroAddress } from 'viem'
import {
  createBorrowParams,
  CreateDepositParams,
  CreateRepayParams,
  createWithdrawParams,
  LenderGroups,
  OverrideAmount,
  TransferToLenderType,
} from '../types'
import {
  ComposerCommands,
  encodeApprove,
  encodeCompoundV2SelectorId,
  encodeMorphoBorrow,
  encodeMorphoDeposit,
  encodeMorphoDepositCollateral,
  encodeMorphoWithdraw,
  encodeMorphoWithdrawCollateral,
  encodeUint8AndBytes,
  generateAmountBitmap,
  getMorphoLoanAsset,
  LenderOps,
  uint128,
  uint16,
  uint8,
  CompoundV2Selector,
} from '@1delta/calldatalib'
import {
  getAssetParamsFromAmount,
  getCollateralToken,
  getDebtToken,
  getIsBaseToken,
  getLenderData,
  getLenderId,
  getPool,
  isNativeAddress,
} from '../utils'
import { UINT112_MAX } from '../consts'
import { Lender } from '@1delta/lender-registry'
import { SerializedCurrencyAmount } from '@1delta/type-sdk'
import { isCompoundV2, isMorphoType } from '../../flashloan'

function isVenusType(lender: string) {
  return lender.startsWith('VENUS')
}

/** Yldr is lieke aave, just with no borrow mode */
function isYldr(lender: string) {
  return lender === Lender.YLDR
}

export namespace ComposerLendingActions {
  function getAssetData(amount: SerializedCurrencyAmount | OverrideAmount, lender: Lender) {
    if (isOverrideAmount(amount)) {
      return {
        asset: amount.asset,
        lenderData: getLenderData(lender, amount.chainId, amount.asset),
      }
    }
    const { asset, chainId } = getAssetParamsFromAmount(amount as SerializedCurrencyAmount)
    return {
      asset: asset,
      lenderData: getLenderData(lender, chainId, asset),
    }
  }

  function isOverrideAmount(amount: SerializedCurrencyAmount | OverrideAmount): amount is OverrideAmount {
    return 'asset' in amount && 'amount' in amount && 'chainId' in amount && !!amount.asset && !!amount.chainId
  }

  export function createDeposit(params: CreateDepositParams) {
    const { receiver, amount, lender, morphoParams, transferType = TransferToLenderType.Amount, useOverride } = params
    const { asset, lenderData } = isOverrideAmount(amount)
      ? { asset: amount.asset, lenderData: getLenderData(lender, amount.chainId, amount.asset) }
      : getAssetData(amount, lender)

    if (transferType === TransferToLenderType.UserBalance) throw new Error('Cannot deposit user balance')
    let amountUsed = isOverrideAmount(amount) ? amount.amount : BigInt(amount.amount)
    if (transferType === TransferToLenderType.ContractBalance) amountUsed = 0n // deposit balance

    // handle morpho case
    if (isMorphoType(lender)) {
      if (!morphoParams) {
        throw new Error('Morpho params should be defined for MorphoBlue deposits')
      }

      // this is to deposit collateral
      if (!morphoParams.isLoanToken)
        return encodeMorphoDepositCollateral(
          morphoParams.market,
          amountUsed,
          receiver as Address,
          morphoParams.data,
          morphoParams.morphoB as Address,
          BigInt(morphoParams.pId)
        )

      // this deposits the earn token
      return encodeMorphoDeposit(
        morphoParams.market,
        morphoParams.isShares,
        amountUsed,
        receiver as Address,
        morphoParams.data,
        morphoParams.morphoB as Address,
        BigInt(morphoParams.pId)
      )
    }

    const pool = useOverride?.pool ?? getPool(lenderData)

    if (!pool) {
      throw new Error('Pool should be defined for deposits')
    }

    if (isCompoundV2(lender)) {
      return encodePacked(
        ['bytes', 'uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'],
        [
          isNativeAddress(asset) ? '0x' : encodeApprove(asset as Address, pool as Address),
          ComposerCommands.LENDING,
          LenderOps.DEPOSIT,
          getLenderId(lenderData.group),
          asset as Address,
          encodeCompoundV2SelectorId(
            amountUsed,
            // MINT_BEHALF for VENUS & forks, otherwise MINT
            isVenusType(lender) && !isNativeAddress(asset) ? CompoundV2Selector.MINT_BEHALF : CompoundV2Selector.MINT
          ),
          receiver as Address,
          pool as Address,
        ]
      )
    }
    return encodePacked(
      ['bytes', 'uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'],
      [
        isNativeAddress(asset) ? '0x' : encodeApprove(asset as Address, pool as Address),
        ComposerCommands.LENDING,
        LenderOps.DEPOSIT,
        getLenderId(lenderData.group),
        asset as Address,
        amountUsed,
        receiver as Address,
        pool as Address,
      ]
    )
  }

  export function createWithdraw(params: createWithdrawParams) {
    const { receiver, amount, lender, transferType = TransferToLenderType.Amount, morphoParams, useOverride } = params
    const { asset, lenderData } = isOverrideAmount(amount)
      ? { asset: amount.asset, lenderData: getLenderData(lender, amount.chainId, amount.asset) }
      : getAssetData(amount, lender)
    let amountUsed = isOverrideAmount(amount) ? amount.amount : BigInt(amount.amount)
    if (transferType === TransferToLenderType.UserBalance) amountUsed = UINT112_MAX // withdraw max

    if (transferType === TransferToLenderType.ContractBalance) throw new Error('Cannot withdraw contract balance')

    const pool = useOverride?.pool ?? getPool(lenderData)
    const collateralToken = useOverride?.collateralToken ?? getCollateralToken(lenderData)

    const genericPart = encodePacked(
      ['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address'],
      [
        ComposerCommands.LENDING,
        LenderOps.WITHDRAW,
        getLenderId(lenderData.group),
        asset as Address,
        BigInt(amountUsed),
        receiver as Address,
      ]
    )
    switch (lenderData.group) {
      case LenderGroups.AaveV2:
      case LenderGroups.AaveV3:
        if (!pool || !collateralToken) {
          throw new Error('Pool and collateralToken should be defined for AaveV2/V3 withdrawals')
        }
        return encodePacked(['bytes', 'address', 'address'], [genericPart, collateralToken as Address, pool as Address])
      case LenderGroups.CompoundV2:
        if (!collateralToken) {
          throw new Error('collateralToken should be defined for CompoundV2 withdrawals')
        }
        encodePacked(
          ['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'],
          [
            ComposerCommands.LENDING,
            LenderOps.WITHDRAW,
            getLenderId(lenderData.group),
            asset as Address,
            // we leave the all-supported REDEEM here for now
            encodeCompoundV2SelectorId(amountUsed, CompoundV2Selector.REDEEM),
            receiver as Address,
            collateralToken as Address,
          ]
        )
        return encodePacked(['bytes', 'address'], [genericPart, collateralToken as Address])
      case LenderGroups.CompoundV3:
        const isBase = getIsBaseToken(lenderData, asset)
        if (!pool) {
          throw new Error('Comet should be defined for CompoundV3 withdrawals')
        }
        return encodePacked(['bytes', 'uint8', 'address'], [genericPart, isBase ? 1 : 0, pool as Address])
      case LenderGroups.MorphoBlue:
        if (!morphoParams) {
          throw new Error('Morpho params should be defined for MorphoBlue withdrawals')
        }
        if (!morphoParams.isLoanToken)
          return encodeMorphoWithdrawCollateral(
            morphoParams.market,
            BigInt(amountUsed),
            receiver as Address,
            morphoParams.morphoB as Address
          )

        return encodeMorphoWithdraw(
          morphoParams.market,
          morphoParams.isShares,
          BigInt(amountUsed),
          receiver as Address,
          morphoParams.morphoB as Address
        )
      default:
        throw new Error('Lender not supported')
    }
  }

  export function createBorrow(params: createBorrowParams) {
    const { receiver, amount, lender, aaveInterestMode: mode, morphoParams, useOverride } = params
    const { asset, lenderData } = isOverrideAmount(amount)
      ? { asset: amount.asset, lenderData: getLenderData(lender, amount.chainId, amount.asset) }
      : getAssetData(amount, lender)

    if (isNativeAddress(asset)) throw new Error('Cannot delegate native borrowing')

    const amountUsed = isOverrideAmount(amount) ? amount.amount : BigInt(amount.amount)

    const pool = useOverride?.pool ?? getPool(lenderData)

    const genericPart = encodePacked(
      ['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address'],
      [
        ComposerCommands.LENDING,
        LenderOps.BORROW,
        getLenderId(lenderData.group),
        asset as Address,
        amountUsed,
        receiver as Address,
      ]
    )
    switch (lenderData.group) {
      case LenderGroups.AaveV2:
      case LenderGroups.AaveV3:
        if (!pool || !mode) {
          throw new Error('Pool and mode should be defined for AaveV2/V3 borrows')
        }
        return encodePacked(['bytes', 'uint8', 'address'], [genericPart, isYldr(lender) ? 0 : mode, pool as Address])
      case LenderGroups.CompoundV2:
        // collateral tokens for compound V2
        const lendingToken = useOverride?.collateralToken ?? getCollateralToken(lenderData)
        return encodePacked(['bytes', 'address'], [genericPart, lendingToken as Address])
      case LenderGroups.CompoundV3:
        if (!pool) {
          throw new Error('Comet should be defined for CompoundV3 borrows')
        }
        return encodePacked(['bytes', 'address'], [genericPart, pool as Address])
      case LenderGroups.MorphoBlue:
        if (!morphoParams) {
          throw new Error('Morpho params should be defined for MorphoBlue borrows')
        }
        return encodeMorphoBorrow(
          morphoParams.market,
          morphoParams.isShares,
          amountUsed,
          receiver as Address,
          morphoParams.morphoB as Address
        )
      default:
        throw new Error('Lender not supported')
    }
  }

  export function createRepay(params: CreateRepayParams) {
    const {
      receiver,
      amount,
      lender,
      aaveInterestMode: mode,
      morphoParams,
      transferType = TransferToLenderType.Amount,
      useOverride,
    } = params
    let amountUsed = isOverrideAmount(amount) ? amount.amount : BigInt(amount.amount)
    const { asset, lenderData } = isOverrideAmount(amount)
      ? { asset: amount.asset, lenderData: getLenderData(lender, amount.chainId, amount.asset) }
      : getAssetData(amount, lender)

    const pool = useOverride?.pool ?? getPool(lenderData)
    const collateralToken = useOverride?.collateralToken ?? getCollateralToken(lenderData)
    const debtToken = useOverride?.debtToken ?? getDebtToken(lenderData)

    switch (transferType) {
      case TransferToLenderType.ContractBalance:
        amountUsed = 0n
        break
      case TransferToLenderType.UserBalance:
        amountUsed = UINT112_MAX
        break
    }
    let approveCall: Hex = '0x'
    switch (lenderData.group) {
      case LenderGroups.AaveV2:
      case LenderGroups.AaveV3:
      case LenderGroups.CompoundV3:
        if (!pool) {
          throw new Error('Pool/Comet should be defined for AaveV2/V3 and CompoundV3 repayments')
        }
        approveCall = encodeApprove(asset as Address, pool as Address)
        break
      case LenderGroups.CompoundV2:
        if (!collateralToken) {
          throw new Error('cToken should be defined for CompoundV2 repayments')
        }
        approveCall = asset == zeroAddress ? '0x' : encodeApprove(asset as Address, collateralToken as Address)
        break

      case LenderGroups.MorphoBlue:
        if (!morphoParams) {
          throw new Error('Morpho params should be defined for MorphoBlue repayments')
        }
        approveCall = encodeApprove(getMorphoLoanAsset(morphoParams.market), morphoParams.morphoB as Address)
        break
    }

    const genericPart = encodePacked(
      ['bytes', 'uint8', 'uint8', 'uint16'],
      [approveCall, ComposerCommands.LENDING, LenderOps.REPAY, getLenderId(lenderData.group)]
    )
    switch (lenderData.group) {
      case LenderGroups.AaveV2:
      case LenderGroups.AaveV3:
        if (!pool || !mode || !debtToken) {
          throw new Error('Pool, mode and debtToken should be defined for AaveV2/V3 repayments')
        }
        return encodePacked(
          ['bytes', 'address', 'uint128', 'address', 'uint8', 'address', 'address'],
          [
            genericPart,
            asset as Address,
            BigInt(amountUsed),
            receiver as Address,
            isYldr(lender) ? 0 : mode,
            debtToken as Address,
            pool as Address,
          ]
        )
      case LenderGroups.CompoundV2:
        if (!collateralToken) {
          throw new Error('collateralToken is required for compoundV2 repayment')
        }
        return encodePacked(
          ['bytes', 'address', 'uint128', 'address', 'address'],
          [genericPart, asset as Address, amountUsed, receiver as Address, collateralToken as Address]
        )
      case LenderGroups.CompoundV3:
        if (!pool) {
          throw new Error('Comet should be defined for CompoundV3 withdrawals')
        }
        return encodePacked(
          ['bytes', 'address', 'uint128', 'address', 'address'],
          [genericPart, asset as Address, BigInt(amountUsed), receiver as Address, pool as Address]
        )
      case LenderGroups.MorphoBlue:
        if (!morphoParams) {
          throw new Error('Morpho params should be defined for MorphoBlue withdrawals')
        }
        return encodePacked(
          ['bytes', 'bytes', 'uint128', 'address', 'address', 'uint16', 'bytes'],
          [
            genericPart,
            morphoParams.market,
            generateAmountBitmap(uint128(BigInt(amountUsed)), morphoParams.isShares, morphoParams.unsafeRepayment),
            receiver as Address,
            morphoParams.morphoB as Address,
            // length > 2 indicates that there is more than just 0x
            // we use length / 2 as we add one byte unit for the poolId at the end
            uint16(morphoParams.data.length > 2 ? morphoParams.data.length / 2 : 0),
            morphoParams.data.length > 2 ? encodeUint8AndBytes(uint8(morphoParams.pId), morphoParams.data) : '0x',
          ]
        )
      default:
        throw new Error('Lender not supported')
    }
  }
}
