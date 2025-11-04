import { describe, it, expect } from 'vitest'
import { ComposerDirectLending } from './index'
import { QuickActionType, LendingOperation, AaveInterestMode, MorphoParams } from '../types'
import { Address, Hex, zeroAddress } from 'viem'
import { SerializedCurrency } from '@1delta/type-sdk'
import { CurrencyUtils } from '../../../utils'
import { initializeChainData, initializeLenderData } from '@1delta/data-sdk'
import { AAVE_LENDERS, Lender } from '@1delta/lender-registry'

const baseUrl = 'https://raw.githubusercontent.com/1delta-DAO/lender-metadata/main'
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

describe('composeDirectMoneyMarketAction', async () => {
  const expectedDirectLendingOutputs = {
    deposit_aave_v3_usdt: {
      calldata:
        '0x4000c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca004005c2132d05d31c914a87c6611c10748aeb04b58e8f794a61358d6845594f94dc1db02a252b5b4814ad300003e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca001de17a0000000000000000000000000000003333794a61358d6845594f94dc1db02a252b5b4814ad' as Hex,
      value: undefined,
    },
    deposit_aave_v3_native: {
      calldata:
        '0x400100000000000000000000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700100000000000000000de0b6b3a764000040050d500b1d8e8ef31e21c99d1db9a6444d3adf1270794a61358d6845594f94dc1db02a252b5b4814ad300003e70d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000de0b6b3a76400001de17a0000000000000000000000000000003333794a61358d6845594f94dc1db02a252b5b4814ad' as Hex,
      value: '1000000000000000000',
    },
    withdraw_aave_v3_usdt: {
      calldata:
        '0x300303e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca002e234dae75c793f67a35089c9d99245e1c58470b6ab707aca953edaefbc4fd23ba73294241490620794a61358d6845594f94dc1db02a252b5b4814ad4001c2132d05d31c914a87c6611c10748aeb04b58e8f1de17a0000000000000000000000000000003333010000000000000000000000003b9aca00' as Hex,
      value: '0',
    },
    withdraw_aave_v3_native: {
      calldata:
        '0x300303e70d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000de0b6b3a76400001de17a00000000000000000000000000000033336d80113e533a2c0fe82eabd35f1875dcea89ea97794a61358d6845594f94dc1db02a252b5b4814ad40030d500b1d8e8ef31e21c99d1db9a6444d3adf12701de17a00000000000000000000000000000033330100000000000000000de0b6b3a7640000' as Hex,
      value: '0',
    },
    borrow_aave_v3_usdt: {
      calldata:
        '0x300103e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca002e234dae75c793f67a35089c9d99245e1c58470b02794a61358d6845594f94dc1db02a252b5b4814ad4001c2132d05d31c914a87c6611c10748aeb04b58e8f1de17a0000000000000000000000000000003333010000000000000000000000003b9aca00' as Hex,
      value: '0',
    },
    repay_aave_v3_usdt: {
      calldata:
        '0x4000c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca004005c2132d05d31c914a87c6611c10748aeb04b58e8f794a61358d6845594f94dc1db02a252b5b4814ad300203e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca001de17a000000000000000000000000000000333302fb00ac187a8eb5afae4eace434f493eb62672df7794a61358d6845594f94dc1db02a252b5b4814ad' as Hex,
      value: undefined,
    },
    repay_all_aave_v3_usdt: {
      calldata:
        '0x4000c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca004005c2132d05d31c914a87c6611c10748aeb04b58e8f794a61358d6845594f94dc1db02a252b5b4814ad300203e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca001de17a000000000000000000000000000000333302fb00ac187a8eb5afae4eace434f493eb62672df7794a61358d6845594f94dc1db02a252b5b4814ad4001c2132d05d31c914a87c6611c10748aeb04b58e8f1de17a00000000000000000000000000000033330000000000000000000000000000000000' as Hex,
      value: undefined,
    },
    deposit_compound_v2_usdt: {
      calldata:
        '0x4000c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca004005c2132d05d31c914a87c6611c10748aeb04b58e8f000000000000000000000000000000000000000030000f9fc2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca001de17a00000000000000000000000000000033330000000000000000000000000000000000000000' as Hex,
      value: undefined,
    },
    deposit_compound_v3_usdt: {
      calldata:
        '0x4000c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca004005c2132d05d31c914a87c6611c10748aeb04b58e8faeb318360f27748acb200ce616e389a6c9409a0730000bb7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca001de17a0000000000000000000000000000003333aeb318360f27748acb200ce616e389a6c9409a07' as Hex,
      value: undefined,
    },
    deposit_morpho_blue_usdt: {
      calldata:
        '0x4000c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca0040057506b33817b57f686e37b87b5d4c5c93fdef4cff1bf0c2541f820e775182832f06c0b7fc27a25f67300413887506b33817b57f686e37b87b5d4c5c93fdef4cffd21bbf9291f18b2f29ab05500000000000000000000000003b9aca001de17a00000000000000000000000000000033331bf0c2541f820e775182832f06c0b7fc27a25f670000' as Hex,
      value: undefined,
    },
  }

  const TEST_RECEIVER = '0x1De17a0000000000000000000000000000003333' as Address
  const TEST_COMPOSER = '0x2e234DAe75C793f67A35089C9d99245E1C58470b' as Address
  const TEST_AMOUNT = '1000000000'
  const TEST_AMOUNT_ETH = '1000000000000000000'
  const TEST_AMOUNT_ETH_SMALL = '100000000000000'
  const USDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' as Address
  const WETH = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619' as Address
  const WPOL = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' as Address
  const MORPHO_BLUE = '0x1bF0c2541F820E775182832f06c0B7Fc27A25f67' as Address
  const MORPHO_MARKET = '0x7506b33817b57f686e37b87b5d4c5c93fdef4cffd21bbf9291f18b2f29ab0550' as Hex

  /** Important: set lender data here */
  await fetchLenderMetaFromDirAndInitialize()

  const createTestTokens = async () => {
    const chainId = '137'
    return {
      usdt: {
        chainId: chainId,
        address: USDT,
        decimals: 6,
        symbol: 'USDT',
        name: 'USDT Coin',
      },
      weth: {
        chainId: chainId,
        address: WETH,
        decimals: 18,
        symbol: 'WETH',
        name: 'Wrapped Ether',
      },
      wpol: {
        chainId: chainId,
        address: WPOL,
        decimals: 18,
        symbol: 'WPOL',
        name: 'Wrapped Pol',
      },
      pol: {
        chainId: chainId,
        address: zeroAddress,
        decimals: 18,
        symbol: 'POL',
        name: 'Pol',
      },
      usdt_bnb: {
        chainId: '56',
        address: '0x55d398326f99059ff775485246999027b3197955',
        decimals: 18,
        symbol: 'USDT',
        name: 'USDT',
      },
      bnb: {
        chainId: '56',
        address: zeroAddress,
        decimals: 18,
        symbol: 'BNB',
        name: 'BNB',
      },
      wbnb: {
        chainId: '56',
        address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
        decimals: 18,
        symbol: 'USDT',
        name: 'USDT',
      },
    }
  }

  const createBaseLendingOperation = (
    actionType: QuickActionType,
    lender: Lender,
    amount: string,
    token: SerializedCurrency,
    overrides?: Partial<LendingOperation>
  ): LendingOperation => {
    return {
      params: {
        lender,
        amount: CurrencyUtils.fromRawAmount(token, amount),
        aaveBorrowMode: AAVE_LENDERS.includes(lender) ? AaveInterestMode.VARIABLE : undefined,
      },
      amount: BigInt(amount),
      actionType,
      lender,
      chainId: token.chainId,
      receiver: TEST_RECEIVER,
      callerAssetAddress: token.address,
      lenderAssetAddress: token.address,
      isAll: false,
      composerAddress: TEST_COMPOSER,
      morphoParams: undefined,
      ...overrides,
    }
  }

  // the market is WPOL/USDT on Morpho Blue
  const createMorphoParams = (): MorphoParams => ({
    market: MORPHO_MARKET,
    isShares: false,
    morphoB: MORPHO_BLUE,
    data: '0x',
    pId: 0,
    unsafeRepayment: false,
  })

  describe('Deposit operations', async () => {
    it('should create calldata for USDT deposit to Aave V3', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Deposit, Lender.AAVE_V3, TEST_AMOUNT, usdt)

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.value).toBeUndefined() // No ETH value for ERC20 deposit
      expect(result.calldata).toEqual(expectedDirectLendingOutputs.deposit_aave_v3_usdt.calldata)
    })

    it('should create calldata for native POL deposit to Aave V3', async () => {
      const { wpol, pol } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Deposit, Lender.AAVE_V3, TEST_AMOUNT_ETH, wpol, {
        lenderAssetAddress: wpol.address,
        callerAssetAddress: pol.address,
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.value).toBe(TEST_AMOUNT_ETH) // ETH value for native deposit
      expect(result.calldata).toEqual(expectedDirectLendingOutputs.deposit_aave_v3_native.calldata)
    })

    it('should create calldata for USDT deposit to Compound V2', async () => {
      const { usdt_bnb } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Deposit, Lender.VENUS, TEST_AMOUNT, usdt_bnb)

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x400055d398326f99059ff775485246999027b31979552e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca00400555d398326f99059ff775485246999027b3197955fd5840cd36d94d7229439859c0112a4185bc025530000f9f55d398326f99059ff775485246999027b31979550000000000000000000000003b9aca001de17a0000000000000000000000000000003333fd5840cd36d94d7229439859c0112a4185bc0255'
      )
      expect(result.value).toBeUndefined()
    })

    it('should create calldata for USDT deposit to Compound V3', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Deposit, Lender.COMPOUND_V3_USDT, TEST_AMOUNT, usdt)

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toMatch(
        '0x4000c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca004005c2132d05d31c914a87c6611c10748aeb04b58e8faeb318360f27748acb200ce616e389a6c9409a0730000bb7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca001de17a0000000000000000000000000000003333aeb318360f27748acb200ce616e389a6c9409a07'
      )
      expect(result.value).toBeUndefined()
    })

    it.skip('should create calldata for USDT deposit to Morpho Blue', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Deposit, Lender.MORPHO_BLUE, TEST_AMOUNT, usdt, {
        morphoParams: createMorphoParams(),
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toMatch(/^0x[0-9a-fA-F]+$/)
      expect(result.value).toBeUndefined()
    })

    it('should create calldata for deposit with Permit2', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Deposit, Lender.AAVE_V3, TEST_AMOUNT, usdt, {
        permitData: {
          isPermit2: true,
          data: '0x1234567890abcdef' as Hex,
        },
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x5000c2132d05d31c914a87c6611c10748aeb04b58e8f00081234567890abcdef4004c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca004005c2132d05d31c914a87c6611c10748aeb04b58e8f794a61358d6845594f94dc1db02a252b5b4814ad300003e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca001de17a0000000000000000000000000000003333794a61358d6845594f94dc1db02a252b5b4814ad'
      )
    })
  })

  describe('Withdrawal operations', async () => {
    it('should create calldata for USDT withdrawal from Aave V3', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Withdraw, Lender.AAVE_V3, TEST_AMOUNT, usdt)

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x300303e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca002e234dae75c793f67a35089c9d99245e1c58470b6ab707aca953edaefbc4fd23ba73294241490620794a61358d6845594f94dc1db02a252b5b4814ad4001c2132d05d31c914a87c6611c10748aeb04b58e8f1de17a0000000000000000000000000000003333010000000000000000000000003b9aca00'
      )
      expect(result.value).toBe('0') // NO_VALUE for withdrawals
    })

    it('should create calldata for native BNB withdrawal from Venus', async () => {
      const { bnb } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Withdraw, Lender.VENUS, TEST_AMOUNT_ETH_SMALL, bnb, {
        lenderAssetAddress: bnb.address,
        callerAssetAddress: bnb.address,
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x30030f9f0000000000000000000000000000000000000000000000000000000000005af3107a40002e234dae75c793f67a35089c9d99245e1c58470ba07c5b74c9b40447a954e1466938b865b6bbea36400100000000000000000000000000000000000000001de17a000000000000000000000000000000333301000000000000000000005af3107a4000'
      )
      expect(result.value).toBe('0')
    })

    it('should create calldata for native BNB withdrawal to WBNB from Venus', async () => {
      const { wbnb, bnb } = await createTestTokens()
      const operation = createBaseLendingOperation(
        QuickActionType.Withdraw,
        Lender.VENUS,
        TEST_AMOUNT_ETH_SMALL,
        wbnb,
        {
          lenderAssetAddress: bnb.address,
          callerAssetAddress: wbnb.address,
        }
      )

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x30030f9f0000000000000000000000000000000000000000000000000000000000005af3107a40002e234dae75c793f67a35089c9d99245e1c58470ba07c5b74c9b40447a954e1466938b865b6bbea3640010000000000000000000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c01000000000000000000005af3107a40004001bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c1de17a000000000000000000000000000000333301000000000000000000005af3107a4000'
      )
      expect(result.value).toBe('0')
    })

    it('should create calldata for USDT withdrawal from Venus', async () => {
      const { usdt_bnb } = await createTestTokens()
      const BNB_COMPOSER = '0x816EBC5cb8A5651C902Cb06659907A93E574Db0B' as Address
      const operation = createBaseLendingOperation(QuickActionType.Withdraw, Lender.VENUS, TEST_AMOUNT_ETH, usdt_bnb, {
        receiver: '0x77bD2F1cBcccdca1e63ca1B687E8b5d73710b0Ef' as Address,
        composerAddress: BNB_COMPOSER,
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)
      expect(result.calldata).toBe(
        '0x30030f9f55d398326f99059ff775485246999027b319795500000000000000000de0b6b3a7640000816ebc5cb8a5651c902cb06659907a93e574db0bfd5840cd36d94d7229439859c0112a4185bc0255400155d398326f99059ff775485246999027b319795577bd2f1cbcccdca1e63ca1b687e8b5d73710b0ef0100000000000000000de0b6b3a7640000'
      )
      expect(result.value).toBe('0')
    })

    it('should create calldata for USDT withdraw all from Venus', async () => {
      const { usdt_bnb } = await createTestTokens()
      const BNB_COMPOSER = '0x816EBC5cb8A5651C902Cb06659907A93E574Db0B' as Address
      const operation = createBaseLendingOperation(QuickActionType.Withdraw, Lender.VENUS, TEST_AMOUNT_ETH, usdt_bnb, {
        isAll: true,
        receiver: '0x77bD2F1cBcccdca1e63ca1B687E8b5d73710b0Ef' as Address,
        composerAddress: BNB_COMPOSER,
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x30030f9f55d398326f99059ff775485246999027b31979550000ffffffffffffffffffffffffffff816ebc5cb8a5651c902cb06659907a93e574db0bfd5840cd36d94d7229439859c0112a4185bc0255400155d398326f99059ff775485246999027b319795577bd2f1cbcccdca1e63ca1b687e8b5d73710b0ef0000000000000000000000000000000000'
      )
      expect(result.value).toBe('0')
    })

    it('should create calldata for native POL withdrawal from Aave V3', async () => {
      const { wpol, pol } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Withdraw, Lender.AAVE_V3, TEST_AMOUNT_ETH, wpol, {
        lenderAssetAddress: wpol.address,
        callerAssetAddress: pol.address,
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x300303e70d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000de0b6b3a76400002e234dae75c793f67a35089c9d99245e1c58470b6d80113e533a2c0fe82eabd35f1875dcea89ea97794a61358d6845594f94dc1db02a252b5b4814ad40030d500b1d8e8ef31e21c99d1db9a6444d3adf12701de17a00000000000000000000000000000033330100000000000000000de0b6b3a7640000'
      )
      expect(result.value).toBe('0')
    })

    it.skip('should create calldata for withdraw all from Compound V2', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Withdraw, Lender.OVIX, TEST_AMOUNT, usdt, {
        isAll: true,
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('should create calldata for withdrawal from Morpho Blue', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Withdraw, Lender.MORPHO_BLUE, TEST_AMOUNT, usdt, {
        morphoParams: createMorphoParams(),
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x300313877506b33817b57f686e37b87b5d4c5c93fdef4cffd21bbf9291f18b2f29ab05500000000000000000000000003b9aca002e234dae75c793f67a35089c9d99245e1c58470b1bf0c2541f820e775182832f06c0b7fc27a25f674001c2132d05d31c914a87c6611c10748aeb04b58e8f1de17a0000000000000000000000000000003333010000000000000000000000003b9aca00'
      )
    })
  })

  describe('Borrow operations', async () => {
    it('should create calldata for USDT borrow from Aave V3', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Borrow, Lender.AAVE_V3, TEST_AMOUNT, usdt)

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x300103e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca002e234dae75c793f67a35089c9d99245e1c58470b02794a61358d6845594f94dc1db02a252b5b4814ad4001c2132d05d31c914a87c6611c10748aeb04b58e8f1de17a0000000000000000000000000000003333010000000000000000000000003b9aca00'
      )
      expect(result.value).toBe('0')
    })

    it('should create calldata for native POL borrow from Aave V3', async () => {
      const { wpol, pol } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Borrow, Lender.AAVE_V3, TEST_AMOUNT_ETH, wpol, {
        lenderAssetAddress: wpol.address,
        callerAssetAddress: pol.address,
      })
      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x300103e70d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000de0b6b3a76400002e234dae75c793f67a35089c9d99245e1c58470b02794a61358d6845594f94dc1db02a252b5b4814ad40030d500b1d8e8ef31e21c99d1db9a6444d3adf12701de17a00000000000000000000000000000033330100000000000000000de0b6b3a7640000'
      )
    })

    it('should create calldata for stable rate borrow from Aave V3', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Borrow, Lender.AAVE_V3, TEST_AMOUNT, usdt, {
        params: {
          lender: Lender.AAVE_V3,
          amount: CurrencyUtils.fromRawAmount(usdt, TEST_AMOUNT),
          aaveBorrowMode: AaveInterestMode.STABLE,
        },
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x300103e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca002e234dae75c793f67a35089c9d99245e1c58470b01794a61358d6845594f94dc1db02a252b5b4814ad4001c2132d05d31c914a87c6611c10748aeb04b58e8f1de17a0000000000000000000000000000003333010000000000000000000000003b9aca00'
      )
    })

    it('should throw error for Aave borrow without mode', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Borrow, Lender.AAVE_V3, TEST_AMOUNT, usdt, {
        params: {
          lender: Lender.AAVE_V3,
          amount: CurrencyUtils.fromRawAmount(usdt, TEST_AMOUNT),
          // No aaveBorrowMode
        },
      })

      expect(() => {
        ComposerDirectLending.composeDirectMoneyMarketAction(operation)
      }).toThrow('Borrow mode is required for AaveV2/V3 borrows')
    })

    it('should create calldata for borrow from Compound V3', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Borrow, Lender.COMPOUND_V3_USDT, TEST_AMOUNT, usdt)

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x30010bb7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca002e234dae75c793f67a35089c9d99245e1c58470baeb318360f27748acb200ce616e389a6c9409a074001c2132d05d31c914a87c6611c10748aeb04b58e8f1de17a0000000000000000000000000000003333010000000000000000000000003b9aca00'
      )
    })

    it('should create calldata for borrow from Morpho Blue', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Borrow, Lender.MORPHO_BLUE, TEST_AMOUNT, usdt, {
        morphoParams: createMorphoParams(),
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x300113877506b33817b57f686e37b87b5d4c5c93fdef4cffd21bbf9291f18b2f29ab05500000000000000000000000003b9aca002e234dae75c793f67a35089c9d99245e1c58470b1bf0c2541f820e775182832f06c0b7fc27a25f674001c2132d05d31c914a87c6611c10748aeb04b58e8f1de17a0000000000000000000000000000003333010000000000000000000000003b9aca00'
      )
    })

    it('should create calldata for USDT borrow from Venus', async () => {
      const { usdt_bnb } = await createTestTokens()
      const BNB_COMPOSER = '0x816EBC5cb8A5651C902Cb06659907A93E574Db0B' as Address
      const operation = createBaseLendingOperation(QuickActionType.Borrow, Lender.VENUS, TEST_AMOUNT_ETH, usdt_bnb, {
        receiver: '0x77bD2F1cBcccdca1e63ca1B687E8b5d73710b0Ef' as Address,
        composerAddress: BNB_COMPOSER,
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x30010f9f55d398326f99059ff775485246999027b319795500000000000000000de0b6b3a7640000816ebc5cb8a5651c902cb06659907a93e574db0bfd5840cd36d94d7229439859c0112a4185bc0255400155d398326f99059ff775485246999027b319795577bd2f1cbcccdca1e63ca1b687e8b5d73710b0ef0100000000000000000de0b6b3a7640000'
      )
      expect(result.value).toBe('0')
    })
  })

  describe('Repay operations', async () => {
    it('should create calldata for USDT repay to Aave V3', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Repay, Lender.AAVE_V3, TEST_AMOUNT, usdt)

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x4000c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca004005c2132d05d31c914a87c6611c10748aeb04b58e8f794a61358d6845594f94dc1db02a252b5b4814ad300203e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca001de17a000000000000000000000000000000333302fb00ac187a8eb5afae4eace434f493eb62672df7794a61358d6845594f94dc1db02a252b5b4814ad'
      )
      expect(result.value).toBeUndefined() // No ETH value for ERC20 repay
    })

    it('should create calldata for native POL repay to Aave V3', async () => {
      const { wpol, pol } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Repay, Lender.AAVE_V3, TEST_AMOUNT_ETH, wpol, {
        callerAssetAddress: pol.address,
        lenderAssetAddress: wpol.address,
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x400100000000000000000000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700100000000000000000de0b6b3a764000040050d500b1d8e8ef31e21c99d1db9a6444d3adf1270794a61358d6845594f94dc1db02a252b5b4814ad300203e70d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000de0b6b3a76400001de17a0000000000000000000000000000003333024a1c3ad6ed28a636ee1751c69071f6be75deb8b8794a61358d6845594f94dc1db02a252b5b4814ad'
      )
      expect(result.value).toBe(TEST_AMOUNT_ETH) // ETH value for native repay
    })

    it('should create calldata for repay all to Aave V3', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Repay, Lender.AAVE_V3, TEST_AMOUNT, usdt, {
        isAll: true,
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x4000c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9e9a904005c2132d05d31c914a87c6611c10748aeb04b58e8f794a61358d6845594f94dc1db02a252b5b4814ad300203e7c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000003b9aca001de17a000000000000000000000000000000333302fb00ac187a8eb5afae4eace434f493eb62672df7794a61358d6845594f94dc1db02a252b5b4814ad4001c2132d05d31c914a87c6611c10748aeb04b58e8f1de17a00000000000000000000000000000033330000000000000000000000000000000000'
      )
    })

    it.skip('should create calldata for repay all to Compound V2', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Repay, Lender.OVIX, TEST_AMOUNT, usdt, {
        isAll: true,
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('should create calldata for repay to Morpho Blue', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Repay, Lender.MORPHO_BLUE, TEST_AMOUNT, usdt, {
        morphoParams: createMorphoParams(),
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x4000c2132d05d31c914a87c6611c10748aeb04b58e8f2e234dae75c793f67a35089c9d99245e1c58470b0000000000000000000000003b9aca0040057506b33817b57f686e37b87b5d4c5c93fdef4cff1bf0c2541f820e775182832f06c0b7fc27a25f67300213877506b33817b57f686e37b87b5d4c5c93fdef4cffd21bbf9291f18b2f29ab05500000000000000000000000003b9aca001de17a00000000000000000000000000000033331bf0c2541f820e775182832f06c0b7fc27a25f670000'
      )
    })

    it('should create calldata for repay with Permit2', async () => {
      const { usdt } = await createTestTokens()
      const operation = createBaseLendingOperation(QuickActionType.Repay, Lender.AAVE_V3, TEST_AMOUNT, usdt, {
        permitData: {
          isPermit2: true,
          data: '0x1234567890abcdef' as Hex,
        },
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('should create calldata for depo to Moonwell', async () => {
      const MoonwellParams = {
        actionType: 'Deposit',
        chainId: '10',
        params: {
          lender: 'MOONWELL',
          aaveBorrowMode: 0,
        },
        lender: 'MOONWELL',
        amount: '635745156220629',
        isAll: false,
        receiver: '0xbadA9c382165b31419F4CC0eDf0Fa84f80A3C8E5',
        lenderAssetAddress: '0x4200000000000000000000000000000000000006',
        callerAssetAddress: '0x0000000000000000000000000000000000000000',
        composerAddress: '0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72',
      }

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(MoonwellParams as any)

      expect(result.calldata).toBe(
        '0x40010000000000000000000000000000000000000000420000000000000000000000000000000000000601000000000000000000024234f43446d540054200000000000000000000000000000000000006b4104c02bbf4e9be85aaa41a62974e4e28d59a3330000f9f4200000000000000000000000000000000000006010000000000000000024234f43446d5bada9c382165b31419f4cc0edf0fa84f80a3c8e5b4104c02bbf4e9be85aaa41a62974e4e28d59a33'
      )
    })

    it('should create calldata for withdrawal wnative->native from Moonwell', async () => {
      const MoonwellParams = {
        actionType: 'Withdraw',
        chainId: '10',
        params: {
          lender: 'MOONWELL',
          aaveBorrowMode: 0,
        },
        lender: 'MOONWELL',
        amount: '635745156220629',
        isAll: true,
        receiver: '0xbadA9c382165b31419F4CC0eDf0Fa84f80A3C8E5',
        lenderAssetAddress: '0x4200000000000000000000000000000000000006',
        callerAssetAddress: '0x0000000000000000000000000000000000000000',
        composerAddress: '0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72',
      }

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(MoonwellParams as any)
      expect(result.calldata).toBe(
        '0x30030f9f42000000000000000000000000000000000000060000ffffffffffffffffffffffffffffcdef0a216fcef809258aa4f341db1a5ab296ea72b4104c02bbf4e9be85aaa41a62974e4e28d59a3340010000000000000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e50000000000000000000000000000000000'
      )
    })

    it('should create calldata for USDT repay to Venus', async () => {
      const { usdt_bnb } = await createTestTokens()
      const BNB_COMPOSER = '0x816EBC5cb8A5651C902Cb06659907A93E574Db0B' as Address
      const repayAmount = '500000000000000000'
      const operation = createBaseLendingOperation(QuickActionType.Repay, Lender.VENUS, repayAmount, usdt_bnb, {
        receiver: '0x77bD2F1cBcccdca1e63ca1B687E8b5d73710b0Ef' as Address,
        composerAddress: BNB_COMPOSER,
        permitData: {
          isPermit2: true,
          data: '0x00000000000000000000000006f05b59d3b200006909bd5f000000026909bd5febef5bc6c23450a8a43b01724b8641158911946e61e4772990f3b82f77ce775cf4a2e0b80320005c45af55dc81dfc650fea8894300dd9566944346ce39831415' as Hex,
        },
      })

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x500055d398326f99059ff775485246999027b3197955006000000000000000000000000006f05b59d3b200006909bd5f000000026909bd5febef5bc6c23450a8a43b01724b8641158911946e61e4772990f3b82f77ce775cf4a2e0b80320005c45af55dc81dfc650fea8894300dd9566944346ce39831415400455d398326f99059ff775485246999027b3197955816ebc5cb8a5651c902cb06659907a93e574db0b000000000000000006f05b59d3b20000400555d398326f99059ff775485246999027b3197955fd5840cd36d94d7229439859c0112a4185bc025530020f9f55d398326f99059ff775485246999027b3197955000000000000000006f05b59d3b2000077bd2f1cbcccdca1e63ca1b687e8b5d73710b0effd5840cd36d94d7229439859c0112a4185bc0255'
      )
      expect(result.value).toBeUndefined()
    })

    it('should create calldata for USDT repay all to Venus', async () => {
      const { usdt_bnb } = await createTestTokens()
      const BNB_COMPOSER = '0x816EBC5cb8A5651C902Cb06659907A93E574Db0B' as Address

      const operation = createBaseLendingOperation(
        QuickActionType.Repay,
        Lender.VENUS,
        '1500001419090410071',
        usdt_bnb,
        {
          isAll: true,
          receiver: '0x77bD2F1cBcccdca1e63ca1B687E8b5d73710b0Ef' as Address,
          composerAddress: BNB_COMPOSER,
          permitData: {
            isPermit2: true,
            data: '0x00000000000000000000000014ebb88f5e33fbe96909b8eb000000016909b8eb311c91add552ef9516e623f508ef14abec962e05c26801ab8f95ce76f717d0f4d5a6707d921d8d24e0b3203d716e9098b4cc8bec2c9378f27ab7055492c84d70' as Hex,
          },
        }
      )

      const result = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

      expect(result.calldata).toBe(
        '0x500055d398326f99059ff775485246999027b3197955006000000000000000000000000014ebb88f5e33fbe96909b8eb000000016909b8eb311c91add552ef9516e623f508ef14abec962e05c26801ab8f95ce76f717d0f4d5a6707d921d8d24e0b3203d716e9098b4cc8bec2c9378f27ab7055492c84d70400455d398326f99059ff775485246999027b3197955816ebc5cb8a5651c902cb06659907a93e574db0b000000000000000014d26867766710d1400555d398326f99059ff775485246999027b3197955fd5840cd36d94d7229439859c0112a4185bc025530020f9f55d398326f99059ff775485246999027b31979550000ffffffffffffffffffffffffffff77bd2f1cbcccdca1e63ca1b687e8b5d73710b0effd5840cd36d94d7229439859c0112a4185bc0255400155d398326f99059ff775485246999027b319795577bd2f1cbcccdca1e63ca1b687e8b5d73710b0ef0000000000000000000000000000000000'
      )
      expect(result.value).toBeUndefined()
    })
  })

  describe('Input validation', async () => {
    it('should throw error when no amount is provided', async () => {
      const operation = {
        params: {
          lender: Lender.AAVE_V3,
          amount: undefined as any,
        },
        actionType: QuickActionType.Deposit,
        receiver: TEST_RECEIVER,
        isAll: false,
        inIsNative: false,
        composerAddress: TEST_COMPOSER,
        callerAssetAddress: '',
        lenderAssetAddress: '',
        morphoParams: undefined,
      }

      expect(() => {
        ComposerDirectLending.composeDirectMoneyMarketAction(operation as any)
      }).toThrow('No amount is provided')
    })
  })
})
