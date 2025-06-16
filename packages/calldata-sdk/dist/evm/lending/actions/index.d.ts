import { createBorrowParams, CreateDepositParams, CreateRepayParams, createWithdrawParams } from '../types';
export declare namespace ComposerLendingActions {
    function createDeposit(params: CreateDepositParams): `0x${string}`;
    function createWithdraw(params: createWithdrawParams): `0x${string}`;
    function createBorrow(params: createBorrowParams): `0x${string}`;
    function createRepay(params: CreateRepayParams): `0x${string}`;
}
