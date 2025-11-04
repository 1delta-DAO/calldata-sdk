import { describe, expect, it } from 'vitest'
import { CompoundV2NativeLending } from '.'
import { initializeLenderData } from '@1delta/data-sdk'
import { zeroAddress } from 'viem'
import { Lender } from '@1delta/lender-registry'

const baseUrl = 'https://raw.githubusercontent.com/1delta-DAO/lender-metadata/main'

const compoundTokens = baseUrl + '/data/compound-v2-c-tokens.json'

async function fetchLenderMetaFromDirAndInitialize() {
  const { compoundV2TokensOverride } = await fetchLenderMetaFromDir()

  initializeLenderData({
    compoundV2TokensOverride,
  })
}

async function fetchLenderMetaFromDir() {
  const promises = [compoundTokens].map(async (a) => fetch(a).then(async (b) => await b.json()))

  const [compoundV2TokensOverride] = await Promise.all(promises)

  return {
    compoundV2TokensOverride,
  }
}

describe('Compound V2 borroiwng', () => {
  describe('Plain', () => {
    it('BNB', async () => {
      await fetchLenderMetaFromDirAndInitialize()
      const result = CompoundV2NativeLending.createCompoundV2Borrow({
        amount: {
          amount: 100n,
          currency: { address: zeroAddress, name: 'BNB', symbol: 'BNB', decimals: 18, chainId: '56' },
        },
        lender: Lender.VENUS,
      })
      expect(result.to).toBe('0xa07c5b74c9b40447a954e1466938b865b6bbea36')

      expect(result.data).toBe('0xc5ebeaec0000000000000000000000000000000000000000000000000000000000000064')
      expect(result.value).toBe('0')
    })
  })
})
