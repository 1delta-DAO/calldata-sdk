import { HandleMarginParams } from '../types/marginHandlers';
export declare namespace ComposerMargin {
    /**
     * Create a flash-loan nested margin trade
     * @param trade generic trade object
     * @param marginData margin info
     * @param isMaxIn maximum input
     * @param isMaxOut maximum output
     * @returns composer calldata
     */
    function createMarginFlashLoan({ trade, externalCall, account, marginData, isMaxIn, isMaxOut, composerOverride, flashInfoOverride, }: HandleMarginParams): `0x${string}`;
}
