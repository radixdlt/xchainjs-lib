import { PrivateKey, PublicKey } from '@radixdlt/radix-engine-toolkit'
import { Fees, Tx } from '@xchainjs/xchain-client'
import { Balance, Network } from '@xchainjs/xchain-client/src'
import { getSeed } from '@xchainjs/xchain-crypto'
import { Client } from '@xchainjs/xchain-radix/src'
import { Asset } from '@xchainjs/xchain-util'
import MockAdapter from 'axios-mock-adapter'
import {
  mockCommittedDetailsResponse,
  mockConstructionMetadataResponse,
  mockEntityDetailsResponse,
  mockTransactionPreviewResponse,
} from './mocks'

const axios = require('axios')

describe('RadixClient Test', () => {
  let radixClient: Client
  const params = {
    network: Network.Mainnet,
  }
  let publicKey: PublicKey

  const mock = new MockAdapter(axios)
  mock.onPost('https://mainnet.radixdlt.com/transaction/committed-details').reply(200, mockCommittedDetailsResponse)
  mock.onPost('https://mainnet.radixdlt.com/state/entity/details').reply(200, mockEntityDetailsResponse)
  mock.onPost('https://mainnet.radixdlt.com/transaction/construction').reply(200, mockConstructionMetadataResponse)
  mock.onPost('https://mainnet.radixdlt.com/transaction/preview').reply(200, mockTransactionPreviewResponse)

  beforeEach(async () => {
    const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
    const seed = getSeed(phrase)
    const hexString = seed.toString('hex').substring(0, 64)
    const privateKey = new PrivateKey.Ed25519(hexString)
    publicKey = privateKey.publicKey()
    radixClient = new Client(params, publicKey)
  })

  it('client should be able to get address', async () => {
    const address: string = await radixClient.getAddressAsync()
    expect(address).toBe('account_rdx12y9k726av70uhv9zwshc3c3rtcrghag2635fyuqzmt93evev8nsc44')
  })

  it('client should throw an Error when using getAddress', () => {
    expect(() => radixClient.getAddress()).toThrowError(
      'getAddress is synchronous and cannot retrieve addresses directly. Use getAddressAsync instead.',
    )
  })

  it('client should be able to get the network', async () => {
    const network = radixClient.getNetwork()
    expect(network).toBe(Network.Mainnet)
  })

  it('client should be able to get the explorer url', async () => {
    const explorerAddress = radixClient.getExplorerUrl()
    expect(explorerAddress).toBe('https://dashboard.radixdlt.com')
  })

  it('client should be able to get the explorer url for stokenet', async () => {
    radixClient = new Client({ network: Network.Testnet }, publicKey)
    const explorerAddress = radixClient.getExplorerUrl()
    expect(explorerAddress).toBe('https://stokenet-dashboard.radixdlt.com')
  })

  it('client should be able to get an address url', async () => {
    const address: string = await radixClient.getAddressAsync()
    const explorerAddress = radixClient.getExplorerAddressUrl(address)
    expect(explorerAddress).toBe(
      'https://dashboard.radixdlt.com/account/account_rdx12y9k726av70uhv9zwshc3c3rtcrghag2635fyuqzmt93evev8nsc44',
    )
  })

  it('client should be able to get a transaction url', async () => {
    const explorerAddress = radixClient.getExplorerTxUrl(
      'txid_rdx1ggem7tu4nuhwm3lcc8z9jwyyp03l92pn9xfgjkdf0277hkr8fs6sudeks2',
    )
    expect(explorerAddress).toBe(
      'https://dashboard.radixdlt.com/transaction/txid_rdx1ggem7tu4nuhwm3lcc8z9jwyyp03l92pn9xfgjkdf0277hkr8fs6sudeks2',
    )
  })

  it('client should be able validate a valid address', async () => {
    const address: string = await radixClient.getAddressAsync()
    const isValid = await radixClient.validateAddressAsync(address)
    expect(isValid).toBe(true)
  })

  it('client should fail to validate an invalid address', async () => {
    const isValid = await radixClient.validateAddressAsync('invalid_address')
    expect(isValid).toBe(false)
  })

  it('client should throw an error when using validateAddress', async () => {
    expect(() => radixClient.validateAddress()).toThrowError(
      'validateAddress is synchronous and cannot retrieve addresses directly. Use getAddressAsync instead.',
    )
  })

  it('client should be able to get transaction data for a given tx id', async () => {
    const transaction: Tx = await radixClient.getTransactionData(
      'txid_rdx195z9zjp43qvqk8fnzmnpazv5m7jsaepq6cnm5nnnn5p3m2573rvqamjaa8',
    )
    expect(transaction.from[0].from).toBe('account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg')
    expect(transaction.to[0].to).toBe('account_rdx16x47guzq44lmplg0ykfn2eltwt5wweylpuupstsxnfm8lgva7tdg2w')
  })

  it('client should be able to get balances for an account', async () => {
    const balances: Balance[] = await radixClient.getBalance(
      'account_rdx16x47guzq44lmplg0ykfn2eltwt5wweylpuupstsxnfm8lgva7tdg2w',
      [],
    )
    balances.forEach((balance) => {
      expect(balance.amount.gte(0)).toBe(true)
    })
  })

  it('client should be able to get balances for an account with filtered assets', async () => {
    const assets: Asset[] = [
      {
        symbol: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
        ticker: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
        chain: 'radix',
        synth: false,
      },
    ]
    const balances: Balance[] = await radixClient.getBalance(
      'account_rdx16x47guzq44lmplg0ykfn2eltwt5wweylpuupstsxnfm8lgva7tdg2w',
      assets,
    )
    expect(balances.length).toBe(1)
    expect(balances[0].asset.symbol).toBe('resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd')
  })

  it('client should be able to estimate the fee for a given transaction', async () => {
    const fees: Fees = await radixClient.getFees()
    expect(fees.average.gt(0)).toBe(true)
    expect(fees.fast.gt(0)).toBe(true)
    expect(fees.fastest.gt(0)).toBe(true)
  })
})
