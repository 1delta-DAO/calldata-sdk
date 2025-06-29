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

    it(
        'Tests mantle simple',
        async () => {
            // @ts-ignore
            const { calldata, value } = ComposerSpot.composeSpotCalldata(PARAMS_SIMPLE)
            console.log("calldata", calldata)
            expect(calldata).to.equal("0x10000000000000000000071afd498d0000000000000000000000000000003cc106000000000000000000000000000000000000000001000000a51894664a773981c6c112c43ce576f315d5b1b6594ce4b82a81930cc637f1a59afdfb0d70054232fe0002000007d83526730c7438048d55a4fc0b850e2aab6f0b91ae002a960e63ccb0e5bde83a8c13e51e1cb91aa0ef4a016f3e54c4520220ade7a496842ecbf83e0901")
        },
        { timeout: 25000 },
    )

    it(
        'Tests wrapswap',
        async () => {
            // @ts-ignore
            const { calldata, value } = ComposerSpot.composeSpotCalldata(WRAP_SWAP)
            console.log("calldata", calldata)
            expect(calldata).to.equal("0x100000000000000000018a59e9721180000000000000000000000000000011c8cd00000000000000000000000000000000000000000100000075cb093e4d61d2a2e65d8e0bbb01de8d89b53481ce434378adacc51d54312c872113d687ac19b516fe0002000433333333333333330000ea32a96608495e54156ae48931a7c20f0dcc1a2191ae002a960e63ccb0e5bde83a8c13e51e1cb91a00f956887f404883a838a388b7884ca85b223bd54d010bb8000101000000bb06dca3ae6887fabf931640f67cab3e3a16f4dcce434378adacc51d54312c872113d687ac19b51600f75c20c485c6ab97df2fc20790531617a179ae7b1e0bb800010000ea32a96608495e54156ae48931a7c20f0dcc1a2191ae002a960e63ccb0e5bde83a8c13e51e1cb91a00a1b0a025669eae9dd3133e9fa2c2c30ea8399b2a1e04b000010000ea32a96608495e54156ae48931a7c20f0dcc1a2191ae002a960e63ccb0e5bde83a8c13e51e1cb91a00a4e4949e0cccd8282f30e7e113d8a551a1ed1aeb1e075a000102000000420000000000000000000000000000000000000ace434378adacc51d54312c872113d687ac19b51600df99c7073c7685192db6cbbf69732bee3354e1170f0bb800010000bb06dca3ae6887fabf931640f67cab3e3a16f4dcce434378adacc51d54312c872113d687ac19b5160051f9247562b86f66149126bf9e200528522d527e10006400010000ea32a96608495e54156ae48931a7c20f0dcc1a2191ae002a960e63ccb0e5bde83a8c13e51e1cb91a0069a4cca3bfcb4133a153222134caea849f94b9bd100bb8000102000000420000000000000000000000000000000000000ace434378adacc51d54312c872113d687ac19b51600bd718c67cd1e2f7fbe22d47be21036cd647c77141e0bb800010000bb06dca3ae6887fabf931640f67cab3e3a16f4dcce434378adacc51d54312c872113d687ac19b51600500a1959a86358500b24dbf5b7a32298e20d2c71100bb800010000ea32a96608495e54156ae48931a7c20f0dcc1a2191ae002a960e63ccb0e5bde83a8c13e51e1cb91a00926873c13835e44516073aa6b45e56116efa59b41000640001")
        },
        { timeout: 25000 },
    )
})


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

const PARAMS_SIMPLE = {
    "trade": {
        "inputAmount": {
            "currency": {
                "chainId": "5000",
                "name": "Mantle",
                "symbol": "MNT",
                "decimals": 18,
                "address": "0x0000000000000000000000000000000000000000"
            },
            "amount": "200000000000000000"
        },
        "outputAmount": {
            "currency": {
                "address": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
                "chainId": "5000",
                "decimals": 6,
                "symbol": "USDC",
                "name": "USD Coin"
            },
            "amount": "130456"
        },
        "tradeType": 0,
        "aggregator": "1delta",
        "interfaceTrade": {
            "tradeType": 0,
            "inputAmount": {
                "currency": {
                    "address": "0x0000000000000000000000000000000000000000",
                    "chainId": "5000",
                    "decimals": 18,
                    "symbol": "MNT",
                    "name": "Mantle"
                },
                "amount": "200000000000000000"
            },
            "outputAmount": {
                "currency": {
                    "address": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
                    "chainId": "5000",
                    "decimals": 6,
                    "symbol": "USDC",
                    "name": "USD Coin"
                },
                "amount": "130456"
            },
            "swaps": [
                {
                    "route": {
                        "pools": [
                            {
                                "protocol": "CRUST_V1_STABLE",
                                "dexId": 1,
                                "tokenIn": {
                                    "address": "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
                                    "chainId": "5000",
                                    "decimals": 18,
                                    "symbol": "WMNT",
                                    "name": "Wrapped Mantle"
                                },
                                "tokenOut": {
                                    "address": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
                                    "chainId": "5000",
                                    "decimals": 6,
                                    "symbol": "USDC",
                                    "name": "USD Coin"
                                },
                                "address": "0x14Bdf0998a2313F8E5772866FDAC029f3d58eb2b",
                                "swapParams": {
                                    "dexId": 1,
                                    "feeDenom": 9999,
                                    "forkId": "64",
                                    "pool": "0x14Bdf0998a2313F8E5772866FDAC029f3d58eb2b"
                                }
                            }
                        ],
                        "path": [
                            {
                                "address": "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
                                "chainId": "5000",
                                "decimals": 18,
                                "symbol": "WMNT",
                                "name": "Wrapped Mantle"
                            },
                            {
                                "address": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
                                "chainId": "5000",
                                "decimals": 6,
                                "symbol": "USDC",
                                "name": "USD Coin"
                            }
                        ]
                    },
                    "inputAmount": {
                        "currency": {
                            "address": "0x0000000000000000000000000000000000000000",
                            "chainId": "5000",
                            "decimals": 18,
                            "symbol": "MNT",
                            "name": "Mantle"
                        },
                        "amount": "200000000000000000"
                    },
                    "outputAmount": {
                        "currency": {
                            "address": "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9",
                            "chainId": "5000",
                            "decimals": 6,
                            "symbol": "USDC",
                            "name": "USD Coin"
                        },
                        "amount": "130456"
                    }
                }
            ]
        },
        "approvalTarget": "0x5c019a146758287c614fe654caec1ba1caf05f4e",
        "stringified": "",
        "flashLoanSource": "None",
        "inputAmountRealized": 0.2,
        "outputAmountRealized": 0.130456,
        "slippage": {
            "numerator": "30",
            "denominator": "10000",
            "isPercent": true
        }
    },
    "composer": "0x5c019a146758287c614fe654caec1ba1caf05f4e",
    "receiver": "0xc08BFef7E778f3519D79E96780b77066F5d4FCC0",
    "slippageTolerance": "3000"
}

const WRAP_SWAP = {
    "trade": {
        "inputAmount": {
            "currency": {
                "chainId": "1088",
                "name": "Metis",
                "symbol": "METIS",
                "decimals": 18,
                "address": "0x0000000000000000000000000000000000000000"
            },
            "amount": "111000000000000000"
        },
        "outputAmount": {
            "currency": {
                "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                "chainId": "1088",
                "decimals": 6,
                "symbol": "m.USDC",
                "name": "Bridged USDC"
            },
            "amount": "1665025"
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
                "amount": "111000000000000000"
            },
            "outputAmount": {
                "currency": {
                    "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                    "chainId": "1088",
                    "decimals": 6,
                    "symbol": "m.USDC",
                    "name": "Bridged USDC"
                },
                "amount": "1665025"
            },
            "swaps": [
                {
                    "route": {
                        "pools": [
                            {
                                "protocol": "SUSHISWAP_V3",
                                "dexId": 0,
                                "tokenIn": {
                                    "address": "0x75cb093e4d61d2a2e65d8e0bbb01de8d89b53481",
                                    "chainId": "1088",
                                    "decimals": 18,
                                    "symbol": "WMETIS",
                                    "name": "Wrapped Metis"
                                },
                                "tokenOut": {
                                    "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDC",
                                    "name": "Bridged USDC"
                                },
                                "address": "0xF956887F404883A838a388b7884ca85b223Bd54D",
                                "swapParams": {
                                    "dexId": 0,
                                    "forkId": 1,
                                    "fee": 3000,
                                    "pool": "0xF956887F404883A838a388b7884ca85b223Bd54D"
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
                        "amount": "22200000000000000"
                    },
                    "outputAmount": {
                        "currency": {
                            "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                            "chainId": "1088",
                            "decimals": 6,
                            "symbol": "m.USDC",
                            "name": "Bridged USDC"
                        },
                        "amount": "328692"
                    }
                },
                {
                    "route": {
                        "pools": [
                            {
                                "protocol": "HERCULES",
                                "dexId": 0,
                                "tokenIn": {
                                    "address": "0x75cb093e4d61d2a2e65d8e0bbb01de8d89b53481",
                                    "chainId": "1088",
                                    "decimals": 18,
                                    "symbol": "WMETIS",
                                    "name": "Wrapped Metis"
                                },
                                "tokenOut": {
                                    "address": "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDT",
                                    "name": "Bridged USDT"
                                },
                                "address": "0xf75C20C485c6aB97dF2Fc20790531617a179AE7b",
                                "swapParams": {
                                    "dexId": 0,
                                    "forkId": 30,
                                    "fee": 3000,
                                    "pool": "0xf75C20C485c6aB97dF2Fc20790531617a179AE7b"
                                }
                            },
                            {
                                "protocol": "HERCULES",
                                "dexId": 0,
                                "tokenIn": {
                                    "address": "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDT",
                                    "name": "Bridged USDT"
                                },
                                "tokenOut": {
                                    "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDC",
                                    "name": "Bridged USDC"
                                },
                                "address": "0xa1B0a025669EAe9dd3133e9FA2C2C30Ea8399B2a",
                                "swapParams": {
                                    "dexId": 0,
                                    "forkId": 30,
                                    "fee": 1200,
                                    "pool": "0xa1B0a025669EAe9dd3133e9FA2C2C30Ea8399B2a"
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
                                "address": "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc",
                                "chainId": "1088",
                                "decimals": 6,
                                "symbol": "m.USDT",
                                "name": "Bridged USDT"
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
                        "amount": "22200000000000000"
                    },
                    "outputAmount": {
                        "currency": {
                            "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                            "chainId": "1088",
                            "decimals": 6,
                            "symbol": "m.USDC",
                            "name": "Bridged USDC"
                        },
                        "amount": "329214"
                    }
                },
                {
                    "route": {
                        "pools": [
                            {
                                "protocol": "HERCULES",
                                "dexId": 0,
                                "tokenIn": {
                                    "address": "0x75cb093e4d61d2a2e65d8e0bbb01de8d89b53481",
                                    "chainId": "1088",
                                    "decimals": 18,
                                    "symbol": "WMETIS",
                                    "name": "Wrapped Metis"
                                },
                                "tokenOut": {
                                    "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDC",
                                    "name": "Bridged USDC"
                                },
                                "address": "0xA4E4949e0cccd8282f30e7E113D8A551A1eD1aeb",
                                "swapParams": {
                                    "dexId": 0,
                                    "forkId": 30,
                                    "fee": 1882,
                                    "pool": "0xA4E4949e0cccd8282f30e7E113D8A551A1eD1aeb"
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
                        "amount": "22200000000000000"
                    },
                    "outputAmount": {
                        "currency": {
                            "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                            "chainId": "1088",
                            "decimals": 6,
                            "symbol": "m.USDC",
                            "name": "Bridged USDC"
                        },
                        "amount": "329295"
                    }
                },
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
                                    "symbol": "WETH",
                                    "name": "Wrapped Ether"
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
                                "protocol": "MAIA_V3",
                                "dexId": 0,
                                "tokenIn": {
                                    "address": "0x420000000000000000000000000000000000000a",
                                    "chainId": "1088",
                                    "decimals": 18,
                                    "symbol": "WETH",
                                    "name": "Wrapped Ether"
                                },
                                "tokenOut": {
                                    "address": "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDT",
                                    "name": "Bridged USDT"
                                },
                                "address": "0x51f9247562B86f66149126bf9e200528522D527E",
                                "swapParams": {
                                    "dexId": 0,
                                    "forkId": 16,
                                    "fee": 100,
                                    "pool": "0x51f9247562B86f66149126bf9e200528522D527E"
                                }
                            },
                            {
                                "protocol": "MAIA_V3",
                                "dexId": 0,
                                "tokenIn": {
                                    "address": "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDT",
                                    "name": "Bridged USDT"
                                },
                                "tokenOut": {
                                    "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDC",
                                    "name": "Bridged USDC"
                                },
                                "address": "0x69A4CcA3bfcB4133A153222134CAea849f94b9BD",
                                "swapParams": {
                                    "dexId": 0,
                                    "forkId": 16,
                                    "fee": 3000,
                                    "pool": "0x69A4CcA3bfcB4133A153222134CAea849f94b9BD"
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
                                "symbol": "WETH",
                                "name": "Wrapped Ether"
                            },
                            {
                                "address": "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc",
                                "chainId": "1088",
                                "decimals": 6,
                                "symbol": "m.USDT",
                                "name": "Bridged USDT"
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
                        "amount": "22200000000000000"
                    },
                    "outputAmount": {
                        "currency": {
                            "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                            "chainId": "1088",
                            "decimals": 6,
                            "symbol": "m.USDC",
                            "name": "Bridged USDC"
                        },
                        "amount": "338780"
                    }
                },
                {
                    "route": {
                        "pools": [
                            {
                                "protocol": "HERCULES",
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
                                    "symbol": "WETH",
                                    "name": "Wrapped Ether"
                                },
                                "address": "0xbD718c67cD1e2f7FBe22d47bE21036cD647C7714",
                                "swapParams": {
                                    "dexId": 0,
                                    "forkId": 30,
                                    "fee": 3000,
                                    "pool": "0xbD718c67cD1e2f7FBe22d47bE21036cD647C7714"
                                }
                            },
                            {
                                "protocol": "MAIA_V3",
                                "dexId": 0,
                                "tokenIn": {
                                    "address": "0x420000000000000000000000000000000000000a",
                                    "chainId": "1088",
                                    "decimals": 18,
                                    "symbol": "WETH",
                                    "name": "Wrapped Ether"
                                },
                                "tokenOut": {
                                    "address": "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDT",
                                    "name": "Bridged USDT"
                                },
                                "address": "0x500A1959a86358500B24DbF5b7a32298E20D2c71",
                                "swapParams": {
                                    "dexId": 0,
                                    "forkId": 16,
                                    "fee": 3000,
                                    "pool": "0x500A1959a86358500B24DbF5b7a32298E20D2c71"
                                }
                            },
                            {
                                "protocol": "MAIA_V3",
                                "dexId": 0,
                                "tokenIn": {
                                    "address": "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDT",
                                    "name": "Bridged USDT"
                                },
                                "tokenOut": {
                                    "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                                    "chainId": "1088",
                                    "decimals": 6,
                                    "symbol": "m.USDC",
                                    "name": "Bridged USDC"
                                },
                                "address": "0x926873c13835E44516073Aa6b45e56116EfA59B4",
                                "swapParams": {
                                    "dexId": 0,
                                    "forkId": 16,
                                    "fee": 100,
                                    "pool": "0x926873c13835E44516073Aa6b45e56116EfA59B4"
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
                                "symbol": "WETH",
                                "name": "Wrapped Ether"
                            },
                            {
                                "address": "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc",
                                "chainId": "1088",
                                "decimals": 6,
                                "symbol": "m.USDT",
                                "name": "Bridged USDT"
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
                        "amount": "22200000000000000"
                    },
                    "outputAmount": {
                        "currency": {
                            "address": "0xea32a96608495e54156ae48931a7c20f0dcc1a21",
                            "chainId": "1088",
                            "decimals": 6,
                            "symbol": "m.USDC",
                            "name": "Bridged USDC"
                        },
                        "amount": "339044"
                    }
                }
            ]
        },
        "approvalTarget": "0xCe434378adacC51d54312c872113D687Ac19B516",
        "stringified": "",
        "flashLoanSource": "None",
        "inputAmountRealized": 0.111,
        "outputAmountRealized": 1.665025,
        "slippage": {
            "numerator": "30",
            "denominator": "10000",
            "isPercent": true
        }
    },
    "slippageTolerance": "3000",
    "receiver": "0x91ae002a960e63Ccb0E5bDE83A8C13E51e1cB91A",
    "composer": "0xCe434378adacC51d54312c872113D687Ac19B516",
    "fotInput": false
}