import { GatewayStatusResponse } from '@radixdlt/babylon-gateway-api-sdk'
import { Balance, Fees, Network, Tx, TxParams, XChainClientParams } from '@xchainjs/xchain-client/src'
import { Asset, baseAmount } from '@xchainjs/xchain-util'
import {
  mockCommittedDetailsResponse,
  mockEntityDetailsResponse,
  mockStreamTransactionsResponse,
  mockTransactionPreviewResponse,
} from '../__mocks__/mocks'
import Client from '../src/client'
import { XrdAsset } from '../src/const'

describe('RadixClient Test', () => {
  const createClient = (): Client => {
    const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
    const params: XChainClientParams = {
      network: Network.Testnet,
      phrase: phrase,
      feeBounds: { lower: 1, upper: 5 },
    }
    return new Client(params, 'Ed25519')
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
    const client = createClient()
    const address: string = await client.getAddressAsync()
    expect(address).toBe('account_rdx129dw6f6zqtl3yxwusmw5tq93fnvcwpammdf0e0a8gn0pseepqxk0st')
  })

  it('client with Secp256k1 curve should be able to get address', async () => {
    const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
    const params: XChainClientParams = {
      network: Network.Mainnet,
      phrase: phrase,
    }
    const client = new Client(params, 'Secp256k1')
    const address: string = await client.getAddressAsync()
    expect(address).toBe('account_rdx16yry7aw4h98vul6nn0svq6m82ne204cqxdk2rtqy7lphkgutwpamld')
  })

  it('client should throw an Error when using getAddress', () => {
    const client = createClient()
    expect(() => client.getAddress()).toThrowError(
      'getAddress is synchronous and cannot retrieve addresses directly. Use getAddressAsync instead.',
    )
  })

  it('client with derive the same keys as wallet', async () => {
    const phrase = 'equip will roof matter pink blind book anxiety banner elbow sun young'
    const params: XChainClientParams = {
      network: Network.Testnet,
      phrase: phrase,
    }
    const client = new Client(params, 'Ed25519')
    // Reference: https://github.com/radixdlt/sargon/blob/0ffac13ece645c500fe74d2f854186c6340b4cd7/fixtures/vector/cap26_curve25519.json#L6
    expect(client.getRadixPrivateKey().publicKeyHex()).toBe(
      '451152a1cef7be603205086d4ebac0a0b78fda2ff4684b9dea5ca9ef003d4e7d',
    )
  })

  it('client with derive the same keys as wallet using a secp256k1 curve', async () => {
    const phrase = 'equip will roof matter pink blind book anxiety banner elbow sun young'
    const params: XChainClientParams = {
      network: Network.Testnet,
      phrase: phrase,
    }
    const client = new Client(params, 'Secp256k1')
    // Reference: https://github.com/radixdlt/sargon/blob/0ffac13ece645c500fe74d2f854186c6340b4cd7/fixtures/vector/cap26_secp256k1.json#L6
    expect(client.getRadixPrivateKey().publicKeyHex()).toBe(
      '029932e6683332a3c0d8cd2862c129e0c2501f45c17c88eecac27cc22baf7f80ed',
    )
  })

  it('client should be able to get the network', async () => {
    const client = createClient()
    const network = client.getNetwork()
    expect(network).toBe(Network.Mainnet)
  })

  it('client should be able to get the explorer url', async () => {
    const client = createClient()
    const explorerAddress = client.getExplorerUrl()
    expect(explorerAddress).toBe('https://dashboard.radixdlt.com')
  })

  it('client should be able to get the explorer url for stokenet', async () => {
    const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
    const params: XChainClientParams = {
      network: Network.Testnet,
      phrase: phrase,
    }
    const stokenetClient = new Client(params, 'Secp256k1')
    const explorerAddress = stokenetClient.getExplorerUrl()
    expect(explorerAddress).toBe('https://stokenet-dashboard.radixdlt.com')
  })

  it('client should be able to get an address url', async () => {
    const client = createClient()
    const address: string = await client.getAddressAsync()
    const explorerAddress = client.getExplorerAddressUrl(address)
    expect(explorerAddress).toBe(
      'https://dashboard.radixdlt.com/account/account_rdx129dw6f6zqtl3yxwusmw5tq93fnvcwpammdf0e0a8gn0pseepqxk0st',
    )
  })

  it('client should be able to get a transaction url', async () => {
    const client = createClient()
    const explorerAddress = client.getExplorerTxUrl(
      'txid_rdx1ggem7tu4nuhwm3lcc8z9jwyyp03l92pn9xfgjkdf0277hkr8fs6sudeks2',
    )
    expect(explorerAddress).toBe(
      'https://dashboard.radixdlt.com/transaction/txid_rdx1ggem7tu4nuhwm3lcc8z9jwyyp03l92pn9xfgjkdf0277hkr8fs6sudeks2',
    )
  })

  it('client should be able validate a valid address async', async () => {
    const client = createClient()
    const address: string = await client.getAddressAsync()
    const isValid = await client.validateAddressAsync(address)
    expect(isValid).toBe(true)
  })

  it('client should fail to validate an invalid address async', async () => {
    const client = createClient()
    const isValid = await client.validateAddressAsync('invalid_address')
    expect(isValid).toBe(false)
  })

  it('client should be able validate a valid address', async () => {
    const client = createClient()
    const address: string = await client.getAddressAsync()
    const isValid = client.validateAddress(address)
    expect(isValid).toBe(true)
  })

  test('Invalid address with incorrect prefix', () => {
    const invalidAddress = 'wrongprefix_xyz123'
    const client = createClient()
    expect(client.validateAddress(invalidAddress)).toBe(false)
  })

  test('Invalid address with incorrect network', () => {
    const client = createClient()
    const invalidAddress = 'account_wrongnetwork123'
    expect(client.validateAddress(invalidAddress)).toBe(false)
  })

  test('Invalid address with incorrect length', () => {
    const invalidAddress = 'account_xyz123invalidlength'
    const client = createClient()
    expect(client.validateAddress(invalidAddress)).toBe(false)
  })

  test('Invalid address with invalid characters', () => {
    const invalidAddress = 'account_xyz$%^123'
    const client = createClient()
    expect(client.validateAddress(invalidAddress)).toBe(false)
  })

  test('Invalid address with empty string', () => {
    const emptyAddress = ''
    const client = createClient()
    expect(client.validateAddress(emptyAddress)).toBe(false)
  })

  it('client should be able to get transaction data for a given tx id', async () => {
    const client = createClient()
    const transactionCommittedDetailsMock = jest.fn().mockResolvedValue(mockCommittedDetailsResponse)
    client.radixClient.gatewayClient.transaction.innerClient.transactionCommittedDetails =
      transactionCommittedDetailsMock

    const transaction: Tx = await client.getTransactionData(
      'txid_rdx195z9zjp43qvqk8fnzmnpazv5m7jsaepq6cnm5nnnn5p3m2573rvqamjaa8',
    )
    expect(transaction.from[0].from).toBe('account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg')
    expect(transaction.to[0].to).toBe('account_rdx16x47guzq44lmplg0ykfn2eltwt5wweylpuupstsxnfm8lgva7tdg2w')
  })

  it('client should be able to get balances for an account', async () => {
    const client = createClient()
    const entityDetailsResponseMock = jest.fn().mockResolvedValue(mockEntityDetailsResponse)
    client.radixClient.gatewayClient.state.innerClient.stateEntityDetails = entityDetailsResponseMock
    const balances: Balance[] = await client.getBalance(
      'account_rdx16x47guzq44lmplg0ykfn2eltwt5wweylpuupstsxnfm8lgva7tdg2w',
      [],
    )
    balances.forEach((balance) => {
      expect(balance.amount.gte(0)).toBe(true)
    })
  })

  it('client should be able to get balances for an account with filtered assets', async () => {
    const client = createClient()
    const entityDetailsResponseMock = jest.fn().mockResolvedValue(mockEntityDetailsResponse)
    client.radixClient.gatewayClient.state.innerClient.stateEntityDetails = entityDetailsResponseMock
    const assets: Asset[] = [
      {
        symbol: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
        ticker: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
        chain: 'radix',
        synth: false,
      },
    ]
    const balances: Balance[] = await client.getBalance(
      'account_rdx16x47guzq44lmplg0ykfn2eltwt5wweylpuupstsxnfm8lgva7tdg2w',
      assets,
    )
    expect(balances.length).toBe(1)
    expect(balances[0].asset.symbol).toBe('resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd')
  })

  it('client should be able to estimate the fee for a given transaction', async () => {
    const client = createClient()

    const getCurrentMock = jest.fn().mockResolvedValue({ ledger_state: { epoch: 123 } } as GatewayStatusResponse)
    client.radixClient.gatewayClient.status.getCurrent = getCurrentMock

    const transactionPreviewResponseMock = jest.fn().mockResolvedValue(mockTransactionPreviewResponse)
    client.radixClient.gatewayClient.transaction.innerClient.transactionPreview = transactionPreviewResponseMock

    const fees: Fees = await client.getFees()
    expect(fees.average.gt(0)).toBe(true)
    expect(fees.fast.gt(0)).toBe(true)
    expect(fees.fastest.gt(0)).toBe(true)
  })

  it('client should be able to get transactions for a given account', async () => {
    const client = createClient()

    const streamTransactionsResponseMock = jest.fn().mockResolvedValue(mockStreamTransactionsResponse)
    client.radixClient.gatewayClient.stream.innerClient.streamTransactions = streamTransactionsResponseMock

    const transactionsHistoryParams = {
      address: 'account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg',
      offset: 72533720,
      limit: 200,
      asset: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
    }
    const txs = await (await client.getTransactions(transactionsHistoryParams)).txs
    txs.forEach((tx) => {
      expect(tx.from).not.toBeUndefined()
      expect(tx.to).not.toBeUndefined()
    })
  })

  // const getCurrentEpoch = async (statusApi: StatusApi): Promise<number> =>
  //   statusApi.gatewayStatus().then((output) => output.ledger_state.epoch)

  // const submitTransaction = async (
  //   transactionApi: TransactionApi,
  //   compiledTransaction: Uint8Array,
  // ): Promise<TransactionSubmitResponse> =>
  //   transactionApi.transactionSubmit({
  //     transactionSubmitRequest: {
  //       notarized_transaction_hex: Convert.Uint8Array.toHexString(compiledTransaction),
  //     },
  //   })

  // it('client should be able prepare a transaction', async () => {
  //   const phraseOne = 'rural bright ball negative already grass good grant nation screen model pizza'
  //   const paramsOne: XChainClientParams = {
  //     network: Network.Testnet,
  //     phrase: phraseOne,
  //     feeBounds: { lower: 1, upper: 5 },
  //   }
  //   const clientOne = new Client(paramsOne, 'Ed25519')

  //   const apiConfiguration = new Configuration({
  //     basePath: 'https://stokenet.radixdlt.com',
  //   })
  //   const toAccount = await clientOne.getAddressAsync()
  //   const statusApi = new StatusApi(apiConfiguration)
  //   const currentEpoch = await getCurrentEpoch(statusApi)
  //   const freeXrdForAccountTransaction = await SimpleTransactionBuilder.freeXrdFromFaucet({
  //     networkId: 2,
  //     toAccount: toAccount,
  //     validFromEpoch: currentEpoch,
  //   })
  //   const transactionApi = new TransactionApi(apiConfiguration)

  //   // After the transaction has been built, we can get the transaction id (transaction hash) which is
  //   // the identifier used to get information on this transaction through the gateway.
  //   console.log('Transaction ID:', freeXrdForAccountTransaction.transactionId.id)

  //   // To submit the transaction to the Gateway API, it must first be compiled or converted from its
  //   // human readable format down to an array of bytes that can be consumed by the gateway. This can
  //   // be done by calling the compile method on the transaction object.

  //   const submissionResult = await submitTransaction(transactionApi, freeXrdForAccountTransaction.compiled)
  //   console.log('Transaction submission result:', submissionResult)
  // })

  it('client should be able prepare a transaction', async () => {
    const client = createClient()

    const phraseTwo = 'equip will roof matter pink blind book anxiety banner elbow sun young'
    const paramsTwo: XChainClientParams = {
      network: Network.Testnet,
      phrase: phraseTwo,
      feeBounds: { lower: 1, upper: 5 },
    }
    const clientTwo = new Client(paramsTwo, 'Ed25519')

    // const transactionPreviewResponseMock = jest.fn().mockResolvedValue(mockTransactionPreviewResponse)
    // client.radixClient.gatewayClient.transaction.innerClient.transactionPreview = transactionPreviewResponseMock

    const recipient = await clientTwo.getAddressAsync()
    const txParams: TxParams = {
      asset: XrdAsset,
      amount: baseAmount(1),
      recipient: recipient,
    }
    const preparedTx = await client.prepareTx(txParams)
    const expectedTransaction =
      '4d210220220441038000d1064f75d5b94ece7f539be0c06b6754f2a7d700336ca1ac04f7c37b238b0c086c6f636b5f6665652101850000f444829163450000000000000000000000000000000041038000d1064f75d5b94ece7f539be0c06b6754f2a7d700336ca1ac04f7c37b238b0c087769746864726177210280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6850000a0dec5adc93536000000000000000000000000000000000280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6850000a0dec5adc9353600000000000000000000000000000041038000d148b7923acafac9ccc1ab794cda7e000ebbf3f0f51e0d2460a19c7424140c147472795f6465706f7369745f6f725f61626f72742102810000000022000023202000'
    expect(preparedTx.rawUnsignedTx).toBe(expectedTransaction)
  })

  // it('client should be able transfer', async () => {
  //   const client = createClient()
  //   const broadcastTxMock = jest.fn()
  //   client.broadcastTx = broadcastTxMock
  //   const getCurrentMock = jest.fn().mockResolvedValue({ ledger_state: { epoch: 123 } } as GatewayStatusResponse)
  //   client.radixClient.gatewayClient.status.getCurrent = getCurrentMock
  //   const txParams: TxParams = {
  //     asset: XrdAsset,
  //     amount: baseAmount(1000),
  //     recipient: 'account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg',
  //   }
  //   const transferTransaction = await client.transfer(txParams)
  //   expect(transferTransaction.startsWith('txid_rdx')).toBe(true)
  //   expect(broadcastTxMock).toBeCalledTimes(1)
  // })

  // it('client should be able broadcast tx', async () => {
  //   const client = createClient()
  //   const transactionSubmitMock = jest.fn()
  //   client.radixClient.gatewayClient.transaction.innerClient.transactionSubmit = transactionSubmitMock
  //   const transactionHex =
  //     '4d22030221022104210707010a7b000000000000000a8500000000000000096cffe0ed22000120072102d80d1531c102a1bc9a36db6b91ac9dc8e58d19464297e49cc8e740d0f20cd55a010108000020220441038000d1064f75d5b94ece7f539be0c06b6754f2a7d700336ca1ac04f7c37b238b0c086c6f636b5f6665652101850000f444829163450000000000000000000000000000000041038000d1064f75d5b94ece7f539be0c06b6754f2a7d700336ca1ac04f7c37b238b0c087769746864726177210280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6850000a0dec5adc93536000000000000000000000000000000000280005da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6850000a0dec5adc9353600000000000000000000000000000041038000d148b7923acafac9ccc1ab794cda7e000ebbf3f0f51e0d2460a19c7424140c147472795f6465706f7369745f6f725f61626f72742102810000000022000020200022010121020c0a746578742f706c61696e2200010c00202200220001210120074100cf13f2fbc6ac595bbffea20740d43bd138902a99764fb792e347e04049c519565a46cd9221b9122c76df2d3ca79fd0cdf667a5c7d06b9c97ce1d61acb546e4ab'
  //   await client.broadcastTx(transactionHex)
  //   expect(client.radixClient.gatewayClient.transaction.innerClient.transactionSubmit).toBeCalledTimes(1)
  // })
})
