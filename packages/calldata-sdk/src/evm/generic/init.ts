import { encodeFunctionData } from 'viem'

export enum InitPosmanagerFunctions {
  NextNonces = 'nextNonces',
  Approve = 'approve',
}

export namespace PosManager {
  export const encodeNextNonces = (owner: string) => {
    return encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'nextNonces',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: InitPosmanagerFunctions.NextNonces,
      args: [owner],
    })
  }

  export const encodeApprove = (spender: string, posId: bigint | string) => {
    return encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'approve',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: InitPosmanagerFunctions.Approve,
      args: [spender, posId],
    })
  }
}

export enum InitCoreFunctions {
  SetPosMode = 'setPosMode',
}

export namespace InitCore {
  export const encodeSetPosMode = (posId: bigint | string, mode: number) => {
    return encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '_posId',
              type: 'uint256',
            },
            {
              internalType: 'uint16',
              name: '_mode',
              type: 'uint16',
            },
          ],
          name: 'setPosMode',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: InitCoreFunctions.SetPosMode,
      args: [posId, mode],
    })
  }
}
