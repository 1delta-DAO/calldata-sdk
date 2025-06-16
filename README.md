# SDK for creating 1delta spot & margin trading calldata

1delta caldata builder for the following contracts.

```Typescript

export const FORWARDER = "0xfCa1154C643C32638AEe9a43eeE7f377f515c801"

export const COMPOSER_PROXIES = {
    [Chain.ARBITRUM_ONE]: "0x05f3f58716a88A52493Be45aA0871c55b3748f18",
    [Chain.OP_MAINNET]: "0xCDef0A216fcEF809258aA4f341dB1A5aB296ea72",
    [Chain.POLYGON_MAINNET]: "0xFd245e732b40b6BF2038e42b476bD06580585326",
    [Chain.BASE]: "0xB7ea94340e65CC68d1274aE483dfBE593fD6f21e",
    [Chain.SONIC_MAINNET]: "0x8E24CfC19c6C00c524353CB8816f5f1c2F33c201",
    [Chain.HEMI_NETWORK]: "0x79f4061BF049c5c6CAC6bfe2415c2460815F4ac7",
    [Chain.TAIKO_ALETHIA]: "0x594cE4B82A81930cC637f1A59afdFb0D70054232",
    [Chain.METIS_ANDROMEDA_MAINNET]: "0xCe434378adacC51d54312c872113D687Ac19B516",
    [Chain.GNOSIS]: "0xcb6eb8df68153cebf60e1872273ef52075a5c297",
    [Chain.AVALANCHE_C_CHAIN]: '0x8E24CfC19c6C00c524353CB8816f5f1c2F33c201',
    [Chain.MODE]: '0x8E24CfC19c6C00c524353CB8816f5f1c2F33c201',
    [Chain.SCROLL]: '0x8E24CfC19c6C00c524353CB8816f5f1c2F33c201',
    [Chain.CORE_BLOCKCHAIN_MAINNET]: "0x816EBC5cb8A5651C902Cb06659907A93E574Db0B",
    [Chain.FANTOM_OPERA]: "0x816EBC5cb8A5651C902Cb06659907A93E574Db0B",
    [Chain.BNB_SMART_CHAIN_MAINNET]: "0x816EBC5cb8A5651C902Cb06659907A93E574Db0B",
    [Chain.MANTLE]: "0x5c019a146758287c614fe654caec1ba1caf05f4e",
}

```

Example usage for depositing to Aave V3

```Typescript
// config for chain
const chainId = "10"
// the caller
const composer = COMPOSER_PROXIES[chainId]
// asset selected
const input = 1_000_000_000n // 1e9 (1000 USDC)
const depositAsset = {symbol: "USDC", name: "USDC", address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85", chainId} 
// caller
const account = "0x..."

const lender = "AAVE_V3"
const action = QuickActionType.Deposit
const operation = {
    params: { amount: { currency: depositAsset, amount: input } }, // amount params
    receiver: account, // the caller deposits on their own behalf
    isAll: false, // only used ofr withdraw & repy
    inIsNative: false, // use this to signal that one uses the native asset to deposit - the operation then wraps ETH
    outIsNative: false, // use this if the output needs to be wrapped (e.g. withdraw WETH and unwrap to ETH)
    composerAddress: composer, // composer
    permitData: undefined, // no permit
    morphoParams: undefined, // no morpho
    useOverride: undefined // we do not use a custom aave fork
}

const {calldata, value} = ComposerDirectLending.composeDirectMoneyMarketAction(operation)

```

Example usage for opening a position on Aave V3

```Typescript

// Exapmle for opening short on 1 WETH using USDC as collateral


const chainId = "10"
const composer = COMPOSER_PROXIES[chainId]
// the caller
const account = "0x..."
// operation is opening
const marginTradeType = "Open"
// the intended input amount
const input = 1_000_000_000_000_000_000n // 1e18
const assetIn = {symbol: "WETH", name: "WETH", address: "0x4200000000000000000000000000000000000006", chainId}
const assetOut = {symbol: "USDC", name: "USDC", address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85", chainId} 
// lender to use (check via `Lender` enum in asset-registry)
const lender = "AAVE_V3"
// step 1: fetch flash liquidity
// returns
//  [
//   {
//     "id": 0,
//     "name": "AAVE_V3",
//     "type": 2,
//     "source": "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
//     "fee": "5",
//     "availableRaw": "7742114549858607894570",
//     "available": 7742.11454985861
//   },
//   {
//     ...
//     ]
const assetLiquidities = await (await fetch(`https://lending.1delta.io/flashloan-asset/10/0x4200000000000000000000000000000000000006`)).json()
// we just pick the first, ideally the lowest fee one is selected.
const flashLoanSource = assetLiquidities[0]
// the flash loan fee is used to amend the quote input
const flashFee = BigInt(flashLoanSource.fee)

// step 2) fetch trade
// we have a 5 bps flash fee, we can therefore calculate the adjusted input to exactly borrow 1 ETH via
const amendedInput = (input * 10_000n) / (10_000n + flashFee)

// query an api of a swap provider
// important: send the funds to the composer contract
const apiBody = {..., amountIn: amendedInput, receiver: composer}
const apiReturn = await (await fetch(`https://www.quote.odos....`)).json()

// get calldata from api - this varies based on the provider 
const {calldata, target} = await (await fetch(`https://www.assemble.odos....`)).json()


// step 3) produce trade object inputs for SDK

const trade: GenericTrade = {
    tradeType: 0, // exact in
    inputAmount:  { currency: assetIn, amount: amendedInput},
    outputAmount:  { currency: assetOut, amount: apiReturn.output}, // the output is unsed in the calldata
    target,
    approvalTarget: target,
    // this needs to be set to `true` if `apiBody` does not allow to specify the receiver
    sweepToReceiver: false,
}

const externalCall = { 
    target, 
    calldata,
    value: "0", // this is the default value (only used for native as input)
    useSelfbalance: false,
    callForwarder: FORWARDER
}

const marginData =  {
  marginTradeType,
  // STABLE is deactivated for most aave forks
  irModeIn: AaveInterestMode.VARIABLE
  // unused
  irModeOut: AaveInterestMode.NONE
  lender,
  morphoParams: undefined, // no morpho execution
  permitData: undefined // no permits in this example
}

// this returns a bytes string for the 1delta composer
const composerOperation = ComposerMargin.createMarginFlashLoan({
    trade,
    externalCall,
    marginData,
    maxIn: false, // defualt value, only for non-open operations
    maxOut: false, // defualt value, only for non-open operations
    composerOverride: composer, // composer provided here
    flashInfoOverride: flashLoanSource // flash source info
})

// Note that ANY composer operation can be added beforehadn,e.g. 

// This is the calldata to be sent to the composer, e.g. ComposerDirectLending.composeDirectMoneyMarketAction(...)
// could be used to generate a deposit calldata set that can be added beforehand
const contractCall = encodeFunctionData({
  abi: composerAbi,
  functionName: 'deltaCompose',
  args: [composerOperation]
})

```