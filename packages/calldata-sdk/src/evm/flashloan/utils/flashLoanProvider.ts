import { AAVE_LENDERS, Lender, MORPHO_BLUE_LENDERS } from '@1delta/lender-registry'
import {
  DEFAULT_PROVIDER_PER_CHAIN,
  FLASH_LOAN_PROVIDERS,
  FLASH_PROVIDERS_WITHOUT_FEE,
  FlashLoanData,
  FlashLoanProvider,
  SingletonTypeFlashLoanProvider,
} from '../../../utils'
import { BPS } from '../consts'
import { getLenderAssets, isAave, isAaveV3Type } from './lenderUtils'
import { ChainIdLike } from '@1delta/type-sdk'
import {
  encodeBalancerV2FlashLoan,
  encodeBalancerV3FlashLoan,
  encodeFlashLoan,
  encodeUniswapV4FlashLoan,
} from '@1delta/calldatalib'
import { Address, Hex } from 'viem'
import { BALANCER_V2_FORKS, BALANCER_V3_FORKS, DexProtocol, UNISWAP_V4_FORKS } from '@1delta/dex-registry'

export function flashLoanIsFree(provider?: FlashLoanProvider) {
  return provider && FLASH_PROVIDERS_WITHOUT_FEE.includes(provider)
}

export function flashLoanIsFromLender(provider?: FlashLoanProvider) {
  return provider && Object.values(Lender).includes(provider as any)
}

/** Retrieve the flash laon provider and flash loan fee on given chain */
export function getFlashLoanProviderAndFeePerChain(
  chainId: ChainIdLike,
  preSelectedSource: FlashLoanProvider | undefined,
  lenderInQuestion: Lender,
  assetToFlash: string | undefined = undefined
) {
  const providers = FLASH_LOAN_PROVIDERS[chainId]

  if (preSelectedSource && flashLoanIsFree(preSelectedSource)) {
    return {
      flashLoanData: providers[preSelectedSource],
      flashLoanProvider: preSelectedSource,
    }
  }

  const defaultProvider = DEFAULT_PROVIDER_PER_CHAIN[chainId as keyof typeof DEFAULT_PROVIDER_PER_CHAIN]
  if (flashLoanIsFree(defaultProvider)) {
    if (isAaveV3Type(lenderInQuestion) && providers[lenderInQuestion]) {
      return {
        flashLoanData: providers[lenderInQuestion],
        flashLoanProvider: lenderInQuestion,
      }
    }

    // prefer aave V3 (if availabe)
    const aaveAssets = getLenderAssets(chainId, Lender.AAVE_V3)

    if (assetToFlash && aaveAssets.includes(assetToFlash)) {
      return {
        flashLoanData: providers[FlashLoanProvider.AAVE_V3],
        flashLoanProvider: FlashLoanProvider.AAVE_V3,
      }
    } else {
      // aave v2s can self-flash loan
      if (isAave(lenderInQuestion)) {
        return {
          flashLoanData: providers[lenderInQuestion],
          flashLoanProvider: lenderInQuestion,
        }
      }
    }
  }
  // go for plain default
  return {
    flashLoanData: providers[defaultProvider],
    flashLoanProvider: defaultProvider,
  }
}

/**
 * Adjust amount for flash loan fee (amount * (1 + fee))
 * @param amount bigint amount
 * @param provider flash pool
 * @returns adjusted amount
 */
export function adjustForFlashLoanFee(amount: string | bigint, fee: bigint | string) {
  if (BigInt(fee) === 0n) return amount.toString()
  return ((BigInt(amount) * (BigInt(fee) + BPS)) / BPS + 1n).toString()
}

const BALANCER_V2S = Object.keys(BALANCER_V2_FORKS)
const MORPHOS = MORPHO_BLUE_LENDERS

/**
 * Create calldata for supported flash loan providers
 * @param provider flash loan provider
 * @param data flash loan data
 * @returns flash loan calldata
 */
export function createFlashLoan(provider: FlashLoanProvider, data: FlashLoanData): Hex {
  if (provider === FlashLoanProvider.NONE) {
    throw new Error('No flash loan provider selected')
  }

  // encode singleton type flash loan providers
  if (SingletonTypeFlashLoanProvider.includes(provider) && data.type === 'Singleton') {
    switch (provider) {
      case FlashLoanProvider.BALANCER_V3:
        return encodeBalancerV3FlashLoan(
          data.singleton,
          data.poolId,
          data.asset,
          data.receiver,
          BigInt(data.amount),
          data.data
        )
      case FlashLoanProvider.UNISWAP_V4:
        return encodeUniswapV4FlashLoan(
          data.singleton,
          data.poolId,
          data.asset,
          data.receiver,
          BigInt(data.amount),
          data.data
        )
      default:
        throw new Error('Invalid singleton type flash loan provider')
    }
  }

  // encode pool type flash loan providers
  if (data.type === 'Pool') {
    if (BALANCER_V2S.includes(provider)) {
      return encodeBalancerV2FlashLoan(data.asset, BigInt(data.amount), data.flashloanId, data.data)
    }

    if (AAVE_LENDERS.includes(provider as any) && data.pool && data.poolType) {
      return encodeFlashLoan(data.asset, BigInt(data.amount), data.pool, data.poolType, data.flashloanId, data.data)
    }
    if (MORPHOS.includes(provider as any) && data.pool && data.poolType !== undefined) {
      return encodeFlashLoan(data.asset, BigInt(data.amount), data.pool, data.poolType, data.flashloanId, data.data)
    }
  }

  throw new Error(`Invalid flash loan provider: ${provider}`)
}

export function getFlashLoanType(provider: FlashLoanProvider) {
  if (SingletonTypeFlashLoanProvider.includes(provider)) {
    return 'Singleton'
  }
  return 'Pool'
}

export function getProviderAddressForSingletonType(provider: FlashLoanProvider, chainId: ChainIdLike) {
  switch (provider) {
    case FlashLoanProvider.BALANCER_V3:
      const b3 = BALANCER_V3_FORKS[DexProtocol.BALANCER_V3]
      return {
        singleton: b3.vault[chainId as keyof typeof b3.vault] as Address,
        poolId: BigInt(b3.forkId),
      }

    case FlashLoanProvider.UNISWAP_V4:
      const u4 = UNISWAP_V4_FORKS[DexProtocol.UNISWAP_V4]
      return {
        singleton: u4.pm[chainId as keyof typeof u4.pm] as Address,
        poolId: BigInt(u4.forkId),
      }
    default:
      throw new Error(`Invalid flash loan provider: ${provider}`)
  }
}
