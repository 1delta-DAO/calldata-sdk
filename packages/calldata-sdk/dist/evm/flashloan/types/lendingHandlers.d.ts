import { Address } from 'viem';
import { Lender } from '@1delta/asset-registry';
import { MarginData } from '../types';
import { ContractCallsContext } from '../../../utils';
import { MorphoParams } from '../../lending/types';
import { SerializedCurrency } from '@1delta/type-sdk';
import { PermitData } from '../..';
export interface HandleRepayParams {
    isMaxOut: boolean;
    lender: Lender;
    account: Address;
    repayAmount: string | bigint;
    marginData: MarginData;
    tokenOut: SerializedCurrency;
    context: ContractCallsContext;
    morphoParams: MorphoParams | undefined;
}
export interface HandleWithdrawParams {
    isMaxIn: boolean;
    lender: Lender;
    account: Address;
    tokenIn: SerializedCurrency;
    intermediate: Address;
    flashRepayBalanceHolder: Address;
    flashLoanAmountWithFee: string;
    context: ContractCallsContext;
    morphoParams: MorphoParams | undefined;
    permitData?: PermitData;
}
