import { Address } from 'viem';
import { MarginData } from '../types';
import { ExternalCallParams, FlashLoanProvider, FlashLoanProviderData, GenericTrade } from '../..';
import { FlashLoanIds } from '@1delta/calldatalib';
export interface FlashInfo {
    data: FlashLoanProviderData;
    poolType: FlashLoanIds | undefined;
    provider: FlashLoanProvider;
    providerAddress?: string;
    balanceHolder?: string;
}
export interface HandleMarginParams {
    /** swap object */
    trade?: GenericTrade;
    /** call details for trade */
    externalCall?: ExternalCallParams;
    /** user operator address */
    account?: Address;
    /** margin info (trade type etc.) */
    marginData?: MarginData;
    /** maximum flags - isMaxIn: withdraw full collateral; isMaxOut: attempt to repay all debt */
    isMaxIn?: boolean;
    isMaxOut?: boolean;
    composerOverride?: string | undefined;
    /** Override flash info to not use a heuristic approach */
    flashInfoOverride?: FlashInfo | undefined;
    /** ignored for ext aggregators */
    slippageTolerance?: string;
}
