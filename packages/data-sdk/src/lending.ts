import {
  AAVE_FORK_POOL_DATA,
  AAVE_STYLE_TOKENS,
  COMETS_PER_CHAIN_MAP,
  COMPOUND_BASE_TOKENS,
  COMPOUND_V2_COMPTROLLERS,
  COMPOUND_V2_STYLE_TOKENS,
  INIT_CONFIG_DATA,
  MORPHO_BLUE_POOL_DATA,
} from '@1delta/asset-registry'

// Global registry key - unique to avoid conflicts
const GLOBAL_DATA_KEY = '__1delta_data_registry__'

// Type definitions
type AaveTokensType = {
  [fork: string]: { [chainId: string]: { [underlying: string]: { aToken: string; sToken: string; vToken: string } } }
}

type AavePoolsType = {
  [fork: string]: {
    [chainId: string]: {
      pool: string
      protocolDataProvider: string
    }
  }
}

type CompoundV3PoolsType = { [chainId: string]: { [comet: string]: string } }

type MorphoPoolsType = { [fork: string]: { [chainId: string]: string } }

type CompoundV3BaseDataType = {
  [lender: string]: {
    [chainId: string]: {
      baseAsset: string
      baseBorrowMin: bigint
    }
  }
}

type CompoundV2PoolsType = { [fork: string]: { [chainId: string]: string } }

type CompoundV2TokensType = { [lender: string]: { [chainId: string]: { [address: string]: string } } }

type ModeEntry = { pool: string; underlying: string }
type PoolDatas = { [pool: string]: { underlying: string; modes: number[] } }
type ModeData = { [mode: number]: ModeEntry[] }

type InitConfigType = {
  [fork: string]: {
    [chainid: string]: {
      poolsToUnderlying: { [poolAddress: string]: string }
      modeData: ModeData
      poolData: PoolDatas
      reserves: string[]
    }
  }
}

interface GlobalDataRegistry {
  aaveTokens: AaveTokensType
  aavePools: AavePoolsType
  compoundV3Pools: CompoundV3PoolsType
  morphoPools: MorphoPoolsType
  compoundV3BaseData: CompoundV3BaseDataType
  compoundV2Pools: CompoundV2PoolsType
  compoundV2Tokens: CompoundV2TokensType
  initConfig: InitConfigType
}

// Initialize global registry with defaults
function getGlobalData(): GlobalDataRegistry {
  const global = globalThis as any

  if (!global[GLOBAL_DATA_KEY]) {
    global[GLOBAL_DATA_KEY] = {
      aaveTokens: AAVE_STYLE_TOKENS,
      aavePools: AAVE_FORK_POOL_DATA,
      compoundV3Pools: COMETS_PER_CHAIN_MAP,
      morphoPools: MORPHO_BLUE_POOL_DATA,
      compoundV3BaseData: COMPOUND_BASE_TOKENS,
      compoundV2Pools: COMPOUND_V2_COMPTROLLERS,
      compoundV2Tokens: COMPOUND_V2_STYLE_TOKENS,
      initConfig: INIT_CONFIG_DATA,
    }
  }

  return global[GLOBAL_DATA_KEY]
}

/** Override datas used in the SDK - works across all module instances */
export function initializeData({
  aaveTokensOverride,
  aavePoolsOverride,
  compoundV3PoolsOverride,
  compoundV3BaseDataOverride,
  morphoPoolsOverride,
  compoundV2TokensOverride,
  compoundV2PoolsOverride,
  initConfigOverride,
}: {
  aaveTokensOverride?: AaveTokensType
  aavePoolsOverride?: AavePoolsType
  compoundV3PoolsOverride?: CompoundV3PoolsType
  compoundV3BaseDataOverride?: CompoundV3BaseDataType
  morphoPoolsOverride?: MorphoPoolsType
  compoundV2TokensOverride?: CompoundV2TokensType
  compoundV2PoolsOverride?: CompoundV2PoolsType
  initConfigOverride?: InitConfigType
}) {
  const data = getGlobalData()

  if (aaveTokensOverride) data.aaveTokens = aaveTokensOverride
  if (aavePoolsOverride) data.aavePools = aavePoolsOverride
  if (compoundV3PoolsOverride) data.compoundV3Pools = compoundV3PoolsOverride
  if (morphoPoolsOverride) data.morphoPools = morphoPoolsOverride
  if (compoundV3BaseDataOverride) data.compoundV3BaseData = compoundV3BaseDataOverride
  if (compoundV2TokensOverride) data.compoundV2Tokens = compoundV2TokensOverride
  if (compoundV2PoolsOverride) data.compoundV2Pools = compoundV2PoolsOverride
  if (initConfigOverride) data.initConfig = initConfigOverride
}

// High-performance getters - minimal overhead with global access
export const aaveTokens = (): AaveTokensType => getGlobalData().aaveTokens
export const aavePools = (): AavePoolsType => getGlobalData().aavePools
export const compoundV3Pools = (): CompoundV3PoolsType => getGlobalData().compoundV3Pools
export const morphoPools = (): MorphoPoolsType => getGlobalData().morphoPools
export const compoundV3BaseData = (): CompoundV3BaseDataType => getGlobalData().compoundV3BaseData
export const compoundV2Pools = (): CompoundV2PoolsType => getGlobalData().compoundV2Pools
export const compoundV2Tokens = (): CompoundV2TokensType => getGlobalData().compoundV2Tokens
export const initConfig = (): InitConfigType => getGlobalData().initConfig
