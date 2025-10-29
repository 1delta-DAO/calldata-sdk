import { describe, expect, it } from 'vitest'
import { VenusMarginWrapperOperations } from '.'
import { parseUnits, zeroAddress } from 'viem'
import { WRAPPED_NATIVE_INFO } from '@1delta/wnative'
import { Chain } from '@1delta/chain-registry'
import { MarginTradeType } from '../types'

describe('venusWrappers', () => {
  describe('Margin Trade Native In', () => {
    it('open', () => {
      const result = VenusMarginWrapperOperations.venusMarignWrapper(testInputsOpen)
      //   console.log('result', result)
      expect(result).toBe(
        '0x4005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c6000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c0000000000000000000009184e72a00000dc004003bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c816ebc5cb8a5651c902cb06659907a93e574db0b010000000000000000000009184e72a00030000f9f000000000000000000000000000000000000000001000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e5a07c5b74c9b40447a954e1466938b865b6bbea3630010f9fbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000000000000000000009184e72a000816ebc5cb8a5651c902cb06659907a93e574db0b6bca74586218db34cdb402295796b79663d816e9'
      )
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('close', () => {
      const result = VenusMarginWrapperOperations.venusMarignWrapper(testInputsClose)
      //   console.log('result', result)
      expect(result).toBe(
        '0x4005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c6000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c0000000000000000000009184e72a0000106004005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c6bca74586218db34cdb402295796b79663d816e930020f9fbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000ffffffffffffffffffffffffffffbada9c382165b31419f4cc0edf0fa84f80a3c8e56bca74586218db34cdb402295796b79663d816e930030f9f00000000000000000000000000000000000000000000000000000000000009184e72a000816ebc5cb8a5651c902cb06659907a93e574db0ba07c5b74c9b40447a954e1466938b865b6bbea3640010000000000000000000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c010000000000000000000009184e72a0004001bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095cbada9c382165b31419f4cc0edf0fa84f80a3c8e50000000000000000000000000000000000'
      )
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('close maxIn', () => {
      const result = VenusMarginWrapperOperations.venusMarignWrapper({
        ...testInputsClose,
        maxIn: true,
        amount: parseUnits('0.0008', 18), // approx. the full balance
      })
      //   console.log('result', result)
      expect(result).toBe(
        '0x4005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c6000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c00000000000000000002d79883d200000106004005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c6bca74586218db34cdb402295796b79663d816e930020f9fbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000ffffffffffffffffffffffffffffbada9c382165b31419f4cc0edf0fa84f80a3c8e56bca74586218db34cdb402295796b79663d816e930030f9f00000000000000000000000000000000000000000000ffffffffffffffffffffffffffff816ebc5cb8a5651c902cb06659907a93e574db0ba07c5b74c9b40447a954e1466938b865b6bbea3640010000000000000000000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0100000000000000000002d79883d200004001bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095cbada9c382165b31419f4cc0edf0fa84f80a3c8e5000000000000000000000000000000000040010000000000000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e50000000000000000000000000000000000'
      )
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('collateralSwap', () => {
      const result = VenusMarginWrapperOperations.venusMarignWrapper(testInputsCSwap)
      //   console.log('result', result)
      expect(result).toBe(
        '0x4005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c6000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c0000000000000000000009184e72a0000106004005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c6bca74586218db34cdb402295796b79663d816e930000f9fbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c00000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e56bca74586218db34cdb402295796b79663d816e930030f9f00000000000000000000000000000000000000000000000000000000000009184e72a000816ebc5cb8a5651c902cb06659907a93e574db0ba07c5b74c9b40447a954e1466938b865b6bbea3640010000000000000000000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c010000000000000000000009184e72a000'
      )
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('collateralSwap maxIn', () => {
      const result = VenusMarginWrapperOperations.venusMarignWrapper({
        ...testInputsCSwap,
        maxIn: true,
        amount: parseUnits('0.0008', 18), // approx. the full balance
      })
      //   console.log('result', result)
      expect(result).toBe(
        '0x4005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c6000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c00000000000000000002d79883d200000106004005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c6bca74586218db34cdb402295796b79663d816e930000f9fbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c00000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e56bca74586218db34cdb402295796b79663d816e930030f9f00000000000000000000000000000000000000000000ffffffffffffffffffffffffffff816ebc5cb8a5651c902cb06659907a93e574db0ba07c5b74c9b40447a954e1466938b865b6bbea3640010000000000000000000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0100000000000000000002d79883d2000040010000000000000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e50000000000000000000000000000000000'
      )
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
    })
  })

  describe('Margin Trade wNative In', () => {
    it('close', () => {
      const result = VenusMarginWrapperOperations.venusMarignWrapper(testInputsCloseWNativeIn)
      //   console.log('result', result)
      expect(result).toBe(
        '0x4005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c6000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c0000000000000000000009184e72a00000dc004003bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c816ebc5cb8a5651c902cb06659907a93e574db0b010000000000000000000009184e72a00030020f9f00000000000000000000000000000000000000000000ffffffffffffffffffffffffffffbada9c382165b31419f4cc0edf0fa84f80a3c8e5a07c5b74c9b40447a954e1466938b865b6bbea3630030f9fbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000000000000000000009184e72a000816ebc5cb8a5651c902cb06659907a93e574db0b6bca74586218db34cdb402295796b79663d816e940010000000000000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e50000000000000000000000000000000000'
      )
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('close maxIn', () => {
      const result = VenusMarginWrapperOperations.venusMarignWrapper({
        ...testInputsCloseWNativeIn,
        maxIn: true,
        amount: parseUnits('0.0008', 18), // approx. the full balance
      })
      //   console.log('result', result)
      expect(result).toBe(
        '0x4005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c6000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c00000000000000000002d79883d2000000dc004003bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c816ebc5cb8a5651c902cb06659907a93e574db0b0100000000000000000002d79883d2000030020f9f00000000000000000000000000000000000000000000ffffffffffffffffffffffffffffbada9c382165b31419f4cc0edf0fa84f80a3c8e5a07c5b74c9b40447a954e1466938b865b6bbea3630030f9fbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000ffffffffffffffffffffffffffff816ebc5cb8a5651c902cb06659907a93e574db0b6bca74586218db34cdb402295796b79663d816e940010000000000000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e500000000000000000000000000000000004001bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095cbada9c382165b31419f4cc0edf0fa84f80a3c8e50000000000000000000000000000000000'
      )
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('collateralSwap', () => {
      const result = VenusMarginWrapperOperations.venusMarignWrapper(testInputsCSwapWNativeIn)
      //   console.log('result', result)
      expect(result).toBe(
        '0x4005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c6000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c0000000000000000000009184e72a00000dc004003bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c816ebc5cb8a5651c902cb06659907a93e574db0b010000000000000000000009184e72a00030000f9f000000000000000000000000000000000000000001000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e5a07c5b74c9b40447a954e1466938b865b6bbea3630030f9fbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000000000000000000009184e72a000816ebc5cb8a5651c902cb06659907a93e574db0b6bca74586218db34cdb402295796b79663d816e9'
      )
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('collateralSwap maxIn', () => {
      const result = VenusMarginWrapperOperations.venusMarignWrapper({
        ...testInputsCSwapWNativeIn,
        maxIn: true,
        amount: parseUnits('0.0008', 18), // approx. the full balance
      })
      //   console.log('result', result)
      expect(result).toBe(
        '0x4005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c6000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c00000000000000000002d79883d2000000dc004003bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c816ebc5cb8a5651c902cb06659907a93e574db0b0100000000000000000002d79883d2000030000f9f000000000000000000000000000000000000000001000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e5a07c5b74c9b40447a954e1466938b865b6bbea3630030f9fbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c0000ffffffffffffffffffffffffffff816ebc5cb8a5651c902cb06659907a93e574db0b6bca74586218db34cdb402295796b79663d816e94001bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095cbada9c382165b31419f4cc0edf0fa84f80a3c8e50000000000000000000000000000000000'
      )
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
    })

    it('debtSwap', () => {
      const result = VenusMarginWrapperOperations.venusMarignWrapper({
        ...testInputsDSwapWNativeIn,
        amount: parseUnits('0.0001001', 18), // approx. the full balance
      })
      //   console.log('result', result)
      expect(result).toBe(
        '0x4005bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c6000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c000000000000000000005b0a58f1280000dc004003bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c816ebc5cb8a5651c902cb06659907a93e574db0b01000000000000000000005b0a58f1280030020f9f00000000000000000000000000000000000000000000ffffffffffffffffffffffffffffbada9c382165b31419f4cc0edf0fa84f80a3c8e5a07c5b74c9b40447a954e1466938b865b6bbea3630010f9fbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c000000000000000000005b0a58f12800816ebc5cb8a5651c902cb06659907a93e574db0b6bca74586218db34cdb402295796b79663d816e940010000000000000000000000000000000000000000bada9c382165b31419f4cc0edf0fa84f80a3c8e50000000000000000000000000000000000'
      )
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
    })
  })
})

const chainId = Chain.BNB_SMART_CHAIN_MAINNET
const composerAddress = '0x816EBC5cb8A5651C902Cb06659907A93E574Db0B'
const callerAddress = '0xbadA9c382165b31419F4CC0eDf0Fa84f80A3C8E5'


const testInputsOpen = {
  assetIn: WRAPPED_NATIVE_INFO[chainId].address,
  assetOut: zeroAddress,
  //   maxIn?: boolean
  amount: parseUnits('0.00001', 18),
  operation: MarginTradeType.Open,
  composerAddress,
  callerAddress,
}

const testInputsClose = {
  assetIn: zeroAddress,
  assetOut: WRAPPED_NATIVE_INFO[chainId].address,
  //   maxIn?: boolean
  amount: parseUnits('0.00001', 18),
  operation: MarginTradeType.Close,
  composerAddress,
  callerAddress,
}

const testInputsCSwap = {
  assetIn: zeroAddress,
  assetOut: WRAPPED_NATIVE_INFO[chainId].address,
  //   maxIn?: boolean
  amount: parseUnits('0.00001', 18),
  operation: MarginTradeType.CollateralSwap,
  composerAddress,
  callerAddress,
}

const testInputsCloseWNativeIn = {
  assetIn: WRAPPED_NATIVE_INFO[chainId].address,
  assetOut: zeroAddress,
  //   maxIn?: boolean
  amount: parseUnits('0.00001', 18),
  operation: MarginTradeType.Close,
  composerAddress,
  callerAddress,
}

const testInputsCSwapWNativeIn = {
  assetIn: WRAPPED_NATIVE_INFO[chainId].address,
  assetOut: zeroAddress,
  //   maxIn?: boolean
  amount: parseUnits('0.00001', 18),
  operation: MarginTradeType.CollateralSwap,
  composerAddress,
  callerAddress,
}

const testInputsDSwapWNativeIn = {
  assetIn: WRAPPED_NATIVE_INFO[chainId].address,
  assetOut: zeroAddress,
  //   maxIn?: boolean
  amount: parseUnits('0.00001', 18),
  operation: MarginTradeType.DebtSwap,
  composerAddress,
  callerAddress,
}
