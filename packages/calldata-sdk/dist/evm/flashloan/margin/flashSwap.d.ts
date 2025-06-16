import { Address, Hex } from 'viem';
import { HandleMarginParams } from '../types/marginHandlers';
export declare namespace ComposerFlashSwap {
    function createSweepCalldata(tokenAddress: Address, receiver: Address): Hex;
    /** Trade with 1delta path or external aggregator */
    function composeFlashSwapCalldata({ trade, account, marginData, isMaxIn, isMaxOut, slippageTolerance, composerOverride, }: HandleMarginParams): Hex;
}
