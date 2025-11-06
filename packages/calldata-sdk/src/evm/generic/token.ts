import { encodeFunctionData, erc20Abi } from 'viem'

// import { VariableDebtTokenAbi } from '@/abis/aave/VariableDebtToken'

export enum TokenFunctions {
  Approve = 'approve',
  ApproveDelegation = 'approveDelegation',
  Allowance = 'allowance',
  isAllowed = 'isAllowed',
  isAuthorized = 'isAuthorized',
  getApproved = 'getApproved',
  borrowAllowance = 'borrowAllowance',
  balanceOf = 'balanceOf',
  Name = 'name',
  Nonces = 'nonces',
  Nonce = 'nonce',
  _Nonces = '_nonces',
  UserNonce = 'userNonce',
  GetNonce = 'getNonce',
  Eip712Domain = 'eip712Domain',
  Version = 'version',
  Permit = 'permit',
  ERC712_VERSION = 'ERC712_VERSION', // Polygon UChild Tokens - unused
}

export namespace UniversalToken {
  export const encodeApprove = (spender: string, amount: bigint | string) => {
    return encodeFunctionData({
      abi: erc20Abi,
      functionName: TokenFunctions.Approve,
      args: [spender, amount],
    })
  }

  export const encodeApproveDelegation = (spender: string, amount: bigint | string) => {
    return encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'delegatee',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'approveDelegation',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: TokenFunctions.ApproveDelegation,
      args: [spender, amount],
    })
  }
}
