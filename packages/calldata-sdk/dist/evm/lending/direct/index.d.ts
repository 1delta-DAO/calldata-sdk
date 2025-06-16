import { Hex } from 'viem';
import { LendingOperation } from '..';
export declare namespace ComposerDirectLending {
    function composeDirectMoneyMarketAction(op: LendingOperation): {
        calldata: Hex;
        value: string | undefined;
    };
}
