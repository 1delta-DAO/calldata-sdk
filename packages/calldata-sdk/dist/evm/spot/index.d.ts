import { Address, Hex } from 'viem';
import { EVMCallParams } from '..';
import { ExternalCallParams, SpotCalldataParams } from './types';
export declare namespace ComposerSpot {
    /** Create data for call forwarder - add an optional approve call to it and psotCalldata (e.g. exit sweep) */
    function encodeExternalCallForCallForwarder(params: ExternalCallParams, approvalData?: {
        token: string;
        target: string;
    }, postCalldata?: string): Hex;
    function createSweepCalldata(tokenAddress: Address, receiver: Address): Hex;
    /** Trade with 1delta path or external aggregator */
    function composeSpotCalldata(params: SpotCalldataParams): EVMCallParams;
}
export * from './types';
