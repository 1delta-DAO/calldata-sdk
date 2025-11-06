import { encodeFunctionData } from 'viem'

enum CometFunctions {
  Supply = 'supply',
  WithdrawTo = 'withdrawTo',
  Allow = 'allow',
}

export namespace CompoundV3Lending {
  export const encodeAllow = (spender: string, allow: boolean) => {
    return encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'manager',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'isAllowed_',
              type: 'bool',
            },
          ],
          name: 'allow',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: CometFunctions.Allow,
      args: [spender, allow],
    })
  }
}
