/** Only for Venus BNB Core*/

import { MarginTradeType } from '../types'
import { createFlashLoan } from '../utils'
import { FlashLoanProvider } from '../../../utils'
import { isNativeAddress, packCommands, UINT112_MAX } from '../../lending'
import { Chain } from '@1delta/chain-registry'
import {
  ComposerCommands,
  CompoundV2Selector,
  encodeApprove,
  encodeCompoundV2SelectorId,
  encodePacked,
  encodeSweep,
  encodeUnwrap,
  encodeWrap,
  LenderOps,
  SweepType,
} from '@1delta/calldatalib'
import { getLenderId, LenderGroups } from '@1delta/lender-registry'

interface MarginWrapper {
  chainId: string
  assetIn: string
  assetOut: string
  maxIn?: boolean
  amount: string | bigint
  operation: MarginTradeType
  composerAddress: string
  collateralTokenIn?: string
  collateralTokenOut?: string
  callerAddress: string
}

interface MarginWrapperWithWNative extends MarginWrapper {
  wnative: string
}

/** We hard-code lista here for simplicity */
const LISTA_BNB = '0x8F73b65B4caAf64FBA2aF91cC5D4a2A1318E5D8C'
// also hard-code the vTokens here
const VTOKENS: any = {
  '0x0000000000000000000000000000000000000000': '0xa07c5b74c9b40447a954e1466938b865b6bbea36',
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': '0x6bca74586218db34cdb402295796b79663d816e9',
}

// wbnb is the only supported case here
const WBNB = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'

export namespace VenusMarginWrapperOperations {
  /** safety validation */
  function validateVenus(assetIn: string, assetOut: string, chainId: string) {
    // for venus we only allow this for vbnb
    if (chainId !== Chain.BNB_SMART_CHAIN_MAINNET || (!isNativeAddress(assetIn) && !isNativeAddress(assetOut))) {
      throw new Error('Only Venus WBNB-BNB supported')
    }
  }

  /** we always flash loan from lista */
  function createListaLoan(wnative: string, amount: string | bigint, data: string) {
    return createFlashLoan(FlashLoanProvider.LISTA, {
      asset: wnative as any,
      amount: amount.toString(),
      type: 'Pool',
      data: data as any,
      flashloanId: 0, // Lista ID
      poolType: 0, // MB style
      pool: LISTA_BNB,
    })
  }

  // wrap BNB <-> WBNB on margin
  export function venusMarignWrapper(params: MarginWrapperWithWNative) {
    const { chainId, assetIn, assetOut, maxIn = false, amount, composerAddress, callerAddress, operation } = params

    validateVenus(assetIn, assetOut, chainId)

    const wnative = WBNB

    const assetInNormal = assetIn.toLowerCase()
    const assetOutNormal = assetOut.toLowerCase()
    if (assetInNormal !== wnative && assetOutNormal !== wnative) throw new Error('Assets are not wnative-native pair')

    // note that we always wrap or unwrap the entire balance
    // therefore not input sweep is needed when withdrwaing the maximum
    let wrap = '0x'
    let unwrap = '0x'
    const innerWrapOperation = isNativeAddress(assetIn)
      ? encodeWrap(0n, wnative as any) // native -> wnative
      : encodeUnwrap(wnative as any, composerAddress as any, 0n, SweepType.VALIDATE) // wnative -> native

    // output is native: unwrap flash loan amount
    if (isNativeAddress(assetOut)) {
      unwrap = encodeUnwrap(wnative as any, composerAddress as any, 0n, SweepType.VALIDATE)
    }

    // input is native: wrap when repaying
    if (isNativeAddress(assetIn)) {
      wrap = encodeWrap(0n, wnative as any)
    }

    let receive = '0x'
    let pay = '0x'
    let sweep = '0x'
    switch (operation) {
      case MarginTradeType.CollateralSwap: {
        // pull finds to repay flash loan
        receive = compoundV2Withdraw(assetIn, amount, maxIn, composerAddress)

        // mint to increase credit line
        pay = compoundV2Deposit(assetOut, callerAddress)
        break
      }
      case MarginTradeType.Close: {
        // pull finds to repay flash loan
        receive = compoundV2Withdraw(assetIn, amount, maxIn, composerAddress)

        // mint to increase credit line
        pay = compoundV2Repay(assetOut, callerAddress)

        // sweep leftovers
        sweep = sweepAmount(assetOut, callerAddress)
        break
      }
      case MarginTradeType.DebtSwap: {
        if (assetInNormal !== wnative) throw new Error('only wnatiove ca be borrowed')
        // pull finds to repay flash loan
        receive = compoundV2Borrow(assetIn, amount, composerAddress)

        // repay to increase credit line
        pay = compoundV2Repay(assetOut, callerAddress)

        // sweep leftovers
        sweep = sweepAmount(assetOut, callerAddress)
        break
      }
      case MarginTradeType.Open: {
        if (assetInNormal !== wnative) throw new Error('only wnatiove ca be borrowed')
        // pull finds to repay flash loan
        receive = compoundV2Borrow(assetIn, amount, composerAddress)

        // repay to increase credit line
        pay = compoundV2Deposit(assetOut, callerAddress)
        break
      }
      default:
        throw new Error('Unsupported')
    }

    const data = packCommands([
      unwrap, // optional unwrap (lista loan to native)
      pay,
      innerWrapOperation, // inner wrap
      receive,
      wrap, // optional wrap
      sweep, // operation dependent sweep
    ])

    // create  deternministic lista loan
    return createListaLoan(wnative, amount, data)
  }

  /** Simple withdraw function */
  function compoundV2Withdraw(asset: string, amount: string | bigint, isMax: boolean, composer: string) {
    const collateralToken = VTOKENS?.[asset.toLowerCase()]
    if (!collateralToken) throw new Error('Collateral token not provided')
    return encodePacked(
      ['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'],
      [
        ComposerCommands.LENDING,
        LenderOps.WITHDRAW,
        getLenderId(LenderGroups.CompoundV2),
        asset as any,
        isMax ? UINT112_MAX : BigInt(amount),
        composer,
        collateralToken,
      ]
    )
  }

  /** Simple withdraw function */
  function compoundV2Borrow(asset: string, amount: string | bigint, composer: string) {
    const collateralToken = VTOKENS?.[asset.toLowerCase()]
    if (!collateralToken) throw new Error('Collateral token not provided')
    return encodePacked(
      ['uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'],
      [
        ComposerCommands.LENDING,
        LenderOps.BORROW,
        getLenderId(LenderGroups.CompoundV2),
        asset as any,
        BigInt(amount),
        composer,
        collateralToken,
      ]
    )
  }

  /** Simple deposit function */
  function compoundV2Deposit(asset: string, account: string) {
    const collateralToken = VTOKENS?.[asset.toLowerCase()]
    if (!collateralToken) throw new Error('Collateral token not provided')
    return encodePacked(
      ['bytes', 'uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'],
      [
        isNativeAddress(asset) ? '0x' : encodeApprove(asset as any, collateralToken as any),
        ComposerCommands.LENDING,
        LenderOps.DEPOSIT,
        getLenderId(LenderGroups.CompoundV2),
        asset as any,
        encodeCompoundV2SelectorId(
          0n, // always everything
          // MINT_BEHALF for VENUS & forks, otherwise MINT
          !isNativeAddress(asset) ? CompoundV2Selector.MINT_BEHALF : CompoundV2Selector.MINT
        ),
        account as any,
        collateralToken as any,
      ]
    )
  }

  /** Simple deposit function */
  function compoundV2Repay(asset: string, account: string) {
    const collateralToken = VTOKENS?.[asset.toLowerCase()]
    if (!collateralToken) throw new Error('Collateral token not provided')
    return encodePacked(
      ['bytes', 'uint8', 'uint8', 'uint16', 'address', 'uint128', 'address', 'address'],
      [
        isNativeAddress(asset) ? '0x' : encodeApprove(asset as any, collateralToken as any),
        ComposerCommands.LENDING,
        LenderOps.REPAY,
        getLenderId(LenderGroups.CompoundV2),
        asset as any,
        UINT112_MAX, // try always max
        account as any,
        collateralToken as any,
      ]
    )
  }

  function sweepAmount(asset: string, account: string) {
    return encodeSweep(asset as any, account as any, 0n, SweepType.VALIDATE)
  }
}
