import { MarginData } from '..';
import { LenderData } from '../../lending';
import { Address } from 'viem';
import { ContractCallsContext, SwapObject } from '../../../utils';
/**
 * These are the lending inner callback lending datas
 *  The output has the following datas
 *   callIn     -> funding the swap
 *   callOut    -> handing swap output
 *   cleanup    -> cleanup of leftover output
 */
export declare function buildMarginInnerCall(trade: SwapObject, account: Address, marginData: MarginData, inLenderData: LenderData, outLenderData: LenderData, flashRepayBalanceHolder: string, intermediate: string, flashLoanAmountWithFee: string, isMaxIn: boolean, isMaxOut: boolean): {
    context: ContractCallsContext;
    safetySweep: string;
};
