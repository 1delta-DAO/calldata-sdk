import { describe, it, expect } from 'vitest'
import { ComposerMargin } from './plain'
import { ComposerFlashSwap } from './flashSwap'

describe('createMarginFlashLoan', () => {
    describe('Margin Trade Types', () => {
        it('should create flash loan for OPEN margin trade', () => {

            const result = ComposerMargin.createMarginFlashLoan(testParams)

            expect(result).not.toBe('0x')
            expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
        })
    })

    describe('Margin Trade Types', () => {
        it('should create flash loan for CLOSE margin trade', () => {

            const result = ComposerMargin.createMarginFlashLoan(
                // @ts-ignore
                testParamsClose
            )

            expect(result).not.toBe('0x')
            expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
        })
    })

    describe('Flash swap', () => {
        it('should create flash loan for CLOSE margin trade', () => {

            // @ts-ignore
            const result = ComposerFlashSwap.composeFlashSwapCalldata(
                {
                    // @ts-ignore
                    trade: flashSwap,
                    "marginData": {
                        "irModeIn": 2,
                        "irModeOut": 2,
                        // @ts-ignore
                        "marginTradeType": "Open",
                        // "permitData": {
                        //     "data": "0x0000000000000000000000000000000000000000000000000000000000030d41683c7f6e0503183d13422ad544f7922ec10f07602801301a707f073cc1a2ab75fdb56fc4e0d01e65452496daa2eaee0f4d31efb6a9c9827e9560ddb5af8716d1e0df3340",
                        //     "isPermit2": false
                        // },
                        // @ts-ignore
                        "lender": "AAVE_V3"
                    },
                    composerOverride: "0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72",
                    account: "0x91ae002a960e63Ccb0E5bDE83A8C13E51e1cB91A",
                    slippageTolerance: "10"
                })

            expect(result).to.toBe(expectedCalldataFlashSwap)
            expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
        })
    })

    describe.only('Flash swap MI Single', () => {
        it('should create flash loan for CLOSE margin trade', () => {

            // @ts-ignore
            const result = ComposerFlashSwap.composeFlashSwapCalldata({
                ...FLASH_SWAP_MAX_IN_SINGLE,
                slippageTolerance: "10"
            })

            expect(result).to.toBe("0x1000000000000000000021a9314b348a1100000000000000000000000000005e774200000000000000000000000000000000000006000068f180fcce6836688e9084f035309e29bf0a2095cdef0a216fcef809258aa4f341db1a5ab296ea7200689a850f62b41d89b5e5c3465cd291374b215813010bb801d0400568f180fcce6836688e9084f035309e29bf0a2095794a61358d6845594f94dc1db02a252b5b4814ad300003e768f180fcce6836688e9084f035309e29bf0a20950000000000000000000000000000000091ae002a960e63ccb0e5bde83a8c13e51e1cb91a794a61358d6845594f94dc1db02a252b5b4814ad5000e50fa9b3c56ffb159cb0fca61f5c9d750e8128c800640000000000000000000000000000000000000000000000000021b1cf4b8953ef6848d73c5b145e86384440efe6cf84efd21204ae69ad927fcc92bce4e74f754f86a8e0f7acefe09786da15537fdd1cee3c3ca5d5842217dd56607938259231bcff450651300303e742000000000000000000000000000000000000060000ffffffffffffffffffffffffffffcdef0a216fcef809258aa4f341db1a5ab296ea72e50fa9b3c56ffb159cb0fca61f5c9d750e8128c8794a61358d6845594f94dc1db02a252b5b4814ad40014200000000000000000000000000000000000006689a850f62b41d89b5e5c3465cd291374b2158130100000000000000000021a9314b348a114001420000000000000000000000000000000000000691ae002a960e63ccb0e5bde83a8c13e51e1cb91a0000000000000000000000000000000000")
            expect(result).toMatch(/^0x[0-9a-fA-F]+$/)
        })
    })
})

const testParams: any = {
    "trade": {
        "tradeType": 0,
        "inputAmount": {
            "currency": {
                "chainId": "10",
                "name": "Bridged USDC",
                "symbol": "USDC.e",
                "address": "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
                "decimals": 6
            },
            "amount": "200000"
        },
        "outputAmount": {
            "currency": {
                "chainId": "10",
                "name": "Wrapped BTC",
                "symbol": "WBTC",
                "address": "0x68f180fcce6836688e9084f035309e29bf0a2095",
                "decimals": 8
            },
            "amount": "191"
        },
        "aggregator": "Kyberswap",
        "target": "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5",
        "approvalTarget": "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5",
        "stringified": "200000-USDC.e->191-WBTC-Kyberswap",
        "flashLoanSource": "MORPHO_BLUE",
        "inputAmountRealized": 0.2,
        "outputAmountRealized": 0.00000191,
        "slippage": {
            "numerator": "60",
            "denominator": "10000",
            "isPercent": true
        }
    },
    "externalCall": {
        "callForwarder": "0xfca11Db2b5DE60DF9a2C81233333a449983B4101",
        "calldata": "0xe21fd0e900000000000000000000000000000000000000000000000000000000000000200000000000000000000000006e4141d33021b52c91c28608403db4a0ffb50ec6000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000004600000000000000000000000000000000000000000000000000000000000000150010300000048000000ba12222222228d8ba445958a75a0704d566bf2c8373643b17cd80e37675c8c98ef774efe6ca0b4de00000000000000000000001c0200000000000000000000000000030d400b0000002500000053790b6c7023786659d11ed82ee03079f3bd6976020100000003000003e800000032000000002e02000000319c0dd36284ac24a6b2bee73929f699b9f48c3801010000000000000000000000000000000100eed0b40a7f5c764cbc14f9669b88837ca1490cca17c3160768f180fcce6836688e9084f035309e29bf0a2095cdef0a216fcef809258aa4f341db1a5ab296ea72000000000000000000000000683c7c2100000054000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000bf4f82e73edb06d29ff62c91ec8f5ff06571bdeb29000000000000000000000000000000000000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c3160700000000000000000000000068f180fcce6836688e9084f035309e29bf0a2095000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000cdef0a216fcef809258aa4f341db1a5ab296ea720000000000000000000000000000000000000000000000000000000000030d4000000000000000000000000000000000000000000000000000000000000000bd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000000010000000000000000000000006e4141d33021b52c91c28608403db4a0ffb50ec600000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000030d40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000027f7b22536f75726365223a226e756c6c3a6c6f63616c686f7374222c22416d6f756e74496e555344223a22302e31393936303035343236323736343731222c22416d6f756e744f7574555344223a22302e3139393838373831313635373533393937222c22526566657272616c223a22222c22466c616773223a302c22416d6f756e744f7574223a22313931222c2254696d657374616d70223a313734383739333230312c22526f7574654944223a2239653632656334662d383738352d343463662d616464372d6238643663643132373136663a65343435323664312d616462622d346561622d626666352d363530313664373638393134222c22496e74656772697479496e666f223a7b224b65794944223a2231222c225369676e6174757265223a22544a67694e645962366c38324e4c417079784c7949634c756b53576c5a3144556a706d6a34762b44752f59414e3347546d2f70373867524b6e30396b577a3856496f436e2f36674c796261696f6870336c6e56712b625a4c586f364667574e4248394176682f486b416b4f762b6c3143315476367148713564723752694d31434a653779673055664559394e4836586757374f7538566d4e31757147446946505161667744574f5646646b6a6439506e4c494f316b61764b30756c434c375a704a316939465968704e636934687a624b4838484f743233745833375777354854514935563744594a304e4c6277565151623137426a68346844356e59626567544b344b6d6a7a743652332f73364d6f694368643352416b504b506c46715977454f386a32337332716d345544556e6f312f386a316238514336317a784b4e3176552f55615168506f754e6e3470563939496f326777673d3d227d7d00",
        "target": "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5",
        "value": "0"
    },
    "account": "0x91ae002a960e63Ccb0E5bDE83A8C13E51e1cB91A",
    "marginData": {
        "irModeIn": 2,
        "irModeOut": 2,
        "marginTradeType": "Open",
        "permitData": {
            "data": "0x0000000000000000000000000000000000000000000000000000000000030d41683c7f6e0503183d13422ad544f7922ec10f07602801301a707f073cc1a2ab75fdb56fc4e0d01e65452496daa2eaee0f4d31efb6a9c9827e9560ddb5af8716d1e0df3340",
            "isPermit2": false
        },
        "lender": "AAVE_V3"
    },
    "isMaxIn": false,
    "isMaxOut": false,
    "composerOverride": "0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72",
    "flashInfoOverride": {
        "data": {
            "id": 0,
            "fee": "0"
        },
        "poolType": "0",
        "provider": "MORPHO_BLUE",
        "providerAddress": "0xce95AfbB8EA029495c66020883F87aaE8864AF92",
        "balanceHolder": "0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72"
    }
}




const testParamsClose = {
    "trade": {
        "tradeType": 0,
        "inputAmount": {
            "currency": {
                "chainId": "10",
                "name": "Wrapped Ether",
                "symbol": "WETH",
                "address": "0x4200000000000000000000000000000000000006",
                "decimals": 18
            },
            "amount": "130000000000000"
        },
        "outputAmount": {
            "currency": {
                "chainId": "10",
                "name": "USD Coin",
                "symbol": "USDC",
                "address": "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                "decimals": 6
            },
            "amount": "322976"
        },
        "aggregator": "Kyberswap",
        "target": "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5",
        "approvalTarget": "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5",
        "stringified": "130000000000000-WETH->322976-USDC-Kyberswap",
        "flashLoanSource": "MORPHO_BLUE",
        "inputAmountRealized": 0.00013,
        "outputAmountRealized": 0.322976,
        "slippage": {
            "numerator": "60",
            "denominator": "10000",
            "isPercent": true
        }
    },
    "externalCall": {
        "callForwarder": "0xfca11Db2b5DE60DF9a2C81233333a449983B4101",
        "calldata": "0xe21fd0e900000000000000000000000000000000000000000000000000000000000000200000000000000000000000006e4141d33021b52c91c28608403db4a0ffb50ec6000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004400000000000000000000000000000000000000000000000000000000000000126010200000048000000ba12222222228d8ba445958a75a0704d566bf2c87b50775383d3d6f0215a8f290f2c9e2eebbeceb200020000000000000000008b0000000000000000000000763bfbd220000b0000002e02000000ee1bac98527a9fdd57fccf967817215b083ce1f0010100000000000000000000000000000000000000000a42000000000000000000000000000000000000060b2c639c533813f4aa9d7837caf62653d097ff85cdef0a216fcef809258aa4f341db1a5ab296ea72000000000000000000000000683d8290000000540000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000004eda04f82e73edb06d29ff62c91ec8f5ff06571bdeb29000000000000000000000000000000000000000000000000000000000000000000000000000042000000000000000000000000000000000000060000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff85000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000cdef0a216fcef809258aa4f341db1a5ab296ea720000000000000000000000000000000000000000000000000000763bfbd22000000000000000000000000000000000000000000000000000000000000004e60e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000000010000000000000000000000006e4141d33021b52c91c28608403db4a0ffb50ec600000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000763bfbd2200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002807b22536f75726365223a226e756c6c3a6c6f63616c686f7374222c22416d6f756e74496e555344223a22302e333232393134333535333239303835222c22416d6f756e744f7574555344223a22302e33323239353436363735353233383538222c22526566657272616c223a22222c22466c616773223a302c22416d6f756e744f7574223a22333232393736222c2254696d657374616d70223a313734383836303338342c22526f7574654944223a2232623264303332342d363339382d343638352d393032352d6164313836316230336233663a38616237363261352d383639392d343736632d623261652d306432613065666436306632222c22496e74656772697479496e666f223a7b224b65794944223a2231222c225369676e6174757265223a225a7a6b614852574779523866304a4557674c4c4b33345431634a644d6877692f6d414d38432b326e356e69733063794952554957564444583158575643573674746a6d4e57736f704f414f3361584a4e6678476e48314331554874535636755a4d364e67734562696145745336714d79706b7a42687a7050546a794a41557a324c356e67334779746e453867333353696c4231386f41696450674a6f5142776866337031677955363852414c77626e72455430673348794e2f62684c65524168612f61556b336963733071764a566a7935386257696365422b4d42744637534254576b3547796c496d6f6f59797269734d323838354d546e2f69315966655265674679776c4465564538512f494e72616155494e475a6a776f786d336c745467356a427955716461566b536e41386c5446385a4845707165735071326161616f55684c2f4864512b6a64424f5a41337763354a3651413d3d227d7d",
        "target": "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5",
        "value": "0"
    },
    "account": "0x91ae002a960e63Ccb0E5bDE83A8C13E51e1cB91A",
    "marginData": {
        "irModeIn": 2,
        "irModeOut": 2,
        "marginTradeType": "Close",
        "permitData": {
            "data": "0x0000000000000000000000000000000000000000000000000000763bfbd22001683d84b0efdb049795387ce631ac48531c02c7a1bc0a1c12928d176f5fac0df15d1be39c5251b7321813491af10f12de7a41671addb7e77f20cb0776fe9c27418c10bf02",
            "isPermit2": false
        },
        "lender": "AAVE_V3"
    },
    "isMaxIn": false,
    "isMaxOut": false,
    "composerOverride": "0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72",
    "flashInfoOverride": {
        "data": {
            "id": 0,
            "fee": "0"
        },
        "provider": "MORPHO_BLUE",
        "providerAddress": "0xce95AfbB8EA029495c66020883F87aaE8864AF92",
        "balanceHolder": "0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72",
        "poolType": 0
    }
}

const flashSwap = {
    "inputAmount": {
        "currency": {
            "address": "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
            "chainId": "10",
            "decimals": 6,
            "symbol": "USDC",
            "name": "USD//C"
        },
        "amount": "2000000"
    },
    "outputAmount": {
        "currency": {
            "address": "0x4200000000000000000000000000000000000006",
            "chainId": "10",
            "decimals": 18,
            "symbol": "WETH",
            "name": "Wrapped Ether"
        },
        "amount": "713909793565717"
    },
    "tradeType": 0,
    "aggregator": "1delta",
    "interfaceTrade": {
        "tradeType": 0,
        "inputAmount": {
            "currency": {
                "address": "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                "chainId": "10",
                "decimals": 6,
                "symbol": "USDC",
                "name": "USD//C"
            },
            "amount": "2000000"
        },
        "outputAmount": {
            "currency": {
                "address": "0x4200000000000000000000000000000000000006",
                "chainId": "10",
                "decimals": 18,
                "symbol": "WETH",
                "name": "Wrapped Ether"
            },
            "amount": "713909793565717"
        },
        "swaps": [
            {
                "route": {
                    "pools": [
                        {
                            "protocol": "SUSHISWAP_V3",
                            "dexId": 0,
                            "tokenIn": {
                                "address": "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                                "chainId": "10",
                                "decimals": 6,
                                "symbol": "USD Coin",
                                "name": "USDC"
                            },
                            "tokenOut": {
                                "address": "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
                                "chainId": "10",
                                "decimals": 6,
                                "symbol": "Tether USD",
                                "name": "USDT"
                            },
                            "address": "0x962E23cd3F58f887a5238082A75d223f71890629",
                            "swapParams": {
                                "dexId": 0,
                                "forkId": 1,
                                "fee": 100,
                                "pool": "0x962E23cd3F58f887a5238082A75d223f71890629"
                            }
                        },
                        {
                            "protocol": "UNISWAP_V3",
                            "dexId": 0,
                            "tokenIn": {
                                "address": "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
                                "chainId": "10",
                                "decimals": 6,
                                "symbol": "Tether USD",
                                "name": "USDT"
                            },
                            "tokenOut": {
                                "address": "0x4200000000000000000000000000000000000006",
                                "chainId": "10",
                                "decimals": 18,
                                "symbol": "WETH",
                                "name": "Wrapped Ether"
                            },
                            "address": "0xc858A329Bf053BE78D6239C4A4343B8FbD21472b",
                            "swapParams": {
                                "dexId": 0,
                                "forkId": 0,
                                "fee": 500,
                                "pool": "0xc858A329Bf053BE78D6239C4A4343B8FbD21472b"
                            }
                        }
                    ],
                    "path": [
                        {
                            "address": "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                            "chainId": "10",
                            "decimals": 6,
                            "symbol": "USDC",
                            "name": "USD//C"
                        },
                        {
                            "address": "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
                            "chainId": "10",
                            "decimals": 6,
                            "symbol": "Tether USD",
                            "name": "USDT"
                        },
                        {
                            "address": "0x4200000000000000000000000000000000000006",
                            "chainId": "10",
                            "decimals": 18,
                            "symbol": "WETH",
                            "name": "Wrapped Ether"
                        }
                    ]
                },
                "inputAmount": {
                    "currency": {
                        "address": "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                        "chainId": "10",
                        "decimals": 6,
                        "symbol": "USDC",
                        "name": "USD//C"
                    },
                    "amount": "1700000"
                },
                "outputAmount": {
                    "currency": {
                        "address": "0x4200000000000000000000000000000000000006",
                        "chainId": "10",
                        "decimals": 18,
                        "symbol": "WETH",
                        "name": "Wrapped Ether"
                    },
                    "amount": "571823333153616"
                }
            },
            {
                "route": {
                    "pools": [
                        {
                            "protocol": "SUSHISWAP_V3",
                            "dexId": 0,
                            "tokenIn": {
                                "address": "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                                "chainId": "10",
                                "decimals": 6,
                                "symbol": "USD Coin",
                                "name": "USDC"
                            },
                            "tokenOut": {
                                "address": "0x4200000000000000000000000000000000000006",
                                "chainId": "10",
                                "decimals": 18,
                                "symbol": "WETH",
                                "name": "Wrapped Ether"
                            },
                            "address": "0x146EDa2f1D35efb5eEf5703aCeC701c68E1503d8",
                            "swapParams": {
                                "dexId": 0,
                                "forkId": 1,
                                "fee": 500,
                                "pool": "0x146EDa2f1D35efb5eEf5703aCeC701c68E1503d8"
                            }
                        }
                    ],
                    "path": [
                        {
                            "address": "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                            "chainId": "10",
                            "decimals": 6,
                            "symbol": "USDC",
                            "name": "USD//C"
                        },
                        {
                            "address": "0x4200000000000000000000000000000000000006",
                            "chainId": "10",
                            "decimals": 18,
                            "symbol": "WETH",
                            "name": "Wrapped Ether"
                        }
                    ]
                },
                "inputAmount": {
                    "currency": {
                        "address": "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
                        "chainId": "10",
                        "decimals": 6,
                        "symbol": "USDC",
                        "name": "USD//C"
                    },
                    "amount": "300000"
                },
                "outputAmount": {
                    "currency": {
                        "address": "0x4200000000000000000000000000000000000006",
                        "chainId": "10",
                        "decimals": 18,
                        "symbol": "WETH",
                        "name": "Wrapped Ether"
                    },
                    "amount": "112086460412100"
                }
            }
        ]
    },
    "approvalTarget": "0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72",
    "stringified": "",
    "flashLoanSource": "None",
    "inputAmountRealized": 1000,
    "outputAmountRealized": 200.489201,
    "slippage": {
        "numerator": "30",
        "denominator": "10000",
        "isPercent": true
    }
}

/** Succeeds on optimism with this data */
// address mockSender = 0x91ae002a960e63Ccb0E5bDE83A8C13E51e1cB91A;
// uint256 internal constant forkBlock = 136808112;
const expectedCalldataFlashSwap = "0x10000000000000000000000000000493e00000000000000000000065d710c888c70b2c639c533813f4aa9d7837caf62653d097ff8500004200000000000000000000000000000000000006cdef0a216fcef809258aa4f341db1a5ab296ea7200146eda2f1d35efb5eef5703acec701c68e1503d80101f40233100000000000000000000000000019f0a0000000000000000000000000000000010b2c639c533813f4aa9d7837caf62653d097ff85000094b008aa00579c1307b0ef2c499ad98a8ce58e58cdef0a216fcef809258aa4f341db1a5ab296ea7200962e23cd3f58f887a5238082a75d223f7189062901006401ba100000000000000000000000000000000000000000000000000002078cdb51fc2e94b008aa00579c1307b0ef2c499ad98a8ce58e5800004200000000000000000000000000000000000006cdef0a216fcef809258aa4f341db1a5ab296ea7200c858a329bf053be78d6239c4a4343b8fbd21472b0001f4000140054200000000000000000000000000000000000006794a61358d6845594f94dc1db02a252b5b4814ad300003e742000000000000000000000000000000000000060000000000000000000000000000000091ae002a960e63ccb0e5bde83a8c13e51e1cb91a794a61358d6845594f94dc1db02a252b5b4814ad300103e70b2c639c533813f4aa9d7837caf62653d097ff85000000000000000000000000001e8480cdef0a216fcef809258aa4f341db1a5ab296ea7202794a61358d6845594f94dc1db02a252b5b4814ad40010b2c639c533813f4aa9d7837caf62653d097ff85962e23cd3f58f887a5238082a75d223f71890629010000000000000000000000000019f0a040010b2c639c533813f4aa9d7837caf62653d097ff85146eda2f1d35efb5eef5703acec701c68e1503d801000000000000000000000000000493e0"


const FLASH_SWAP_MAX_IN_SINGLE = {
    "trade": {
        "inputAmount": {
            "currency": {
                "address": "0x4200000000000000000000000000000000000006",
                "chainId": "10",
                "decimals": 18,
                "symbol": "WETH",
                "name": "Wrapped Ether"
            },
            "amount": "9474703411677713"
        },
        "outputAmount": {
            "currency": {
                "address": "0x68f180fcce6836688e9084f035309e29bf0a2095",
                "chainId": "10",
                "decimals": 8,
                "symbol": "WBTC",
                "name": "Wrapped BTC"
            },
            "amount": "24208"
        },
        "tradeType": 0,
        "aggregator": "1delta",
        "interfaceTrade": {
            "tradeType": 0,
            "inputAmount": {
                "currency": {
                    "address": "0x4200000000000000000000000000000000000006",
                    "chainId": "10",
                    "decimals": 18,
                    "symbol": "WETH",
                    "name": "Wrapped Ether"
                },
                "amount": "9474703411677713"
            },
            "outputAmount": {
                "currency": {
                    "address": "0x68f180fcce6836688e9084f035309e29bf0a2095",
                    "chainId": "10",
                    "decimals": 8,
                    "symbol": "WBTC",
                    "name": "Wrapped BTC"
                },
                "amount": "24208"
            },
            "swaps": [
                {
                    "route": {
                        "pools": [
                            {
                                "protocol": "SUSHISWAP_V3",
                                "dexId": 0,
                                "tokenIn": {
                                    "address": "0x4200000000000000000000000000000000000006",
                                    "chainId": "10",
                                    "decimals": 18,
                                    "symbol": "WETH",
                                    "name": "Wrapped Ether"
                                },
                                "tokenOut": {
                                    "address": "0x68f180fcce6836688e9084f035309e29bf0a2095",
                                    "chainId": "10",
                                    "decimals": 8,
                                    "symbol": "Wrapped BTC",
                                    "name": "WBTC"
                                },
                                "address": "0x689A850F62B41d89B5e5C3465Cd291374B215813",
                                "swapParams": {
                                    "dexId": 0,
                                    "forkId": 1,
                                    "fee": 3000,
                                    "pool": "0x689A850F62B41d89B5e5C3465Cd291374B215813"
                                }
                            }
                        ],
                        "path": [
                            {
                                "address": "0x4200000000000000000000000000000000000006",
                                "chainId": "10",
                                "decimals": 18,
                                "symbol": "WETH",
                                "name": "Wrapped Ether"
                            },
                            {
                                "address": "0x68f180fcce6836688e9084f035309e29bf0a2095",
                                "chainId": "10",
                                "decimals": 8,
                                "symbol": "Wrapped BTC",
                                "name": "WBTC"
                            }
                        ]
                    },
                    "inputAmount": {
                        "currency": {
                            "address": "0x4200000000000000000000000000000000000006",
                            "chainId": "10",
                            "decimals": 18,
                            "symbol": "WETH",
                            "name": "Wrapped Ether"
                        },
                        "amount": "9474703411677713"
                    },
                    "outputAmount": {
                        "currency": {
                            "address": "0x68f180fcce6836688e9084f035309e29bf0a2095",
                            "chainId": "10",
                            "decimals": 8,
                            "symbol": "WBTC",
                            "name": "Wrapped BTC"
                        },
                        "amount": "24208"
                    }
                }
            ]
        },
        "approvalTarget": "0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72",
        "stringified": "",
        "flashLoanSource": "None",
        "inputAmountRealized": 0.009474703411677714,
        "outputAmountRealized": 0.00024208,
        "slippage": {
            "numerator": "60",
            "denominator": "10000",
            "isPercent": true
        }
    },
    "externalCall": {
        "callForwarder": "0xfCa1154C643C32638AEe9a43eeE7f377f515c801",
        "value": "0"
    },
    "account": "0x91ae002a960e63Ccb0E5bDE83A8C13E51e1cB91A",
    "marginData": {
        "irModeIn": 0,
        "irModeOut": 0,
        "marginTradeType": "CollateralSwap",
        "permitData": {
            "data": "0x0000000000000000000000000000000000000000000000000021b1cf4b8953ef6848d73c5b145e86384440efe6cf84efd21204ae69ad927fcc92bce4e74f754f86a8e0f7acefe09786da15537fdd1cee3c3ca5d5842217dd56607938259231bcff450651",
            "isPermit2": false
        },
        "lender": "AAVE_V3"
    },
    "isMaxIn": true,
    "isMaxOut": false,
    "composerOverride": "0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72",
    "slippageTolerance": "6000"
}