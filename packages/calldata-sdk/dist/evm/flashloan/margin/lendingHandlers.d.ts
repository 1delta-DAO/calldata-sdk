import { HandleRepayParams, HandleWithdrawParams } from '../types';
/**
 * Parametrize a repay transaction for margin.
 * Special cases:
 *    maximum out: needs sweep of output token to user in case we attempt to repay too much
 */
export declare function handleRepay(params: HandleRepayParams): import("../..").ContractCallsContext;
/**
 * Special case
 *  maximum in: - we withdraw the user balance to the contract
 *              - we handle the flash loan repayment
 *              - a sweep of excess deposits is added
 */
export declare function handleWithdraw(params: HandleWithdrawParams): import("../..").ContractCallsContext;
