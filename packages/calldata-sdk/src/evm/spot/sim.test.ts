import { describe, expect, it } from 'vitest'
import { Address } from 'viem'
import { ComposerSpot } from './index'

describe('Sim Tests - Metis', () => {
    // arbitrum quoter
    const slippageTolerance = '500' // 5%

    it(
        'Tests native',
        async () => {
            const callerAndReceiver = '0x91ae002a960e63Ccb0E5bDE83A8C13E51e1cB91A' as Address
            const composerAddress = "0xCe434378adacC51d54312c872113D687Ac19B516"
            const { calldata, value } = ComposerSpot.composeSpotCalldata({
                // @ts-ignore
                trade: METIS_TRADE,
                slippageTolerance,
                receiver: callerAndReceiver,
                composer: composerAddress
            })
            expect(calldata).to.equal("0x100000000000000000016345785d8a0000000000000000000000000000001aad6a00000000000000000000000000000000000000000100000075cb093e4d61d2a2e65d8e0bbb01de8d89b53481ce434378adacc51d54312c872113d687ac19b516fe000201000000420000000000000000000000000000000000000aeffec28996aaff6d55b6d108a46446d45c3a2e7100df99c7073c7685192db6cbbf69732bee3354e1170f0bb800010000ea32a96608495e54156ae48931a7c20f0dcc1a2191ae002a960e63ccb0e5bde83a8c13e51e1cb91a01effec28996aaff6d55b6d108a46446d45c3a2e7126f2880002")
        },
        { timeout: 25000 },
    )

    it(
        'Tests fot',
        async () => {
            const callerAndReceiver = '0x91ae002a960e63Ccb0E5bDE83A8C13E51e1cB91A' as Address
            const composerAddress = "0xCe434378adacC51d54312c872113D687Ac19B516"
            const { calldata, value } = ComposerSpot.composeSpotCalldata({
                // @ts-ignore
                trade: FOT_TRADE,
                slippageTolerance,
                receiver: callerAndReceiver,
                composer: composerAddress,
                fotInput: true
            })
            console.log("calldata", calldata)
            // expect(calldata).to.equal("0x100000000000000000016345785d8a0000000000000000000000000000001aad6a00000000000000000000000000000000000000000100000075cb093e4d61d2a2e65d8e0bbb01de8d89b53481ce434378adacc51d54312c872113d687ac19b516fe000201000000420000000000000000000000000000000000000aeffec28996aaff6d55b6d108a46446d45c3a2e7100df99c7073c7685192db6cbbf69732bee3354e1170f0bb800010000ea32a96608495e54156ae48931a7c20f0dcc1a2191ae002a960e63ccb0e5bde83a8c13e51e1cb91a01effec28996aaff6d55b6d108a46446d45c3a2e7126f2880002")
        },
        { timeout: 25000 },
    )


    it(
        'Tests single',
        async () => {
            // @ts-ignore
            const { calldata, value } = ComposerSpot.composeSpotCalldata(SINGLE_ROUTE)
            console.log("calldata", calldata)
            expect(calldata).to.equal("0x10000000000000000000071afd498d0000000000000000000000000000003cc106000000000000000000000000000000000000000001000000a51894664a773981c6c112c43ce576f315d5b1b6594ce4b82a81930cc637f1a59afdfb0d70054232fe0002000007d83526730c7438048d55a4fc0b850e2aab6f0b91ae002a960e63ccb0e5bde83a8c13e51e1cb91aa0ef4a016f3e54c4520220ade7a496842ecbf83e0901")
        },
        { timeout: 25000 },
    )
})

const TEST_TRADE = {
    "tradeType": 0,
    "inputAmount": {
        "currency": {
            "address": "0x0000000000000000000000000000000000000000",
            "chainId": "42161",
            "decimals": 18,
            "symbol": "ETH",
            "name": "Ether"
        },
        "amount": "200000000000000"
    },
    "outputAmount": {
        "currency": {
            "address": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
            "chainId": "42161",
            "decimals": 6,
            "symbol": "USDC",
            "name": "USD Coin"
        },
        "amount": "545966"
    },
    "swaps": [
        {
            "route": {
                "pools": [
                    {
                        "protocol": "CAMELOT",
                        "dexId": 0,
                        "tokenIn": {
                            "address": "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
                            "chainId": "42161",
                            "decimals": 18,
                            "symbol": "WETH",
                            "name": "Wrapped Ether"
                        },
                        "tokenOut": {
                            "address": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                            "chainId": "42161",
                            "decimals": 6,
                            "symbol": "USD Coin",
                            "name": "USDC"
                        },
                        "address": "0xB1026b8e7276e7AC75410F1fcbbe21796e8f7526",
                        "swapParams": {
                            "dexId": 0,
                            "forkId": 3,
                            "fee": 80,
                            "pool": "0xB1026b8e7276e7AC75410F1fcbbe21796e8f7526"
                        }
                    }
                ],
                "path": [
                    {
                        "address": "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
                        "chainId": "42161",
                        "decimals": 18,
                        "symbol": "WETH",
                        "name": "Wrapped Ether"
                    },
                    {
                        "address": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                        "chainId": "42161",
                        "decimals": 6,
                        "symbol": "USD Coin",
                        "name": "USDC"
                    }
                ]
            },
            "inputAmount": {
                "currency": {
                    "address": "0x0000000000000000000000000000000000000000",
                    "chainId": "42161",
                    "decimals": 18,
                    "symbol": "ETH",
                    "name": "Ether"
                },
                "amount": "200000000000000"
            },
            "outputAmount": {
                "currency": {
                    "address": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                    "chainId": "42161",
                    "decimals": 6,
                    "symbol": "USDC",
                    "name": "USD Coin"
                },
                "amount": "545966"
            }
        }
    ]
}


const PERMIT_1 = {
    "permitValue": "106819",
    "permitSignature": "0xf02eb104be450392ba7ab9fe7e70d6444f1d041f1eb146df716ace8029ce1cee0153d1a6454b61c7f65967d63f9d5e6d79747e636541ecca19c0f92b11770cc01b",
    "permitCall": "0x000000000000000000000000000000000000000000000000000000000001a143683835daf02eb104be450392ba7ab9fe7e70d6444f1d041f1eb146df716ace8029ce1cee0153d1a6454b61c7f65967d63f9d5e6d79747e636541ecca19c0f92b11770cc0",
    "permitType": 1,
    "permitNonce": 15,
    "permitDeadline": 1748514265
}

const TEST_TRADE_1 = {
    "tradeType": 0,
    "inputAmount": {
        "currency": {
            "address": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
            "chainId": "42161",
            "decimals": 6,
            "symbol": "USDC",
            "name": "USD Coin"
        },
        "amount": "106819"
    },
    "outputAmount": {
        "currency": {
            "address": "0x0000000000000000000000000000000000000000",
            "chainId": "42161",
            "decimals": 18,
            "symbol": "ETH",
            "name": "Ether"
        },
        "amount": "39087912992946"
    },
    "swaps": [
        {
            "route": {
                "pools": [
                    {
                        "protocol": "PANCAKESWAP_V3",
                        "dexId": 0,
                        "tokenIn": {
                            "address": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                            "chainId": "42161",
                            "decimals": 6,
                            "symbol": "USD Coin",
                            "name": "USDC"
                        },
                        "tokenOut": {
                            "address": "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
                            "chainId": "42161",
                            "decimals": 18,
                            "symbol": "WETH",
                            "name": "Wrapped Ether"
                        },
                        "address": "0xd9e2a1a61B6E61b275cEc326465d417e52C1b95c",
                        "swapParams": {
                            "dexId": 0,
                            "forkId": 0,
                            "fee": 500,
                            "pool": "0xd9e2a1a61B6E61b275cEc326465d417e52C1b95c"
                        }
                    }
                ],
                "path": [
                    {
                        "address": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                        "chainId": "42161",
                        "decimals": 6,
                        "symbol": "USDC",
                        "name": "USD Coin"
                    },
                    {
                        "address": "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
                        "chainId": "42161",
                        "decimals": 18,
                        "symbol": "WETH",
                        "name": "Wrapped Ether"
                    }
                ]
            },
            "inputAmount": {
                "currency": {
                    "address": "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
                    "chainId": "42161",
                    "decimals": 6,
                    "symbol": "USDC",
                    "name": "USD Coin"
                },
                "amount": "106819"
            },
            "outputAmount": {
                "currency": {
                    "address": "0x0000000000000000000000000000000000000000",
                    "chainId": "42161",
                    "decimals": 18,
                    "symbol": "ETH",
                    "name": "Ether"
                },
                "amount": "39087912992946"
            }
        }
    ]
}

const METIS_TRADE = {
    "inputAmount": {
        "currency": {
            "chainId": "1088",
            "name": "Metis",
            "symbol": "METIS",
            "decimals": 18,
            "address": "0x0000000000000000000000000000000000000000"
        },
        "amount": "100000000000000000"
    },
    "outputAmount": {
        "currency": {
            "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
            "chainId": "1088",
            "decimals": 6,
            "symbol": "m.USDC",
            "name": "Bridged USDC"
        },
        "amount": "1840348"
    },
    "tradeType": 0,
    "aggregator": "1delta",
    "interfaceTrade": {
        "tradeType": 0,
        "inputAmount": {
            "currency": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": "1088",
                "decimals": 18,
                "symbol": "METIS",
                "name": "Metis"
            },
            "amount": "100000000000000000"
        },
        "outputAmount": {
            "currency": {
                "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                "chainId": "1088",
                "decimals": 6,
                "symbol": "m.USDC",
                "name": "Bridged USDC"
            },
            "amount": "1840348"
        },
        "swaps": [
            {
                "route": {
                    "pools": [
                        {
                            "protocol": "WAGMI",
                            "dexId": 0,
                            "tokenIn": {
                                "address": "0x75cb093e4d61d2a2e65d8e0bbb01de8d89b53481",
                                "chainId": "1088",
                                "decimals": 18,
                                "symbol": "WMETIS",
                                "name": "Wrapped Metis"
                            },
                            "tokenOut": {
                                "address": "0x420000000000000000000000000000000000000a",
                                "chainId": "1088",
                                "decimals": 18,
                                "symbol": "Wrapped Ether",
                                "name": "WETH"
                            },
                            "address": "0xdf99c7073c7685192dB6Cbbf69732BEe3354E117",
                            "swapParams": {
                                "dexId": 0,
                                "forkId": 15,
                                "fee": 3000,
                                "pool": "0xdf99c7073c7685192dB6Cbbf69732BEe3354E117"
                            }
                        },
                        {
                            "protocol": "HERMES_VOLATILE",
                            "dexId": 1,
                            "tokenIn": {
                                "address": "0x420000000000000000000000000000000000000a",
                                "chainId": "1088",
                                "decimals": 18,
                                "symbol": "WETH",
                                "name": "Wrapped Ether"
                            },
                            "tokenOut": {
                                "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                                "chainId": "1088",
                                "decimals": 6,
                                "symbol": "m.USDC",
                                "name": "Bridged USDC"
                            },
                            "address": "0xEfFEC28996aAff6D55B6D108a46446d45C3a2E71",
                            "swapParams": {
                                "dexId": 1,
                                "feeDenom": 9970,
                                "forkId": "136",
                                "pool": "0xEfFEC28996aAff6D55B6D108a46446d45C3a2E71"
                            }
                        }
                    ],
                    "path": [
                        {
                            "address": "0x75cb093e4d61d2a2e65d8e0bbb01de8d89b53481",
                            "chainId": "1088",
                            "decimals": 18,
                            "symbol": "WMETIS",
                            "name": "Wrapped Metis"
                        },
                        {
                            "address": "0x420000000000000000000000000000000000000a",
                            "chainId": "1088",
                            "decimals": 18,
                            "symbol": "Wrapped Ether",
                            "name": "WETH"
                        },
                        {
                            "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                            "chainId": "1088",
                            "decimals": 6,
                            "symbol": "m.USDC",
                            "name": "Bridged USDC"
                        }
                    ]
                },
                "inputAmount": {
                    "currency": {
                        "address": "0x0000000000000000000000000000000000000000",
                        "chainId": "1088",
                        "decimals": 18,
                        "symbol": "METIS",
                        "name": "Metis"
                    },
                    "amount": "100000000000000000"
                },
                "outputAmount": {
                    "currency": {
                        "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                        "chainId": "1088",
                        "decimals": 6,
                        "symbol": "m.USDC",
                        "name": "Bridged USDC"
                    },
                    "amount": "1840348"
                }
            }
        ]
    },
    "approvalTarget": "0xCe434378adacC51d54312c872113D687Ac19B516",
    "stringified": "",
    "flashLoanSource": "None",
    "inputAmountRealized": 0.1,
    "outputAmountRealized": 1.840348,
    "slippage": {
        "numerator": "30",
        "denominator": "10000",
        "isPercent": true
    }
}


const FOT_TRADE = {
    "inputAmount": {
        "currency": {
            "address": "0x186573b175adf5801cf95fb06b232ccab123c6f4",
            "chainId": "1088",
            "decimals": 18,
            "symbol": "MONKEX",
            "name": "Monkex"
        },
        "amount": "128746294877748486569"
    },
    "outputAmount": {
        "currency": {
            "chainId": "1088",
            "name": "Metis",
            "symbol": "METIS",
            "decimals": 18,
            "address": "0x0000000000000000000000000000000000000000"
        },
        "amount": "78231108988017009"
    },
    "tradeType": 0,
    "aggregator": "1delta",
    "interfaceTrade": {
        "tradeType": 0,
        "inputAmount": {
            "currency": {
                "address": "0x186573b175adf5801cf95fb06b232ccab123c6f4",
                "chainId": "1088",
                "decimals": 18,
                "symbol": "MONKEX",
                "name": "Monkex"
            },
            "amount": "128746294877748486569"
        },
        "outputAmount": {
            "currency": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": "1088",
                "decimals": 18,
                "symbol": "METIS",
                "name": "Metis"
            },
            "amount": "78231108988017009"
        },
        "swaps": [
            {
                "route": {
                    "pools": [
                        {
                            "protocol": "HERCULES_V2",
                            "dexId": 1,
                            "tokenIn": {
                                "address": "0x186573b175adf5801cf95fb06b232ccab123c6f4",
                                "chainId": "1088",
                                "decimals": 18,
                                "symbol": "MONKEX",
                                "name": "Monkex"
                            },
                            "tokenOut": {
                                "address": "0x420000000000000000000000000000000000000a",
                                "chainId": "1088",
                                "decimals": 18,
                                "symbol": "WETH",
                                "name": "Wrapped Ether"
                            },
                            "address": "0x6D2d52d788a5eab4009dC4E039505212f444bf64",
                            "swapParams": {
                                "dexId": 1,
                                "feeDenom": 9970,
                                "forkId": "130",
                                "pool": "0x6D2d52d788a5eab4009dC4E039505212f444bf64"
                            }
                        },
                        {
                            "protocol": "NETSWAP",
                            "dexId": 1,
                            "tokenIn": {
                                "address": "0x420000000000000000000000000000000000000a",
                                "chainId": "1088",
                                "decimals": 18,
                                "symbol": "WETH",
                                "name": "Wrapped Ether"
                            },
                            "tokenOut": {
                                "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                                "chainId": "1088",
                                "decimals": 6,
                                "symbol": "m.USDC",
                                "name": "Bridged USDC"
                            },
                            "address": "0xF5988809ac97C65121e2c34f5D49558e3D12C253",
                            "swapParams": {
                                "dexId": 1,
                                "feeDenom": 9970,
                                "forkId": "0",
                                "pool": "0xF5988809ac97C65121e2c34f5D49558e3D12C253"
                            }
                        },
                        {
                            "protocol": "HERCULES_V2",
                            "dexId": 1,
                            "tokenIn": {
                                "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                                "chainId": "1088",
                                "decimals": 6,
                                "symbol": "m.USDC",
                                "name": "Bridged USDC"
                            },
                            "tokenOut": {
                                "address": "0x75cb093e4d61d2a2e65d8e0bbb01de8d89b53481",
                                "chainId": "1088",
                                "decimals": 18,
                                "symbol": "WMETIS",
                                "name": "Wrapped Metis"
                            },
                            "address": "0xEf874FeDe49CF49940E8C472f3e58E75ea65b34c",
                            "swapParams": {
                                "dexId": 1,
                                "feeDenom": 9970,
                                "forkId": "130",
                                "pool": "0xEf874FeDe49CF49940E8C472f3e58E75ea65b34c"
                            }
                        }
                    ],
                    "path": [
                        {
                            "address": "0x186573b175adf5801cf95fb06b232ccab123c6f4",
                            "chainId": "1088",
                            "decimals": 18,
                            "symbol": "MONKEX",
                            "name": "Monkex"
                        },
                        {
                            "address": "0x420000000000000000000000000000000000000a",
                            "chainId": "1088",
                            "decimals": 18,
                            "symbol": "WETH",
                            "name": "Wrapped Ether"
                        },
                        {
                            "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                            "chainId": "1088",
                            "decimals": 6,
                            "symbol": "m.USDC",
                            "name": "Bridged USDC"
                        },
                        {
                            "address": "0x75cb093e4d61d2a2e65d8e0bbb01de8d89b53481",
                            "chainId": "1088",
                            "decimals": 18,
                            "symbol": "WMETIS",
                            "name": "Wrapped Metis"
                        }
                    ]
                },
                "inputAmount": {
                    "currency": {
                        "address": "0x186573b175adf5801cf95fb06b232ccab123c6f4",
                        "chainId": "1088",
                        "decimals": 18,
                        "symbol": "MONKEX",
                        "name": "Monkex"
                    },
                    "amount": "128746294877748486569"
                },
                "outputAmount": {
                    "currency": {
                        "address": "0x0000000000000000000000000000000000000000",
                        "chainId": "1088",
                        "decimals": 18,
                        "symbol": "METIS",
                        "name": "Metis"
                    },
                    "amount": "78231108988017009"
                }
            }
        ]
    },
    "approvalTarget": "0xCe434378adacC51d54312c872113D687Ac19B516",
    "stringified": "",
    "flashLoanSource": "None",
    "inputAmountRealized": 128.74629487774848,
    "outputAmountRealized": 0.07823110898801701,
    "slippage": {
        "numerator": "30",
        "denominator": "10000",
        "isPercent": true
    }
}

const SINGLE_ROUTE = {
    "trade": {
        "inputAmount": {
            "currency": {
                "chainId": "167000",
                "name": "Ether",
                "symbol": "ETH",
                "decimals": 18,
                "address": "0x0000000000000000000000000000000000000000"
            },
            "amount": "2000000000000000"
        },
        "outputAmount": {
            "currency": {
                "address": "0x07d83526730c7438048d55a4fc0b850e2aab6f0b",
                "chainId": "167000",
                "decimals": 6,
                "symbol": "USDC",
                "name": "USD Coin"
            },
            "amount": "5687964"
        },
        "tradeType": 0,
        "aggregator": "1delta",
        "interfaceTrade": {
            "tradeType": 0,
            "inputAmount": {
                "currency": {
                    "address": "0x0000000000000000000000000000000000000000",
                    "chainId": "167000",
                    "decimals": 18,
                    "symbol": "ETH",
                    "name": "Ether"
                },
                "amount": "2000000000000000"
            },
            "outputAmount": {
                "currency": {
                    "address": "0x07d83526730c7438048d55a4fc0b850e2aab6f0b",
                    "chainId": "167000",
                    "decimals": 6,
                    "symbol": "USDC",
                    "name": "USD Coin"
                },
                "amount": "5687964"
            },
            "swaps": [
                {
                    "route": {
                        "pools": [
                            {
                                "protocol": "RITSU_RYTHM",
                                "dexId": 0,
                                "tokenIn": {
                                    "address": "0xa51894664a773981c6c112c43ce576f315d5b1b6",
                                    "chainId": "167000",
                                    "decimals": 18,
                                    "symbol": "WETH",
                                    "name": "Wrapped Ether"
                                },
                                "tokenOut": {
                                    "address": "0x07d83526730c7438048d55a4fc0b850e2aab6f0b",
                                    "chainId": "167000",
                                    "decimals": 6,
                                    "symbol": "USD Coin",
                                    "name": "USDC"
                                },
                                "address": "0xeF4a016F3E54c4520220adE7a496842ECbF83E09",
                                "swapParams": {
                                    "dexId": 160,
                                    "pool": "0xeF4a016F3E54c4520220adE7a496842ECbF83E09"
                                }
                            }
                        ],
                        "path": [
                            {
                                "address": "0xa51894664a773981c6c112c43ce576f315d5b1b6",
                                "chainId": "167000",
                                "decimals": 18,
                                "symbol": "WETH",
                                "name": "Wrapped Ether"
                            },
                            {
                                "address": "0x07d83526730c7438048d55a4fc0b850e2aab6f0b",
                                "chainId": "167000",
                                "decimals": 6,
                                "symbol": "USD Coin",
                                "name": "USDC"
                            }
                        ]
                    },
                    "inputAmount": {
                        "currency": {
                            "address": "0x0000000000000000000000000000000000000000",
                            "chainId": "167000",
                            "decimals": 18,
                            "symbol": "ETH",
                            "name": "Ether"
                        },
                        "amount": "2000000000000000"
                    },
                    "outputAmount": {
                        "currency": {
                            "address": "0x07d83526730c7438048d55a4fc0b850e2aab6f0b",
                            "chainId": "167000",
                            "decimals": 6,
                            "symbol": "USDC",
                            "name": "USD Coin"
                        },
                        "amount": "5687964"
                    }
                }
            ]
        },
        "approvalTarget": "0x594cE4B82A81930cC637f1A59afdFb0D70054232",
        "stringified": "",
        "flashLoanSource": "None",
        "inputAmountRealized": 0.002,
        "outputAmountRealized": 5.687964,
        "slippage": {
            "numerator": "30",
            "denominator": "10000",
            "isPercent": true
        }
    },
    "slippageTolerance": "3000",
    "receiver": "0x91ae002a960e63Ccb0E5bDE83A8C13E51e1cB91A",
    "composer": "0x594cE4B82A81930cC637f1A59afdFb0D70054232",
    "fotInput": false
}