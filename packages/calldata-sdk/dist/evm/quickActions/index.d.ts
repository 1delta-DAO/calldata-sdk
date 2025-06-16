import { EVMCallParams } from '..';
import { SwapAndDepositParams, SwapAndRepayParams, BorrowAndSwapParams, WithdrawAndSwapParams, QuickActionParams } from './types';
export * from './types';
export declare namespace ComposerQuickActions {
    function swapAndDeposit(params: SwapAndDepositParams): EVMCallParams;
    function swapAndRepay(params: SwapAndRepayParams): EVMCallParams;
    function borrowAndSwap(params: BorrowAndSwapParams): EVMCallParams;
    function withdrawAndSwap(params: WithdrawAndSwapParams): EVMCallParams;
    function composedQuickAction(params: QuickActionParams): EVMCallParams;
}
