import { describe, expect, it } from "vitest"
import { createZapInMargin } from "../../.."

const testObj = {
  trade: {
    tradeType: 0,
    inputAmount: {
      currency: {
        chainId: '146',
        decimals: 18,
        name: 'Wrapped Sonic',
        address: '0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38',
        symbol: 'wS',
        logoURI: 'https://assets.coingecko.com/coins/images/52857/thumb/wrapped_sonic.png?1734536585',
        assetGroup: 'S',
        currencyId: 'Wrapped Sonic::wS',
        tags: [
          'coingecko',
          'wnative',
          'biconomy-gas-token',
          'debridge',
          'AAVE_V3',
          'AVALON_BEETS',
          'POLTER',
          'MAGSIN',
          'ENCLABS',
          'ENCLABS_LST',
        ],
        props: {
          wnative: true,
        },
      },
      amount: '7000000000000000000',
    },
    outputAmount: {
      currency: {
        chainId: '146',
        decimals: 18,
        name: 'Beets Staked Sonic',
        address: '0xe5da20f15420ad15de0fa650600afc998bbe3955',
        symbol: 'STS',
        logoURI: 'https://assets.coingecko.com/coins/images/52937/thumb/token-beets-staked-sonic.png?1734712659',
        assetGroup: 'Beets Staked Sonic::STS',
        currencyId: 'Beets Staked Sonic::STS',
        tags: ['coingecko', 'biconomy-gas-token', 'debridge', 'AAVE_V3', 'AVALON_BEETS', 'MAGSIN', 'ENCLABS'],
      },
      amount: '6857153250994680500',
    },
    aggregator: 'Paraswap',
    target: '0x6a000f20005980200259b80c5102003040001068',
    approvalTarget: '0x6a000f20005980200259b80c5102003040001068',
    stringified: '7000000000000000000-wS->6857153250994680500-STS-Paraswap',
    flashLoanSource: 'BALANCER_V3',
    inputAmountRealized: 7,
    outputAmountRealized: 6.85715325099468,
    slippage: 1,
  },
  account: '0xbadA9c382165b31419F4CC0eDf0Fa84f80A3C8E5',
  marginData: {
    irModeIn: 2,
    irModeOut: 0,
    marginTradeType: 'Open',
    permitData: {
      data: '0x0000000000000000000000000000000000000000000000004563918244f4000168d874a4ea2a8fa77dfda942e6833412715aaac2e8ecc4ae865d1a3489ef33d82e2752e7caa5464647429747c302980fb65b3342e90815bf6d33510dfefca031c3c39544',
      isPermit2: false,
    },
    lender: 'AVALON_BEETS',
  },
  composerOverride: '0x8E24CfC19c6C00c524353CB8816f5f1c2F33c201',
  flashInfoOverride: {
    data: {
      id: 0,
      fee: '0',
    },
    provider: 'BALANCER_V3',
    providerAddress: '0xbA1333333333a1BA1108E8412f11850A5C319bA9',
    poolType: 'SINGLETON',
  },
  userPayAmount: {
    currency: {
      name: 'Sonic',
      symbol: 'S',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      chainId: '146',
    },
    amount: '2000000000000000000',
  },
  externalCalls: [
    {
      callForwarder: '0xfCa11d8c816f8E52F55D5d9858dEEe78F152d903',
      calldata:
        '0xe3ead59e00000000000000000000000067dd00d00d000003a383b096091f0a3060000d08000000000000000000000000039e2fb66102314ce7b64ce5ce3e5183bc94ad38000000000000000000000000e5da20f15420ad15de0fa650600afc998bbe39550000000000000000000000000000000000000000000000006124fee993bc00000000000000000000000000000000000000000000000000005e35e31b02fe4eff0000000000000000000000000000000000000000000000005f29808d0ff3f2b40c3d362dcb1d4cc2becd8f8fb738eb5100000000000000000000000002e4124c0000000000000000000000008e24cfc19c6c00c524353cb8816f5f1c2f33c201c85f5d432b7fa25287c7e0cb88139a1a4c37f56510000000000000000000000f0000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000660000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000006600c2bc01d435cfeb2dc6ad7cec0e473e2dbabdd8700000120006400cf0000000b00000000000000000000000000000000000000000000000000000000b858183f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000000067dd00d00d000003a383b096091f0a3060000d080000000000000000000000000000000000000000000000006124fee993bc00000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002b039e2fb66102314ce7b64ce5ce3e5183bc94ad380001f429219dd400f2bf60e5a23d13be72b486d40388940000000000000000000000000000000000000000007761659f9e9834ad367e4d25e0306ba7a4968daf000002c001040244ff00000b00000000000000000000000000000000000000000000000000000000286f580d0000000000000000000000000000000000000000000000000000000000000080ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000029219dd400f2bf60e5a23d13be72b486d4038894000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000001980aa00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000f6f87073cf8929c206a77b0694619dc776f89885000000000000000000000000f6f87073cf8929c206a77b0694619dc776f898850000000000000000000000000000000000000000000000000000000000000001000000000000000000000000790fd3e9b42a3955cb1b286fbfa1ac67043a69ef000000000000000000000000592d1e187729c76efacc6dffb9355bd7bf47b2a70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000592d1e187729c76efacc6dffb9355bd7bf47b2a7000000000000000000000000d3dce716f3ef535c5ff8d041c1a41c3bd89b97ae00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000ba12222222228d8ba445958a75a0704d566bf2c8000001e001640000000000030000000000000000000000000000000000000000000000000000000052bbbe2900000000000000000000000000000000000000000000000000000000000000e000000000000000000000000067dd00d00d000003a383b096091f0a3060000d0800000000000000000000000000000000000000000000000000000000000000000000000000000000000000006a000f20005980200259b80c5102003040001068000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000068e1a11dbd4a2ecdcd7acb0d2b20744ac4cc1368dd8fdc410001000000000000000000a80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d3dce716f3ef535c5ff8d041c1a41c3bd89b97ae000000000000000000000000e5da20f15420ad15de0fa650600afc998bbe3955000000000000000000000000000000000000000000000000000000000019e19800000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000',
      target: '0x6a000f20005980200259b80c5102003040001068',
      value: '0',
    },
  ],
  trades: [
    {
      tradeType: 0,
      inputAmount: {
        currency: {
          chainId: '146',
          decimals: 18,
          name: 'Wrapped Sonic',
          address: '0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38',
          symbol: 'wS',
          logoURI: 'https://assets.coingecko.com/coins/images/52857/thumb/wrapped_sonic.png?1734536585',
          assetGroup: 'S',
          currencyId: 'Wrapped Sonic::wS',
          tags: [
            'coingecko',
            'wnative',
            'biconomy-gas-token',
            'debridge',
            'AAVE_V3',
            'AVALON_BEETS',
            'POLTER',
            'MAGSIN',
            'ENCLABS',
            'ENCLABS_LST',
          ],
          props: {
            wnative: true,
          },
        },
        amount: '7000000000000000000',
      },
      outputAmount: {
        currency: {
          chainId: '146',
          decimals: 18,
          name: 'Beets Staked Sonic',
          address: '0xe5da20f15420ad15de0fa650600afc998bbe3955',
          symbol: 'STS',
          logoURI: 'https://assets.coingecko.com/coins/images/52937/thumb/token-beets-staked-sonic.png?1734712659',
          assetGroup: 'Beets Staked Sonic::STS',
          currencyId: 'Beets Staked Sonic::STS',
          tags: ['coingecko', 'biconomy-gas-token', 'debridge', 'AAVE_V3', 'AVALON_BEETS', 'MAGSIN', 'ENCLABS'],
        },
        amount: '6857153250994680500',
      },
      aggregator: 'Paraswap',
      target: '0x6a000f20005980200259b80c5102003040001068',
      approvalTarget: '0x6a000f20005980200259b80c5102003040001068',
      stringified: '7000000000000000000-wS->6857153250994680500-STS-Paraswap',
      flashLoanSource: 'BALANCER_V3',
      inputAmountRealized: 7,
      outputAmountRealized: 6.85715325099468,
      slippage: 1,
    },
  ],
}

import { initializeChainData, initializeLenderData } from '@1delta/data-sdk'

const baseUrl = 'https://raw.githubusercontent.com/1delta-DAO/lender-metadata/multi-fetch'
const aavePools = baseUrl + '/config/aave-pools.json'
const aaveOracles = baseUrl + '/data/aave-oracles.json'
const morphoOracles = baseUrl + '/data/morpho-oracles.json'
const compoundV2Pools = baseUrl + '/config/compound-v2-pools.json'
const compoundV3Pools = baseUrl + '/config/compound-v3-pools.json'
// const initPools = baseUrl + '/config/init-pools.json'
const morphoPools = baseUrl + '/config/morpho-pools.json'

const aaveReserves = baseUrl + '/data/aave-reserves.json'
const compoundV2Reserves = baseUrl + '/data/compound-v2-reserves.json'
const compoundV3Reserves = baseUrl + '/data/compound-v3-reserves.json'
const initConfig = baseUrl + '/data/init-config.json'
const aaveTokens = baseUrl + '/data/aave-tokens.json'
const compoundV2CTokens = baseUrl + '/data/compound-v2-c-tokens.json'
const compoundV3Base = baseUrl + '/data/compound-v3-base-data.json'
const baseUrlChains = 'https://raw.githubusercontent.com/1delta-DAO/chains/main'

const chains = baseUrlChains + '/data.json'

function inititalizeAllData(params: any) {
  const { chainsOverride, ...lenderOverrides } = params

  initializeLenderData(lenderOverrides)

  initializeChainData({ chainsOverride })
}

async function fetchLenderMetaFromDirAndInitialize() {
  const params = await fetchLenderMetaFromDir()
  inititalizeAllData(params)
}

async function fetchLenderMetaFromDir() {
  const promises = [
    aavePools,
    compoundV2Pools,
    compoundV3Pools,
    // initPools,
    morphoPools,
    aaveReserves,
    compoundV2Reserves,
    compoundV3Reserves,
    initConfig,
    aaveTokens,
    compoundV2CTokens,
    compoundV3Base,
    aaveOracles,
    morphoOracles,
    chains,
  ].map(async (a) => fetch(a).then(async (b) => await b.json()))

  const [
    aavePoolsOverride,
    compoundV2PoolsOverride,
    compoundV3PoolsOverride,
    // initPoolsOverride,
    morphoPoolsOverride,
    aaveReservesOverride,
    compoundV2ReservesOverride,
    compoundV3ReservesOverride,
    initConfigOverride,
    aaveTokensOverride,
    compoundV2TokensOverride,
    compoundV3BaseDataOverride,
    aaveOraclesOverride,
    morphoOraclesOverride,
    chainsOverride,
  ] = await Promise.all(promises)

  return {
    aavePoolsOverride,
    compoundV2PoolsOverride,
    compoundV3PoolsOverride,
    // initPoolsOverride,
    morphoPoolsOverride,
    aaveReservesOverride,
    compoundV2ReservesOverride,
    compoundV3ReservesOverride,
    initConfigOverride,
    aaveTokensOverride,
    compoundV2TokensOverride,
    compoundV3BaseDataOverride,
    aaveOraclesOverride,
    morphoOraclesOverride,
    chainsOverride,
  }
}

await fetchLenderMetaFromDirAndInitialize()


describe('createMarginFlashLoan', () => {
  describe('Margin Trade Types', () => {
    it('should create flash loan for OPEN margin trade', () => {
      const result = createZapInMargin(testObj as any)
      expect(result).not.toBe('0x')
    })
  })

})