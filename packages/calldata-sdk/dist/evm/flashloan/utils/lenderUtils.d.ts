import { Lender } from '@1delta/asset-registry';
import { ChainIdLike } from '@1delta/type-sdk';
export declare function isAaveV3Type(lender: Lender): boolean;
export declare function isAaveV2Type(lender: Lender): boolean;
export declare function isAave(lender: Lender): boolean;
export declare function isCompoundV3(lender: Lender): boolean;
export declare function isCompoundV2(lender: Lender): boolean;
export declare const getLenderAssets: (chainId: ChainIdLike | undefined, lendingProtocol?: Lender) => string[];
