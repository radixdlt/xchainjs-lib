import { GatewayStatusResponse } from '@radixdlt/babylon-gateway-api-sdk'
import { Balance, Fees, Network, Tx, TxParams, XChainClientParams } from '@xchainjs/xchain-client/src'
import { Client } from '@xchainjs/xchain-radix/src'
import { Asset, baseAmount } from '@xchainjs/xchain-util'
import {
  mockCommittedDetailsResponse,
  mockEntityDetailsResponse,
  mockStreamTransactionsResponse,
  mockTransactionPreviewResponse,
} from '../__mocks__/mocks'
import { XrdAsset } from '../src/const'

describe('RadixClient Test', () => {
  const createDefaultRadixClient = (): Client => {
    const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
    const params: XChainClientParams = {
      network: Network.Mainnet,
      phrase: phrase,
      feeBounds: { lower: 1, upper: 5 },
    }
    return new Client(params, 'Secp256k1')
  }

  it('Invalid phrase is thrown', async () => {
    const phrase = 'rural bright ball negative already grass good grant nation screen model'
    const params: XChainClientParams = {
      network: Network.Mainnet,
      phrase: phrase,
    }
    expect(() => new Client(params, 'Ed25519')).toThrowError('Invalid phrase')
  })

  it('client should be able to get address', async () => {
    const radixClient = createDefaultRadixClient()
    const address: string = await radixClient.getAddressAsync()
    expect(address).toBe('account_rdx16yry7aw4h98vul6nn0svq6m82ne204cqxdk2rtqy7lphkgutwpamld')
  })

  it('client with Ed25519 curve should be able to get address', async () => {
    const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
    const params: XChainClientParams = {
      network: Network.Mainnet,
      phrase: phrase,
    }
    const radixClient = new Client(params, 'Ed25519')
    const address: string = await radixClient.getAddressAsync()
    expect(address).toBe('account_rdx129dw6f6zqtl3yxwusmw5tq93fnvcwpammdf0e0a8gn0pseepqxk0st')
  })

  it('client should throw an Error when using getAddress', () => {
    const radixClient = createDefaultRadixClient()
    expect(() => radixClient.getAddress()).toThrowError(
      'getAddress is synchronous and cannot retrieve addresses directly. Use getAddressAsync instead.',
    )
  })

  it('client should be able to get the network', async () => {
    const radixClient = createDefaultRadixClient()
    const network = radixClient.getNetwork()
    expect(network).toBe(Network.Mainnet)
  })

  it('client should be able to get the explorer url', async () => {
    const radixClient = createDefaultRadixClient()
    const explorerAddress = radixClient.getExplorerUrl()
    expect(explorerAddress).toBe('https://dashboard.radixdlt.com')
  })

  it('client should be able to get the explorer url for stokenet', async () => {
    const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
    const params: XChainClientParams = {
      network: Network.Stagenet,
      phrase: phrase,
    }
    const stokenetRadixClient = new Client(params, 'Secp256k1')
    const explorerAddress = stokenetRadixClient.getExplorerUrl()
    expect(explorerAddress).toBe('https://stokenet-dashboard.radixdlt.com')
  })

  it('client should be able to get an address url', async () => {
    const radixClient = createDefaultRadixClient()
    const address: string = await radixClient.getAddressAsync()
    const explorerAddress = radixClient.getExplorerAddressUrl(address)
    expect(explorerAddress).toBe(
      'https://dashboard.radixdlt.com/account/account_rdx16yry7aw4h98vul6nn0svq6m82ne204cqxdk2rtqy7lphkgutwpamld',
    )
  })

  it('client should be able to get a transaction url', async () => {
    const radixClient = createDefaultRadixClient()
    const explorerAddress = radixClient.getExplorerTxUrl(
      'txid_rdx1ggem7tu4nuhwm3lcc8z9jwyyp03l92pn9xfgjkdf0277hkr8fs6sudeks2',
    )
    expect(explorerAddress).toBe(
      'https://dashboard.radixdlt.com/transaction/txid_rdx1ggem7tu4nuhwm3lcc8z9jwyyp03l92pn9xfgjkdf0277hkr8fs6sudeks2',
    )
  })

  it('client should be able validate a valid address', async () => {
    const radixClient = createDefaultRadixClient()
    const address: string = await radixClient.getAddressAsync()
    const isValid = await radixClient.validateAddressAsync(address)
    expect(isValid).toBe(true)
  })

  it('client should fail to validate an invalid address', async () => {
    const radixClient = createDefaultRadixClient()
    const isValid = await radixClient.validateAddressAsync('invalid_address')
    expect(isValid).toBe(false)
  })

  it('client should throw an error when using validateAddress', async () => {
    const radixClient = createDefaultRadixClient()
    expect(() => radixClient.validateAddress()).toThrowError(
      'validateAddress is synchronous and cannot retrieve addresses directly. Use getAddressAsync instead.',
    )
  })

  it('client should be able to get transaction data for a given tx id', async () => {
    const radixClient = createDefaultRadixClient()
    const transactionCommittedDetailsMock = jest.fn().mockResolvedValue(mockCommittedDetailsResponse)
    radixClient.gatewayApiClient.transaction.innerClient.transactionCommittedDetails = transactionCommittedDetailsMock

    const transaction: Tx = await radixClient.getTransactionData(
      'txid_rdx195z9zjp43qvqk8fnzmnpazv5m7jsaepq6cnm5nnnn5p3m2573rvqamjaa8',
    )
    expect(transaction.from[0].from).toBe('account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg')
    expect(transaction.to[0].to).toBe('account_rdx16x47guzq44lmplg0ykfn2eltwt5wweylpuupstsxnfm8lgva7tdg2w')
  })

  it('client should be able to get balances for an account', async () => {
    const radixClient = createDefaultRadixClient()
    const entityDetailsResponseMock = jest.fn().mockResolvedValue(mockEntityDetailsResponse)
    radixClient.gatewayApiClient.state.innerClient.stateEntityDetails = entityDetailsResponseMock
    const balances: Balance[] = await radixClient.getBalance(
      'account_rdx16x47guzq44lmplg0ykfn2eltwt5wweylpuupstsxnfm8lgva7tdg2w',
      [],
    )
    balances.forEach((balance) => {
      expect(balance.amount.gte(0)).toBe(true)
    })
  })

  it('client should be able to get balances for an account with filtered assets', async () => {
    const radixClient = createDefaultRadixClient()
    const entityDetailsResponseMock = jest.fn().mockResolvedValue(mockEntityDetailsResponse)
    radixClient.gatewayApiClient.state.innerClient.stateEntityDetails = entityDetailsResponseMock
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
    const radixClient = createDefaultRadixClient()

    const getCurrentMock = jest.fn().mockResolvedValue({ ledger_state: { epoch: 123 } } as GatewayStatusResponse)
    radixClient.gatewayApiClient.status.getCurrent = getCurrentMock

    const transactionPreviewResponseMock = jest.fn().mockResolvedValue(mockTransactionPreviewResponse)
    radixClient.gatewayApiClient.transaction.innerClient.transactionPreview = transactionPreviewResponseMock

    const fees: Fees = await radixClient.getFees()
    expect(fees.average.gt(0)).toBe(true)
    expect(fees.fast.gt(0)).toBe(true)
    expect(fees.fastest.gt(0)).toBe(true)
  })

  it('client should be able to get transactions for a given account', async () => {
    const radixClient = createDefaultRadixClient()

    const streamTransactionsResponseMock = jest.fn().mockResolvedValue(mockStreamTransactionsResponse)
    radixClient.gatewayApiClient.stream.innerClient.streamTransactions = streamTransactionsResponseMock

    const transactionsHistoryParams = {
      address: 'account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg',
      offset: 72533720,
      limit: 200,
      asset: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
    }
    const txs = await (await radixClient.getTransactions(transactionsHistoryParams)).txs
    txs.forEach((tx) => {
      expect(tx.from).not.toBeUndefined()
      expect(tx.to).not.toBeUndefined()
    })
  })

  it('client should be able prepare a transaction', async () => {
    const radixClient = createDefaultRadixClient()
    const txParams: TxParams = {
      asset: XrdAsset,
      amount: baseAmount(1000),
      recipient: 'account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg',
    }
    const preparedTx = await radixClient.prepareTx(txParams)
    const expectedTransaction =
      '4d210220220441038000d1064f75d5b94ece7f539be0c06b6754f2a7d700336ca1ac04f7c37b238b0c086c6f636b5f6665652101850000f444829163450000000000000000000000000000000041038000d1064f75d5b94ece7f539be0c06b6754f2a7d700336ca1ac04f7c37b238b0c087769746864726177210280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6850000a0dec5adc93536000000000000000000000000000000000280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6850000a0dec5adc9353600000000000000000000000000000041038000d148b7923acafac9ccc1ab794cda7e000ebbf3f0f51e0d2460a19c7424140c147472795f6465706f7369745f6f725f61626f72742102810000000022000023202000'
    expect(preparedTx.rawUnsignedTx).toBe(expectedTransaction)
  })

  it('client should be able transfer', async () => {
    const radixClient = createDefaultRadixClient()
    const broadcastTxMock = jest.fn()
    radixClient.broadcastTx = broadcastTxMock
    const getCurrentMock = jest.fn().mockResolvedValue({ ledger_state: { epoch: 123 } } as GatewayStatusResponse)
    radixClient.gatewayApiClient.status.getCurrent = getCurrentMock
    const txParams: TxParams = {
      asset: XrdAsset,
      amount: baseAmount(1000),
      recipient: 'account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg',
    }
    const transferTransaction = await radixClient.transfer(txParams)
    expect(transferTransaction.startsWith('txid_rdx')).toBe(true)
    expect(broadcastTxMock).toBeCalledTimes(1)
  })

  it('client should be able broadcast tx', async () => {
    const radixClient = createDefaultRadixClient()
    const transactionSubmitMock = jest.fn()
    radixClient.gatewayApiClient.transaction.innerClient.transactionSubmit = transactionSubmitMock
    const transactionHex = ''
    await radixClient.broadcastTx(transactionHex)
    expect(radixClient.gatewayApiClient.transaction.innerClient.transactionSubmit).toBeCalledTimes(1)
  })
})
