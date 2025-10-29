import { Lender } from '@1delta/lender-registry'
import { Chain } from '@1delta/chain-registry'
import { FlashLoanIds } from '@1delta/calldatalib'
import { DexProtocol, FLASH_LOAN_IDS } from '@1delta/dex-registry'
import { ChainIdLike } from '@1delta/type-sdk'
import { Address, Hex } from 'viem'

export enum FlashLoanProvider {
  NONE = 'None',
  LENDLE = Lender.LENDLE,
  AAVE_V2 = Lender.AAVE_V2,
  AAVE_V3 = Lender.AAVE_V3,
  YLDR = Lender.YLDR,
  MORPHO = Lender.MORPHO_BLUE,
  LISTA = Lender.LISTA_DAO,
  AURELIUS = Lender.AURELIUS,
  BALANCER_V2 = DexProtocol.BALANCER_V2,
  BALANCER_V3 = DexProtocol.BALANCER_V3,
  UNISWAP_V4 = DexProtocol.UNISWAP_V4,
  AVALON = Lender.AVALON,
  MERIDIAN = Lender.MERIDIAN,
  TAKOTAKO = Lender.TAKOTAKO,
  GRANARY = Lender.GRANARY,
  ZEROLEND = Lender.ZEROLEND,
  LENDOS = Lender.LENDOS,
}

export const SingletonTypeFlashLoanProvider = [FlashLoanProvider.BALANCER_V3, FlashLoanProvider.UNISWAP_V4]

export const FLASH_LOAN_PROVIDERS: { [c: ChainIdLike]: { [l: string]: FlashLoanProviderData } } = {
  [Chain.MANTLE]: {
    [FlashLoanProvider.LENDLE]: { id: FLASH_LOAN_IDS[FlashLoanProvider.LENDLE], fee: 9n },
    [FlashLoanProvider.AURELIUS]: { id: FLASH_LOAN_IDS[FlashLoanProvider.AURELIUS], fee: 9n },
  },
  [Chain.POLYGON_MAINNET]: {
    [FlashLoanProvider.BALANCER_V2]: { id: FLASH_LOAN_IDS[FlashLoanProvider.BALANCER_V2], fee: 0n },
    [FlashLoanProvider.AAVE_V3]: { id: FLASH_LOAN_IDS[FlashLoanProvider.AAVE_V3], fee: 5n },
    [FlashLoanProvider.UNISWAP_V4]: { id: FLASH_LOAN_IDS[FlashLoanProvider.UNISWAP_V4], fee: 0n },
    [FlashLoanProvider.YLDR]: { id: FLASH_LOAN_IDS[FlashLoanProvider.YLDR], fee: 5n },
    // [FlashLoanProvider.AAVE_V2]: { id: FLASH_LOAN_IDS[FlashLoanProvider.AAVE_V2], fee: 9n }, // not useful since it is objectively worse than V3
  },
  [Chain.ARBITRUM_ONE]: {
    [FlashLoanProvider.BALANCER_V2]: { id: FLASH_LOAN_IDS[FlashLoanProvider.BALANCER_V2], fee: 0n },
    [FlashLoanProvider.BALANCER_V3]: { id: FLASH_LOAN_IDS[FlashLoanProvider.BALANCER_V3], fee: 0n },
    [FlashLoanProvider.AAVE_V3]: { id: FLASH_LOAN_IDS[FlashLoanProvider.AAVE_V3], fee: 5n },
    [FlashLoanProvider.UNISWAP_V4]: { id: FLASH_LOAN_IDS[FlashLoanProvider.UNISWAP_V4], fee: 0n },
  },
  [Chain.TAIKO_ALETHIA]: {
    [FlashLoanProvider.MERIDIAN]: { id: FLASH_LOAN_IDS[FlashLoanProvider.MERIDIAN], fee: 9n },
    [FlashLoanProvider.TAKOTAKO]: { id: FLASH_LOAN_IDS[FlashLoanProvider.TAKOTAKO], fee: 9n },
  },
  [Chain.BASE]: {
    [FlashLoanProvider.BALANCER_V2]: { id: FLASH_LOAN_IDS[FlashLoanProvider.BALANCER_V2], fee: 0n },
    [FlashLoanProvider.BALANCER_V3]: { id: FLASH_LOAN_IDS[FlashLoanProvider.BALANCER_V3], fee: 0n },
    [FlashLoanProvider.AAVE_V3]: { id: FLASH_LOAN_IDS[FlashLoanProvider.AAVE_V3], fee: 5n },
    [FlashLoanProvider.UNISWAP_V4]: { id: FLASH_LOAN_IDS[FlashLoanProvider.UNISWAP_V4], fee: 0n },
    [FlashLoanProvider.GRANARY]: { id: FLASH_LOAN_IDS[FlashLoanProvider.GRANARY], fee: 9n },
    [FlashLoanProvider.ZEROLEND]: { id: FLASH_LOAN_IDS[FlashLoanProvider.ZEROLEND], fee: 0n },
    [FlashLoanProvider.AVALON]: { id: FLASH_LOAN_IDS[FlashLoanProvider.AVALON], fee: 5n },
    [FlashLoanProvider.MORPHO]: { id: FLASH_LOAN_IDS[FlashLoanProvider.MORPHO], fee: 0n },
  },
  [Chain.OP_MAINNET]: {
    [FlashLoanProvider.BALANCER_V2]: { id: FLASH_LOAN_IDS[FlashLoanProvider.BALANCER_V2], fee: 0n },
    [FlashLoanProvider.BALANCER_V3]: { id: FLASH_LOAN_IDS[FlashLoanProvider.BALANCER_V3], fee: 0n },
    [FlashLoanProvider.AAVE_V3]: { id: FLASH_LOAN_IDS[FlashLoanProvider.AAVE_V3], fee: 5n },
    [FlashLoanProvider.UNISWAP_V4]: { id: FLASH_LOAN_IDS[FlashLoanProvider.UNISWAP_V4], fee: 0n },
    [FlashLoanProvider.MORPHO]: { id: FLASH_LOAN_IDS[FlashLoanProvider.MORPHO], fee: 0n },
    [FlashLoanProvider.GRANARY]: { id: FLASH_LOAN_IDS[FlashLoanProvider.GRANARY], fee: 9n },
  },
  [Chain.HEMI_NETWORK]: {
    [FlashLoanProvider.LENDOS]: { id: FLASH_LOAN_IDS[FlashLoanProvider.LENDOS], fee: 5n },
    [FlashLoanProvider.ZEROLEND]: { id: FLASH_LOAN_IDS[FlashLoanProvider.ZEROLEND], fee: 0n },
  },
}

export const DEFAULT_PROVIDER_PER_CHAIN = {
  [Chain.MANTLE]: FlashLoanProvider.LENDLE,
  [Chain.POLYGON_MAINNET]: FlashLoanProvider.BALANCER_V2,
  [Chain.TAIKO_ALETHIA]: FlashLoanProvider.MERIDIAN,
  [Chain.ARBITRUM_ONE]: FlashLoanProvider.BALANCER_V2,
  [Chain.OP_MAINNET]: FlashLoanProvider.MORPHO,
  [Chain.BASE]: FlashLoanProvider.MORPHO,
  [Chain.HEMI_NETWORK]: FlashLoanProvider.ZEROLEND,
}

export const FLASH_PROVIDERS_WITHOUT_FEE = [
  FlashLoanProvider.BALANCER_V2,
  FlashLoanProvider.MORPHO,
  FlashLoanProvider.BALANCER_V3,
  FlashLoanProvider.UNISWAP_V4,
]

/**
 * Context for parametrizing a flash loan margin trade
 */
export interface DebasedContractCallsContext {
  callIn: string[]
  callOut: string[]
  manualFlashLoanRepayTransfer: string
  cleanup: string
}

/**
 * Context for parametrizing a flash loan margin trade
 */
export interface ContractCallsContext {
  callIn: string
  callOut: string
  manualFlashLoanRepayTransfer: string
  cleanup: string
}

export interface FlashLoanProviderData {
  id: number
  fee: bigint
}

export interface SingletonTypeFlashLoanData {
  singleton: Address
  poolId: bigint
  receiver: Address
  type: 'Singleton'
}

export interface PoolTypeFlashLoanData {
  pool: Address | undefined
  poolType: FlashLoanIds | undefined
  flashloanId: number
  type: 'Pool'
}

interface GenericFlashLoanData {
  asset: Address
  amount: string
  data: Hex
}

export type FlashLoanData = GenericFlashLoanData & (PoolTypeFlashLoanData | SingletonTypeFlashLoanData)
