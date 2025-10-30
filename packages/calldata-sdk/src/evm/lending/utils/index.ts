import {
  Lender,
  AAVE_V2_LENDERS,
  AAVE_LENDERS,
  COMPOUND_V3_LENDERS,
  COMPOUND_V2_LENDERS,
} from '@1delta/lender-registry'
import { LenderData, LenderGroups, OverrideAmount, ShallowCurrencyAmount } from '../types'
import { ComposerCommands, FlashLoanIds, LenderIds, PermitIds, uint16 } from '@1delta/calldatalib'
import { Address, encodePacked, Hex, zeroAddress } from 'viem'
import { ChainIdLike } from '@1delta/type-sdk'
import { FLASH_LOAN_PROVIDERS, FlashLoanProvider } from '../../../utils'
import { BALANCER_V2_FORKS } from '@1delta/dex-registry'
import { FlashInfo } from '../../flashloan/types/marginHandlers'
import { isAaveV2Type, isAaveV3Type, isCompoundV2, isCompoundV3, isMorphoType } from '../../flashloan'
import {
  aavePools,
  aaveTokens,
  compoundV2Tokens,
  compoundV3BaseData,
  compoundV3Pools,
  morphoPools,
} from '@1delta/data-sdk'
import { WRAPPED_NATIVE_INFO } from '@1delta/wnative'

export * from './permit'


export const isVenusType = (lender: string) => lender.startsWith('VENUS')

export function isOverrideAmount(amount: ShallowCurrencyAmount | OverrideAmount): amount is OverrideAmount {
  return 'asset' in amount && 'amount' in amount && 'chainId' in amount && !!amount.asset && !!amount.chainId
}

export function getAssetData(amount: ShallowCurrencyAmount | OverrideAmount, lender: Lender) {
  if (isOverrideAmount(amount)) {
    return {
      asset: amount.asset,
      lenderData: getLenderData(lender, amount.chainId, amount.asset),
    }
  }
  const { asset, chainId } = getAssetParamsFromAmount(amount as ShallowCurrencyAmount)
  return {
    asset: asset,
    lenderData: getLenderData(lender, chainId, asset),
  }
}

export function getLenderData(lender: Lender, chainId: ChainIdLike, asset: string): LenderData {
  // check if the lender is aave (all aave forks)
  if (AAVE_LENDERS.includes(lender)) {
    const key = lender
    const { pool } = aavePools()?.[key]?.[chainId]
    const aaveTokensForFork = aaveTokens()[key]
    const chainKey = chainId
    // aave only accepts wNative, adjust for this here
    const _asset = asset === zeroAddress ? WRAPPED_NATIVE_INFO[chainId].address : asset
    const { aToken, sToken, vToken } = aaveTokensForFork[chainKey][_asset.toLowerCase()] // asset addresses in asset-registry are not checksum addresses
    const group = AAVE_V2_LENDERS.includes(lender) ? LenderGroups.AaveV2 : LenderGroups.AaveV3
    return {
      lender,
      pool: pool as Address,
      lenderTokens: {
        collateral: aToken as Address,
        debt: vToken as Address,
        stableDebt: sToken as Address,
        base: undefined,
      },
      group,
    }
  }

  // check if the lender is compoundV2
  if (COMPOUND_V2_LENDERS.includes(lender)) {
    const key = lender
    // Convert asset address to lowercase to match the registry format
    const normalizedAsset = asset.toLowerCase()
    const cToken = compoundV2Tokens()[key]?.[chainId]?.[normalizedAsset]
    return {
      lender,
      pool: undefined,
      lenderTokens: {
        collateral: cToken as Address,
        debt: undefined,
        stableDebt: undefined,
        base: undefined,
      },
      group: LenderGroups.CompoundV2,
    }
  }

  // check if the lender is compoundV3
  if (COMPOUND_V3_LENDERS.includes(lender)) {
    const comet = compoundV3Pools()[chainId][lender] as Address
    const base = compoundV3BaseData()[lender][chainId].baseAsset as Address
    return {
      lender,
      pool: comet,
      lenderTokens: {
        collateral: undefined,
        debt: undefined,
        stableDebt: undefined,
        base: base,
      },
      group: LenderGroups.CompoundV3,
    }
  }

  // check if the lender is morpho
  if (isMorphoType(lender)) {
    if (Object.keys(morphoPools()).includes(lender.toString())) {
      const lenderData = morphoPools()[lender]
      if (Object.keys(lenderData).includes(chainId.toString())) {
        const mb = lenderData[chainId]
        return {
          lender,
          pool: mb as Address,
          lenderTokens: undefined,
          group: LenderGroups.MorphoBlue,
        }
      }
    }
  }

  throw new Error('Unsupported lender')
}

const BALANCER_FORKS = Object.keys(BALANCER_V2_FORKS)

/**
 * Get the flash loan details from a provider on chain
 */
export function getFlashInfo(provider: FlashLoanProvider, chainId: ChainIdLike, composer: string): FlashInfo {
  // check if the lender is aave (all aave forks)
  if (AAVE_LENDERS.includes(provider as any)) {
    const pool = aavePools()?.[provider]?.[chainId].pool
    return {
      data: FLASH_LOAN_PROVIDERS[chainId][provider],
      // @ts-ignore
      poolType: AAVE_V2_LENDERS.includes(provider) ? FlashLoanIds.AAVE_V2 : FlashLoanIds.AAVE_V3,
      provider,
      providerAddress: pool,
      balanceHolder: composer,
    }
  }

  if (provider === FlashLoanProvider.MORPHO || provider === FlashLoanProvider.LISTA) {
    // @ts-ignore
    const pool = morphoPools?.[provider]?.[chainId]
    return {
      data: { id: 0, fee: 0n },
      poolType: FlashLoanIds.MORPHO,
      provider,
      providerAddress: pool,
      balanceHolder: composer,
    }
  }

  if (BALANCER_FORKS.includes(provider)) {
    const pool = BALANCER_V2_FORKS?.[provider]?.vault?.[chainId]
    return {
      data: { id: 0, fee: 0n },
      poolType: FlashLoanIds.BALANCER_V2,
      provider,
      providerAddress: pool,
      balanceHolder: pool,
    }
  }

  throw new Error('Unsupported flash source')
}

export function getAssetParamsFromAmount(amount: ShallowCurrencyAmount) {
  return {
    asset: amount.currency.address,
    rawAmount: amount.amount,
    chainId: amount.currency.chainId,
  }
}

export function getLenderIdFromLender(lender: Lender) {
  if (isAaveV3Type(lender)) return LenderIds.UP_TO_AAVE_V3 - 1
  if (isAaveV2Type(lender)) return LenderIds.UP_TO_AAVE_V2 - 1
  if (isCompoundV3(lender)) return LenderIds.UP_TO_COMPOUND_V3 - 1
  if (isCompoundV2(lender)) return LenderIds.UP_TO_COMPOUND_V2 - 1
  if (isMorphoType(lender)) return LenderIds.UP_TO_MORPHO - 1
  return LenderIds.UP_TO_SILO_V2 - 1
}

export function getLenderId(lender: LenderGroups) {
  switch (lender) {
    case LenderGroups.AaveV2:
      return LenderIds.UP_TO_AAVE_V2 - 1
    case LenderGroups.AaveV3:
      return LenderIds.UP_TO_AAVE_V3 - 1
    case LenderGroups.CompoundV2:
      return LenderIds.UP_TO_COMPOUND_V2 - 1
    case LenderGroups.CompoundV3:
      return LenderIds.UP_TO_COMPOUND_V3 - 1
    case LenderGroups.MorphoBlue:
      return LenderIds.UP_TO_MORPHO - 1
    case LenderGroups.SiloV2:
      return LenderIds.UP_TO_SILO_V2 - 1
    default:
      throw new Error('Unsupported lender')
  }
}

export function encodePermit(asset: string, permitId: PermitIds, permitData: Hex): Hex {
  return encodePacked(
    ['uint8', 'uint8', 'address', 'uint16', 'bytes'],
    [ComposerCommands.PERMIT, permitId, asset as Address, uint16(permitData.length / 2 - 1), permitData]
  )
}

/**
 * Packs sequence of commands into a singel compose instruction
 * @param commands compose commands bytes packed
 * @returns sequence of commands
 */
export function packCommands(commands: string[]): Hex {
  if (commands.length === 0) throw new Error('cannot pack no commands')
  if (commands.length === 1) return commands[0] as Hex
  return encodePacked(new Array(commands.length).fill('bytes'), commands)
}

export function adjustAmountForAll(amount: string | bigint, isAll: boolean | undefined) {
  if (isAll) return (BigInt(amount) * 100025n) / 100000n
  return BigInt(amount)
}

export function isAaveType(lender: LenderGroups): boolean {
  return lender === LenderGroups.AaveV2 || lender === LenderGroups.AaveV3
}

export function getPool(lenderData: LenderData) {
  switch (lenderData.group) {
    case LenderGroups.AaveV2:
    case LenderGroups.AaveV3:
    case LenderGroups.CompoundV3:
      return lenderData.pool
    case LenderGroups.CompoundV2:
      return lenderData.lenderTokens?.collateral
    default:
      return undefined // for morpho
  }
}

export function getCollateralToken(lenderData: LenderData) {
  switch (lenderData.group) {
    case LenderGroups.AaveV2:
    case LenderGroups.AaveV3:
    case LenderGroups.CompoundV2:
      return lenderData.lenderTokens?.collateral
    default:
      return undefined // for morpho and compoundV3
  }
}

export function getDebtToken(lenderData: LenderData) {
  switch (lenderData.group) {
    case LenderGroups.AaveV2:
    case LenderGroups.AaveV3:
      return lenderData.lenderTokens?.debt
    default:
      return undefined // for non-aave lenders
  }
}

export function getIsBaseToken(lenderData: LenderData, asset: string) {
  switch (lenderData.group) {
    case LenderGroups.CompoundV3:
      return asset === lenderData.lenderTokens?.base
    default:
      return undefined // for the rest of lenders
  }
}

export function getLenderGroup(lender: Lender) {
  if (isAaveV3Type(lender)) return LenderGroups.AaveV3
  if (isAaveV2Type(lender)) return LenderGroups.AaveV2
  if (isCompoundV3(lender)) return LenderGroups.CompoundV3
  if (isCompoundV2(lender)) return LenderGroups.CompoundV2
  if (isMorphoType(lender)) return LenderGroups.MorphoBlue
  return LenderGroups.SiloV2
}

export function isNativeAddress(a: string) {
  return a === zeroAddress
}
