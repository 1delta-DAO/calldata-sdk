import { TradeType } from '@1delta/base-sdk'
import { describe, it, expect } from 'vitest'
import { getFuelParametersExactInFromTrade } from './toParameters'
import { DIESEL_AMM_ID, MIRA_AMM_ID } from '../../constants'
import { SerializedTrade } from '@1delta/type-sdk'

describe('Fuel Encoding From Regular Trade', () => {
  describe('#encodeExactIn', () => {
    it('works with exact in trade', () => {
      const receiver = '0xeb4287b73f6f3374760be1389a5cf8868e607b2e4de90da6bfa9135c76974f61'
      // 0.3% slippage = 30 basis points
      const slippageToleranceBps = '30'

      const { path, inputAssets, inputContracts, variableOutputs } = getFuelParametersExactInFromTrade(
        TEST_TRADE_0.trade,
        receiver,
        slippageToleranceBps,
      )

      const [firstRoute, secondRoute] = path

      const firstSteps = firstRoute[3]
      const secondSteps = secondRoute[3]

      /** Path tests */

      expect(firstSteps.length).to.equal(2)
      expect(secondSteps.length).to.equal(1)

      expect(firstSteps[0].receiver.ContractId).to.be.toBeDefined()
      expect(firstSteps[0].receiver.Address).to.be.toBeUndefined()
      expect(firstSteps[0].receiver.ContractId?.bits).to.equal(MIRA_AMM_ID)

      expect(firstSteps[1].receiver.ContractId).to.be.toBeUndefined()
      expect(firstSteps[1].receiver.Address).to.be.toBeDefined()
      expect(firstSteps[1].receiver.Address?.bits).to.be.equal(receiver)

      expect(secondSteps[0].receiver.ContractId).to.be.toBeUndefined()
      expect(secondSteps[0].receiver.Address).to.be.toBeDefined()
      expect(secondSteps[0].receiver.Address?.bits).to.be.equal(receiver)

      /** UTXOS tests */

      expect(inputContracts.length).to.equal(3) // mira AMM, hook & logger
      expect(inputContracts[0]).to.equal(MIRA_AMM_ID)

      expect(variableOutputs).to.equal(2)

      expect(inputAssets.length).to.equal(1)
      expect(inputAssets[0].amount.toString()).to.equal(TEST_TRADE_0.trade.inputAmount.amount.toString())
    })
  })

  describe('#encodeExactIn', () => {
    it('works with exact in trade mixed', () => {
      const receiver = '0xeb4287b73f6f3374760be1389a5cf8868e607b2e4de90da6bfa9135c76974f61'
      // 0.3% slippage = 30 basis points
      const slippageToleranceBps = '30'

      const { path, inputAssets, inputContracts, variableOutputs } = getFuelParametersExactInFromTrade(
        TEST_TRADE_1.trade,
        receiver,
        slippageToleranceBps,
      )

      const [firstRoute, secondRoute] = path

      const firstSteps = firstRoute[3]
      const secondSteps = secondRoute[3]

      /** Path tests */

      expect(firstSteps.length).to.equal(2)
      expect(secondSteps.length).to.equal(3)

      expect(firstSteps[0].receiver.ContractId).to.be.toBeDefined()
      expect(firstSteps[0].receiver.Address).to.be.toBeUndefined()
      expect(firstSteps[0].receiver.ContractId?.bits).to.equal(MIRA_AMM_ID)

      expect(firstSteps[1].receiver.ContractId).to.be.toBeUndefined()
      expect(firstSteps[1].receiver.Address).to.be.toBeDefined()
      expect(firstSteps[1].receiver.Address?.bits).to.be.equal(receiver)

      expect(secondSteps[0].receiver.Address).to.be.toBeUndefined()
      expect(secondSteps[0].receiver.ContractId).to.be.toBeDefined()
      expect(secondSteps[0].receiver.ContractId?.bits).to.be.equal(DIESEL_AMM_ID)

      expect(secondSteps[1].receiver.Address).to.be.toBeUndefined()
      expect(secondSteps[1].receiver.ContractId).to.be.toBeDefined()
      expect(secondSteps[1].receiver.ContractId?.bits).to.be.equal(DIESEL_AMM_ID)



      expect(secondSteps[2].receiver.ContractId).to.be.toBeUndefined()
      expect(secondSteps[2].receiver.Address).to.be.toBeDefined()
      expect(secondSteps[2].receiver.Address?.bits).to.be.equal(receiver)

      /** UTXOS tests */

      expect(inputContracts.length).to.equal(4) // mira AMM, Diesel, hook & logger
      expect(inputContracts[0]).to.equal(MIRA_AMM_ID)
      expect(inputContracts[2]).to.equal(DIESEL_AMM_ID)

      expect(variableOutputs).to.equal(2)

      expect(inputAssets.length).to.equal(1)
      expect(inputAssets[0].amount.toString()).to.equal(TEST_TRADE_1.trade.inputAmount.amount.toString())
    })
  })

})

const TEST_TRADE_0: { trade: SerializedTrade, [k: string]: any } = {
  "blockNumber": "23252554",
  "amount": "1000000000",
  "amountDecimals": "1",
  "quote": "2623594914",
  "quoteDecimals": "2623.594914",
  "quoteGasAdjusted": "2623594914",
  "quoteGasAdjustedDecimals": "2623.594914",
  "gasPriceWei": "0",
  "trade": {
    "tradeType": 0,
    "inputAmount": {
      "currency": {
        "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
        "chainId": "fuel",
        "decimals": 9,
        "symbol": "ETH",
        "name": "Ethereum"
      },
      "amount": "1000000000"
    },
    "outputAmount": {
      "currency": {
        "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
        "chainId": "fuel",
        "decimals": 6,
        "symbol": "USDT",
        "name": "Tether USD"
      },
      "amount": "2623594914"
    },
    "swaps": [
      {
        "route": {
          "pools": [
            {
              "protocol": "MIRA_VOLATILE",
              "dexId": 1,
              "tokenIn": {
                "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
                "chainId": "fuel",
                "decimals": 9,
                "symbol": "ETH",
                "name": "Ethereum"
              },
              "tokenOut": {
                "address": "0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b",
                "chainId": "fuel",
                "decimals": 6,
                "symbol": "USDC",
                "name": "USD Coin"
              },
              "address": "0xeb4287b73f6f3374760be1389a5cf8868e607b2e4de90da6bfa9135c76974f61",
              "swapParams": {
                "dexId": 0,
                "data": [
                  "0",
                  "30",
                  "0"
                ],
                "forkId": "0"
              }
            },
            {
              "protocol": "MIRA_STABLE",
              "dexId": 1,
              "tokenIn": {
                "address": "0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b",
                "chainId": "fuel",
                "decimals": 6,
                "symbol": "USDC",
                "name": "USD Coin"
              },
              "tokenOut": {
                "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
                "chainId": "fuel",
                "decimals": 6,
                "symbol": "USDT",
                "name": "Tether USD"
              },
              "address": "0x5a5d495efc4a4a3bf2f0fda8ceb5453cf4630a407430df1c548d213dc58f31d1",
              "swapParams": {
                "dexId": 0,
                "data": [
                  "0",
                  "30",
                  "1"
                ],
                "forkId": "0"
              }
            }
          ],
          "path": [
            {
              "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
              "chainId": "fuel",
              "decimals": 9,
              "symbol": "ETH",
              "name": "Ethereum"
            },
            {
              "address": "0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b",
              "chainId": "fuel",
              "decimals": 6,
              "symbol": "USDC",
              "name": "USD Coin"
            },
            {
              "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
              "chainId": "fuel",
              "decimals": 6,
              "symbol": "USDT",
              "name": "Tether USD"
            }
          ]
        },
        "inputAmount": {
          "currency": {
            "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
            "chainId": "fuel",
            "decimals": 9,
            "symbol": "ETH",
            "name": "Ethereum"
          },
          "amount": "700000000"
        },
        "outputAmount": {
          "currency": {
            "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
            "chainId": "fuel",
            "decimals": 6,
            "symbol": "USDT",
            "name": "Tether USD"
          },
          "amount": "1836548520"
        }
      },
      {
        "route": {
          "pools": [
            {
              "protocol": "MIRA_VOLATILE",
              "dexId": 1,
              "tokenIn": {
                "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
                "chainId": "fuel",
                "decimals": 9,
                "symbol": "ETH",
                "name": "Ethereum"
              },
              "tokenOut": {
                "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
                "chainId": "fuel",
                "decimals": 6,
                "symbol": "USDT",
                "name": "Tether USD"
              },
              "address": "0x8236b995100eae8fe06100f78cd7349d2ed5fbdd35c7a51de2a15f70f661949f",
              "swapParams": {
                "dexId": 0,
                "data": [
                  "0",
                  "30",
                  "0"
                ],
                "forkId": "0"
              }
            }
          ],
          "path": [
            {
              "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
              "chainId": "fuel",
              "decimals": 9,
              "symbol": "ETH",
              "name": "Ethereum"
            },
            {
              "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
              "chainId": "fuel",
              "decimals": 6,
              "symbol": "USDT",
              "name": "Tether USD"
            }
          ]
        },
        "inputAmount": {
          "currency": {
            "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
            "chainId": "fuel",
            "decimals": 9,
            "symbol": "ETH",
            "name": "Ethereum"
          },
          "amount": "300000000"
        },
        "outputAmount": {
          "currency": {
            "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
            "chainId": "fuel",
            "decimals": 6,
            "symbol": "USDT",
            "name": "Tether USD"
          },
          "amount": "787046394"
        }
      }
    ]
  },
  "quoteId": "bdadf",
  "hitsCachedRoutes": false
}

const TEST_TRADE_1: { trade: SerializedTrade, [k: string]: any } = {
  "blockNumber": "23252707",
  "amount": "10000000",
  "amountDecimals": "10",
  "quote": "777406150601",
  "quoteDecimals": "777.406150601",
  "quoteGasAdjusted": "777406150601",
  "quoteGasAdjustedDecimals": "777.406150601",
  "gasPriceWei": "0",
  "trade": {
    "tradeType": 0,
    "inputAmount": {
      "currency": {
        "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
        "chainId": "fuel",
        "decimals": 6,
        "symbol": "USDT",
        "name": "Tether USD"
      },
      "amount": "10000000"
    },
    "outputAmount": {
      "currency": {
        "address": "0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82",
        "chainId": "fuel",
        "decimals": 9,
        "symbol": "FUEL",
        "name": "Fuel"
      },
      "amount": "777406150601"
    },
    "swaps": [
      {
        "route": {
          "pools": [
            {
              "protocol": "MIRA_VOLATILE",
              "dexId": 1,
              "tokenIn": {
                "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
                "chainId": "fuel",
                "decimals": 6,
                "symbol": "USDT",
                "name": "Tether USD"
              },
              "tokenOut": {
                "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
                "chainId": "fuel",
                "decimals": 9,
                "symbol": "ETH",
                "name": "Ethereum"
              },
              "address": "0x8236b995100eae8fe06100f78cd7349d2ed5fbdd35c7a51de2a15f70f661949f",
              "swapParams": {
                "dexId": 0,
                "data": [
                  "0",
                  "30",
                  "0"
                ],
                "forkId": "0"
              }
            },
            {
              "protocol": "MIRA_VOLATILE",
              "dexId": 1,
              "tokenIn": {
                "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
                "chainId": "fuel",
                "decimals": 9,
                "symbol": "ETH",
                "name": "Ethereum"
              },
              "tokenOut": {
                "address": "0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82",
                "chainId": "fuel",
                "decimals": 9,
                "symbol": "FUEL",
                "name": "Fuel"
              },
              "address": "0x98a7587d5dc27bd1eea624e8a403d8e1664a8d06f9b78e9b5476c2468a9c47da",
              "swapParams": {
                "dexId": 0,
                "data": [
                  "0",
                  "30",
                  "0"
                ],
                "forkId": "0"
              }
            }
          ],
          "path": [
            {
              "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
              "chainId": "fuel",
              "decimals": 6,
              "symbol": "USDT",
              "name": "Tether USD"
            },
            {
              "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
              "chainId": "fuel",
              "decimals": 9,
              "symbol": "ETH",
              "name": "Ethereum"
            },
            {
              "address": "0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82",
              "chainId": "fuel",
              "decimals": 9,
              "symbol": "FUEL",
              "name": "Fuel"
            }
          ]
        },
        "inputAmount": {
          "currency": {
            "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
            "chainId": "fuel",
            "decimals": 6,
            "symbol": "USDT",
            "name": "Tether USD"
          },
          "amount": "8000000"
        },
        "outputAmount": {
          "currency": {
            "address": "0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82",
            "chainId": "fuel",
            "decimals": 9,
            "symbol": "FUEL",
            "name": "Fuel"
          },
          "amount": "621520354501"
        }
      },
      {
        "route": {
          "pools": [
            {
              "protocol": "MIRA_STABLE",
              "dexId": 1,
              "tokenIn": {
                "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
                "chainId": "fuel",
                "decimals": 6,
                "symbol": "USDT",
                "name": "Tether USD"
              },
              "tokenOut": {
                "address": "0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b",
                "chainId": "fuel",
                "decimals": 6,
                "symbol": "USDC",
                "name": "USD Coin"
              },
              "address": "0x5a5d495efc4a4a3bf2f0fda8ceb5453cf4630a407430df1c548d213dc58f31d1",
              "swapParams": {
                "dexId": 0,
                "data": [
                  "0",
                  "30",
                  "1"
                ],
                "forkId": "0"
              }
            },
            {
              "protocol": "DIESEL_VOLATILE",
              "dexId": 1,
              "tokenIn": {
                "address": "0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b",
                "chainId": "fuel",
                "decimals": 6,
                "symbol": "USDC",
                "name": "USD Coin"
              },
              "tokenOut": {
                "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
                "chainId": "fuel",
                "decimals": 9,
                "symbol": "ETH",
                "name": "Ethereum"
              },
              "address": "0x9a0fce13339895f36e8e8a41d4d6959175bb51c3b38804cc9228eb562d514c0a",
              "swapParams": {
                "dexId": 0,
                "data": [
                  "0",
                  "30",
                  "0",
                  124,
                  41,
                  59,
                  5,
                  73,
                  56,
                  190,
                  220,
                  164,
                  19,
                  84,
                  32,
                  59,
                  228,
                  192,
                  138,
                  236,
                  44,
                  52,
                  102,
                  65,
                  44,
                  172,
                  128,
                  63,
                  74,
                  214,
                  42,
                  191,
                  34,
                  228,
                  118
                ],
                "forkId": "1"
              }
            },
            {
              "protocol": "DIESEL_VOLATILE",
              "dexId": 1,
              "tokenIn": {
                "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
                "chainId": "fuel",
                "decimals": 9,
                "symbol": "ETH",
                "name": "Ethereum"
              },
              "tokenOut": {
                "address": "0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82",
                "chainId": "fuel",
                "decimals": 9,
                "symbol": "FUEL",
                "name": "Fuel"
              },
              "address": "0x7a48fb08329ce8e75e46dc3d341e8182eb9b56478985459547f2698e73a7f0b2",
              "swapParams": {
                "dexId": 0,
                "data": [
                  "0",
                  "30",
                  "0",
                  124,
                  41,
                  59,
                  5,
                  73,
                  56,
                  190,
                  220,
                  164,
                  19,
                  84,
                  32,
                  59,
                  228,
                  192,
                  138,
                  236,
                  44,
                  52,
                  102,
                  65,
                  44,
                  172,
                  128,
                  63,
                  74,
                  214,
                  42,
                  191,
                  34,
                  228,
                  118
                ],
                "forkId": "1"
              }
            }
          ],
          "path": [
            {
              "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
              "chainId": "fuel",
              "decimals": 6,
              "symbol": "USDT",
              "name": "Tether USD"
            },
            {
              "address": "0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b",
              "chainId": "fuel",
              "decimals": 6,
              "symbol": "USDC",
              "name": "USD Coin"
            },
            {
              "address": "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
              "chainId": "fuel",
              "decimals": 9,
              "symbol": "ETH",
              "name": "Ethereum"
            },
            {
              "address": "0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82",
              "chainId": "fuel",
              "decimals": 9,
              "symbol": "FUEL",
              "name": "Fuel"
            }
          ]
        },
        "inputAmount": {
          "currency": {
            "address": "0xa0265fb5c32f6e8db3197af3c7eb05c48ae373605b8165b6f4a51c5b0ba4812e",
            "chainId": "fuel",
            "decimals": 6,
            "symbol": "USDT",
            "name": "Tether USD"
          },
          "amount": "2000000"
        },
        "outputAmount": {
          "currency": {
            "address": "0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82",
            "chainId": "fuel",
            "decimals": 9,
            "symbol": "FUEL",
            "name": "Fuel"
          },
          "amount": "155885796100"
        }
      }
    ]
  },
  "quoteId": "ab4f4",
  "hitsCachedRoutes": false
}

const args2 = {
  amount: '1000000', // 0.0001 ETH
  tokenInAddress: '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
  tokenInChainId: -1,
  tokenInDecimals: 9,
  tokenInSymbol: 'FUEL',
  tokenOutAddress: '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
  tokenOutChainId: -1,
  tokenOutDecimals: 9,
  tokenOutSymbol: 'ETH',
  routerPreference: 'none',
  tradeType: TradeType.EXACT_OUTPUT,
  flashSwap: false,
}
