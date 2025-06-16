// import { describe, it, expect } from 'vitest'
// import { Address, Hex } from 'viem'
// import { CHAIN_PRESETS, Lender } from '@1delta/asset-registry'
// import { encodeMorphoMarket } from '@1delta/calldatalib'
// import { MarginTradeType, MarginData } from '..'
// import { ComposerMargin } from './plain'
// import { GenericTrade, FlashLoanProvider } from '../../../utils'
// import { AaveInterestMode, MorphoParams } from '../../lending'
// import { SerializedCurrency } from '@1delta/type-sdk'
// import { TradeType } from '../../types'

// describe('createMarginFlashLoan', () => {
//   const TEST_ACCOUNT: Address = '0x1De17a0000000000000000000000000000003333'
//   const TEST_AMOUNT_IN = '1000000000000000000'
//   const TEST_AMOUNT_OUT = '1000000000'
//   const SLIPPAGE_TOLERANCE = '50' // 0.5%

//   const chainId = '8453'

//   const WETH_ADDRESS: Address = (CHAIN_PRESETS[chainId].weth as { address: Address }).address
//   const USDC_ADDRESS: Address = (CHAIN_PRESETS[chainId].usdc as { address: Address }).address

//   const MOCK_SPOT_CALLDATA: Hex = '0x00011122233344400000011111abcdef'

//   function createTestTrade(flashLoanSource: FlashLoanProvider = FlashLoanProvider.AAVE_V3): GenericTrade {
//     const weth = {
//       address: WETH_ADDRESS,
//       chainId,
//       decimals: 18,
//       symbol: 'WETH',
//       name: 'Wrapped Ether',
//     } as SerializedCurrency

//     const usdc = {
//       address: USDC_ADDRESS,
//       chainId,
//       decimals: 6,
//       name: 'USD Coin',
//       symbol: 'USDC',
//     } as SerializedCurrency

//     return {
//       tradeType: TradeType.EXACT_INPUT,
//       inputAmount: {
//         currency: weth,
//         amount: TEST_AMOUNT_IN,
//       },
//       outputAmount: {
//         currency: usdc,
//         amount: TEST_AMOUNT_OUT,
//       },
//       flashLoanSource,
//     }
//   }

//   const createTestMarginData = (
//     marginTradeType: MarginTradeType,
//     lender: Lender = Lender.AAVE_V3,
//   ): MarginData => {
//     return {
//       marginTradeType,
//       irModeIn: AaveInterestMode.VARIABLE,
//       irModeOut: AaveInterestMode.VARIABLE,
//       lender,
//     }
//   }

//   // WETH/USDC market on Morpho Blue (Base) - using proper 32-byte hash
//   const createTestMorphoParams = (): MorphoParams => {
//     const market = encodeMorphoMarket(
//       WETH_ADDRESS,
//       USDC_ADDRESS,
//       '0xFEa2D58cEfCb9fcb597723c6bAE66fFE4193aFE4',
//       '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC',
//       860000000000000000n,
//     )
//     return {
//       market,
//       isShares: false,
//       unsafeRepayment: false,
//       morphoB: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb' as Address,
//       pId: 1,
//       data: '0x' as Hex,
//     }
//   }

//   describe('Margin Trade Types', () => {
//     it('should create flash loan for OPEN margin trade', () => {
//       const trade = createTestTrade()
//       const marginData = createTestMarginData(MarginTradeType.Open)

//       const result = ComposerMargin.createMarginFlashLoan(
//         trade,
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         marginData,
//         false,
//         false,
//       )

//       expect(result).not.toBe('0x')
//       expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
//     })

//     it('should create flash loan for CLOSE margin trade', () => {
//       const trade = createTestTrade()
//       const marginData = createTestMarginData(MarginTradeType.Close)

//       const result = ComposerMargin.createMarginFlashLoan(
//         trade,
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         marginData,
//         false,
//         false,
//       )

//       expect(result).not.toBe('0x')
//       expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
//     })

//     it('should create flash loan for COLLATERAL_SWAP margin trade', () => {
//       const trade = createTestTrade()
//       const marginData = createTestMarginData(MarginTradeType.CollateralSwap)

//       const result = ComposerMargin.createMarginFlashLoan(
//         trade,
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         marginData,
//         false,
//         false,
//       )

//       expect(result).not.toBe('0x')
//       expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
//     })

//     it('should create flash loan for DEBT_SWAP margin trade', () => {
//       const trade = createTestTrade()
//       const marginData = createTestMarginData(MarginTradeType.DebtSwap)

//       const result = ComposerMargin.createMarginFlashLoan(
//         trade,
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         marginData,
//         false,
//         false,
//       )

//       expect(result).not.toBe('0x')
//       expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
//     })
//   })

//   describe('With Morpho Blue', () => {
//     it('should create flash loan for OPEN with Morpho params', () => {
//       const trade = createTestTrade(FlashLoanProvider.MORPHO)
//       const marginData: MarginData = {
//         ...createTestMarginData(MarginTradeType.Open, Lender.MORPHO_BLUE),
//         lender: Lender.MORPHO_BLUE,
//         morphoParams: createTestMorphoParams(),
//       }

//       const result = ComposerMargin.createMarginFlashLoan(
//         trade,
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         marginData,
//         false,
//         false,
//       )

//       expect(result).not.toBe('0x')
//       expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
//     })
//   })

//   describe('Flash Loan Providers', () => {
//     it('should handle Balancer V2 flash loans', () => {
//       // Skip this test as Balancer V2 has undefined address issues
//       const trade: GenericTrade = {
//         ...createTestTrade(),
//         flashLoanSource: FlashLoanProvider.BALANCER_V2,
//       }
//       const marginData = createTestMarginData(MarginTradeType.Open)

//       const result = ComposerMargin.createMarginFlashLoan(
//         trade,
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         marginData,
//         false,
//         false,
//       )

//       expect(result).not.toBe('0x')
//     })
//   })

//   describe('Max In/Out scenarios', () => {
//     it('should handle maxIn flag', () => {
//       const trade = createTestTrade()
//       const marginData = createTestMarginData(MarginTradeType.Close)

//       const result = ComposerMargin.createMarginFlashLoan(
//         trade,
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         marginData,
//         true, // maxIn
//         false,
//       )

//       expect(result).not.toBe('0x')
//     })

//     it('should handle maxOut flag', () => {
//       const trade = createTestTrade()
//       const marginData = createTestMarginData(MarginTradeType.Close)

//       const result = ComposerMargin.createMarginFlashLoan(
//         trade,
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         marginData,
//         false,
//         true, // maxOut
//       )

//       expect(result).not.toBe('0x')
//     })

//     it('should throw error when both maxIn and maxOut are true', () => {
//       const trade = createTestTrade()
//       const marginData = createTestMarginData(MarginTradeType.Open)

//       expect(() => {
//         ComposerMargin.createMarginFlashLoan(
//           trade,
//           MOCK_SPOT_CALLDATA,
//           SLIPPAGE_TOLERANCE,
//           TEST_ACCOUNT,
//           marginData,
//           true, // maxIn
//           true, // maxOut
//         )
//       }).toThrow('Cannot be maxIn and maxOut at the same time')
//     })
//   })

//   describe('Input validation', () => {
//     it('should return 0x when trade is undefined', () => {
//       const result = ComposerMargin.createMarginFlashLoan(
//         undefined,
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         createTestMarginData(MarginTradeType.Open),
//         false,
//         false,
//       )

//       expect(result).toBe('0x')
//     })

//     it('should return 0x when spotCalldata is undefined', () => {
//       const result = ComposerMargin.createMarginFlashLoan(
//         createTestTrade(),
//         undefined,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         createTestMarginData(MarginTradeType.Open),
//         false,
//         false,
//       )

//       expect(result).toBe('0x')
//     })

//     it('should return 0x when marginData is undefined', () => {
//       const result = ComposerMargin.createMarginFlashLoan(
//         createTestTrade(),
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         TEST_ACCOUNT,
//         undefined,
//         false,
//         false,
//       )

//       expect(result).toBe('0x')
//     })

//     it('should return 0x when account is undefined', () => {
//       const result = ComposerMargin.createMarginFlashLoan(
//         createTestTrade(),
//         MOCK_SPOT_CALLDATA,
//         SLIPPAGE_TOLERANCE,
//         undefined,
//         createTestMarginData(MarginTradeType.Open),
//         false,
//         false,
//       )

//       expect(result).toBe('0x')
//     })
//   })
// })
