import { ContractCallsContext, DebasedContractCallsContext, FlashLoanProvider } from '../../../utils';
export declare function needsFlashLoanAdjustment(provider?: FlashLoanProvider): boolean;
/** BPS denominator */
export declare const BPS = 10000n;
/** empty context */
export declare const NO_CONTEXT: ContractCallsContext;
/** empty context */
export declare const DEBASED_NO_CONTEXT: DebasedContractCallsContext;
