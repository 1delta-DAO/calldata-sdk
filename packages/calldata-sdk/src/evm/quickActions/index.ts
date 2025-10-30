import { CurrencyUtils, getChainIdFromTrade } from '../../utils'
import {
  ComposerLendingActions,
  packCommands,
  TransferToLenderType,
  getPermitAsset,
  getLenderData,
  isAaveType,
  QuickActionType,
  isNativeAddress,
  ShallowCurrencyAmount,
} from '../lending'
import { ComposerSpot, EVMCallParams, getComposerAddress, validateExactInputTrade } from '..'
import {
  SwapAndDepositParams,
  SwapAndRepayParams,
  BorrowAndSwapParams,
  WithdrawAndSwapParams,
  QuickActionParams,
} from './types'
import { Address, Hex } from 'viem'
import { encodePermit, encodeSweep, PermitIds, SweepType } from '@1delta/calldatalib'
import { handlePendle } from '../flashloan/margin/utils'

export * from './types' // Export types

export namespace ComposerQuickActions {
  function createSweepCalldata(tokenAddress: Address, receiver: Address): Hex {
    return encodeSweep(tokenAddress, receiver, 0n, SweepType.VALIDATE)
  }

  export function swapAndDeposit(params: SwapAndDepositParams): EVMCallParams {
    const { trade, slippageBps, receiver, lender, morphoParams, useOverride, externalCall, permitData, composer } =
      params
    validateExactInputTrade(trade)

    const chainId = getChainIdFromTrade(trade)
    const composerAddress = composer ?? getComposerAddress(chainId)

    // create spot calldata
    const swapCalldata = ComposerSpot.composeSpotCalldata({
      trade,
      slippageTolerance: slippageBps,
      receiver: composerAddress,
      composer: composerAddress,
      externalCall,
      permitData,
    })

    const depositAmount: ShallowCurrencyAmount = {
      currency: trade.outputAmount.currency,
      amount: '0',
    }

    const depositCalldata = ComposerLendingActions.createDeposit({
      receiver,
      amount: depositAmount,
      lender,
      morphoParams,
      transferType: TransferToLenderType.ContractBalance,
      useOverride,
    })

    // sweep any remaining output token
    const sweepCalldata = createSweepCalldata(trade.outputAmount.currency.address as Address, receiver)

    const pendleSweep = handlePendle(trade, receiver)

    const combinedCalldata = packCommands([swapCalldata.calldata, pendleSweep, depositCalldata, sweepCalldata])

    return {
      calldata: combinedCalldata,
      value: swapCalldata.value,
    }
  }

  export function swapAndRepay(params: SwapAndRepayParams): EVMCallParams {
    const {
      trade,
      slippageBps,
      receiver,
      lender,
      repayMaximum = false,
      aaveInterestMode,
      morphoParams,
      useOverride,
      externalCall,
      permitData,
      composer,
    } = params
    validateExactInputTrade(trade)
    const chainId = getChainIdFromTrade(trade)
    const composerAddress = composer ?? getComposerAddress(chainId)

    // create spot calldata
    const swapCalldata = ComposerSpot.composeSpotCalldata({
      trade,
      slippageTolerance: slippageBps,
      receiver: composerAddress,
      composer: composerAddress,
      externalCall,
      permitData,
    })

    const repayAmount: ShallowCurrencyAmount = {
      currency: trade.outputAmount.currency,
      amount: CurrencyUtils.getAmount(trade.outputAmount).toString(),
    }

    const repayCalldata = ComposerLendingActions.createRepay({
      receiver,
      amount: repayAmount,
      lender,
      aaveInterestMode,
      morphoParams,
      transferType: repayMaximum ? TransferToLenderType.UserBalance : TransferToLenderType.ContractBalance,
      useOverride,
    })

    // Add sweep for any remaining output tokens
    const sweepCalldata = createSweepCalldata(trade.outputAmount.currency.address as Address, receiver)

    const combinedCalldata = packCommands([swapCalldata.calldata, repayCalldata, sweepCalldata])

    return {
      calldata: combinedCalldata,
      value: swapCalldata.value,
    }
  }

  export function borrowAndSwap(params: BorrowAndSwapParams): EVMCallParams {
    const {
      trade,
      slippageBps,
      receiver,
      lender,
      aaveInterestMode,
      morphoParams,
      useOverride,
      externalCall,
      permitData,
      composer,
    } = params
    validateExactInputTrade(trade)

    // validate non-native as input
    if (isNativeAddress(trade.inputAmount.currency.address)) throw new Error('Borrow and swap for native not supported')

    const chainId = getChainIdFromTrade(trade)
    const composerAddress = composer ?? getComposerAddress(chainId)
    const lenderData = getLenderData(lender, chainId, trade.inputAmount.currency.address)

    const borrowAmount: ShallowCurrencyAmount = {
      currency: trade.inputAmount.currency,
      amount: CurrencyUtils.getAmount(trade.inputAmount).toString(),
    }

    // create permit calldata
    let permitCalldata: Hex = '0x'
    if (permitData) {
      const permitAsset = getPermitAsset(lenderData.group, lenderData, aaveInterestMode)
      if (permitAsset) {
        permitCalldata = encodePermit(
          BigInt(isAaveType(lenderData.group) ? PermitIds.AAVE_V3_CREDIT_PERMIT : PermitIds.ALLOW_CREDIT_PERMIT),
          permitAsset as Address,
          permitData.data as Hex
        )
      }
    }

    // borrow recipient depends on swap type
    const borrowReceiver = externalCall ? externalCall.callForwarder : composerAddress

    const borrowCalldata = ComposerLendingActions.createBorrow({
      receiver: borrowReceiver,
      amount: borrowAmount,
      lender,
      aaveInterestMode,
      morphoParams,
      useOverride,
    })

    // create spot calldata
    const swapCalldata = ComposerSpot.composeSpotCalldata({
      trade,
      slippageTolerance: slippageBps,
      receiver,
      composer: composerAddress,
      externalCall,
      // we already ensure that the contracts are funded
      skipFunding: true,
      // permits are not used here
      permitData: undefined,
    })

    // Sweep input (if any)
    const sweepInputCalldata = createSweepCalldata(trade.inputAmount.currency.address as Address, receiver)

    // Sweep output (if any)
    const sweepOutputCalldata = createSweepCalldata(trade.outputAmount.currency.address as Address, receiver)

    const combinedCalldata = packCommands([
      permitCalldata,
      borrowCalldata,
      swapCalldata.calldata,
      sweepInputCalldata,
      sweepOutputCalldata,
    ])

    return {
      calldata: combinedCalldata,
      value: 0n,
    }
  }

  export function withdrawAndSwap(params: WithdrawAndSwapParams): EVMCallParams {
    const {
      trade,
      slippageBps,
      receiver,
      lender,
      withdrawMaximum = false,
      morphoParams,
      useOverride,
      externalCall,
      permitData,
      composer,
    } = params
    validateExactInputTrade(trade)

    const chainId = getChainIdFromTrade(trade)
    const composerAddress = composer ?? getComposerAddress(chainId)
    const lenderData = getLenderData(lender, chainId, trade.inputAmount.currency.address)

    const withdrawAmount: ShallowCurrencyAmount = {
      currency: trade.inputAmount.currency,
      amount: CurrencyUtils.getAmount(trade.inputAmount).toString(),
    }

    // create permit calldata
    let permitCalldata: Hex = '0x'
    if (permitData) {
      const permitAsset = getPermitAsset(lenderData.group, lenderData)
      if (permitAsset) {
        permitCalldata = encodePermit(
          BigInt(isAaveType(lenderData.group) ? PermitIds.TOKEN_PERMIT : PermitIds.ALLOW_CREDIT_PERMIT),
          permitAsset as Address,
          permitData.data as Hex
        )
      }
    }

    // withdrawal recipient
    const withdrawReceiver =
      externalCall && !withdrawMaximum
        ? // native we also keep in the composer as it auto-attaches
          // at no additional cost
          isNativeAddress(trade.inputAmount.currency.address)
          ? composerAddress
          : externalCall.callForwarder
        : composerAddress

    const withdrawCalldata = ComposerLendingActions.createWithdraw({
      receiver: withdrawReceiver,
      amount: withdrawAmount,
      lender,
      transferType: withdrawMaximum ? TransferToLenderType.UserBalance : TransferToLenderType.Amount,
      morphoParams,
      useOverride,
    })

    // if we withdraw all and use an external aggregator, we need to split the funding
    // - trade amount to call forwarder
    // - sweep excess to receiver
    let transferToCallforwarder: Hex = '0x'
    if (externalCall && withdrawMaximum) {
      transferToCallforwarder = encodeSweep(
        trade.inputAmount.currency.address as any,
        externalCall.callForwarder,
        trade.inputAmount.amount as any,
        SweepType.AMOUNT
      )
    }

    // create spot calldata
    const swapCalldata = ComposerSpot.composeSpotCalldata({
      trade,
      slippageTolerance: slippageBps,
      receiver,
      composer: composerAddress,
      externalCall,
      // skip funding call as we already control this with the code above
      skipFunding: true,
      // permits are not used here
      permitData: undefined,
    })

    // sweep input (if any)
    const sweepInputCalldata = createSweepCalldata(trade.inputAmount.currency.address as Address, receiver)

    const combinedCalldata = packCommands([
      permitCalldata,
      withdrawCalldata,
      transferToCallforwarder,
      swapCalldata.calldata,
      sweepInputCalldata,
    ])

    return {
      calldata: combinedCalldata,
      value: 0n,
    }
  }

  export function composedQuickAction(params: QuickActionParams) {
    switch (params.quickActionType) {
      case QuickActionType.Deposit: {
        return swapAndDeposit(params)
      }
      case QuickActionType.Borrow: {
        return borrowAndSwap(params)
      }
      case QuickActionType.Repay: {
        return swapAndRepay({ ...params, repayMaximum: params.maximum })
      }
      case QuickActionType.Withdraw: {
        return withdrawAndSwap({ ...params, withdrawMaximum: params.maximum })
      }
    }
  }
}
