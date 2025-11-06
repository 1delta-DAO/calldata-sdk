import { encodeFunctionData, parseAbi } from 'viem'

export enum CompoundV2Functions {
  UpdateDelegate = 'updateDelegate',
  ApprovedDelegates = 'approvedDelegates',
  ExchangeRateCurrent = 'exchangeRateCurrent',
  EnterMarkets = 'enterMarkets',
  ExitMarket = 'exitMarket',
  Borrow = 'borrow',
}

export namespace CompoundV2Lending {
  export const encodeUpdateDelegate = (spender: string, allow: boolean) => {
    return encodeFunctionData({
      abi: [
        {
          inputs: [
            { internalType: 'address', name: 'delegate', type: 'address' },
            { internalType: 'bool', name: 'approved', type: 'bool' },
          ],
          name: 'updateDelegate',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: CompoundV2Functions.UpdateDelegate,
      args: [spender, allow],
    })
  }

  export const encodeEnterMarkets = (cAsset: boolean, enable: boolean) => {
    if (enable)
      return encodeFunctionData({
        abi: [
          {
            inputs: [{ internalType: 'address[]', name: 'vTokens', type: 'address[]' }],
            name: 'enterMarkets',
            outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: CompoundV2Functions.EnterMarkets,
        args: [[cAsset]],
      })

    return encodeFunctionData({
      abi: [
        {
          inputs: [{ internalType: 'address', name: 'vTokenAddress', type: 'address' }],
          name: 'exitMarket',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: CompoundV2Functions.ExitMarket,
      args: [cAsset],
    })
  }

  export const encodeBorrow = (amount: string | bigint) => {
    if (!amount) throw new Error('CompoundV2 borrow: amount not provided')
    return encodeFunctionData({
      abi: parseAbi(['function borrow(uint256 amount) external returns (uint256)']),
      functionName: CompoundV2Functions.Borrow,
      args: [amount],
    })
  }
}
