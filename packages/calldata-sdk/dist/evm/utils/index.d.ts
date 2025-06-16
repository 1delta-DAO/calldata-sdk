import { ChainIdLike } from '@1delta/type-sdk';
import { Address } from 'viem';
import { GenericTrade } from '../../utils';
export declare function getComposerAddress(chainId: ChainIdLike): Address;
export declare function validateExactInputTrade(trade: GenericTrade): void;
