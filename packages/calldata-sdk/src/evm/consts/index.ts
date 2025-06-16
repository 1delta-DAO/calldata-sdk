import { DexProtocol, UNISWAP_V2_FORKS, UniV2ForkType } from '@1delta/dex-registry'

export * from './composer'

function createStableAndVol(f: string) {
  return [f + "_VOLATILE", f + "_STABLE"]
}

// get uni V2 forks per chain, expand for solidlies 
const ALL_V2_FORKS_PER_CHAIN: string[] = Object.entries(UNISWAP_V2_FORKS).map(a =>
  [
    UniV2ForkType.RamsesV1,
    UniV2ForkType.Solidly,
    UniV2ForkType.Camelot
  ].includes(a[1].forkType.default as any) ?
    createStableAndVol(a[0]) :
    [a[0]]
)
  .reduce((acc, b) => [...acc, ...b], [])


/** add uni V2 protocols to exotics */
export const PRE_FUNDABLE_DEXES = [
  ...ALL_V2_FORKS_PER_CHAIN,
  DexProtocol.WOO_FI,
  DexProtocol.DODO_V2,
  DexProtocol.GMX,
  DexProtocol.KTX,
  DexProtocol.MERCHANT_MOE_LB,
  DexProtocol.TRADER_JOE_LB_V2,
  DexProtocol.TRADER_JOE_LB_V21,
  DexProtocol.TRADER_JOE_LB_V22,
  DexProtocol.CURVE_NG,
]

export const NATIVE_SUPPORTING_PROTOCOLS = [DexProtocol.CURVE_STANDARD, DexProtocol.BALANCER_V3, DexProtocol.UNISWAP_V4]

export const BPS_BASE = 10000n
