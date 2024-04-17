import { PrivateKey, PublicKey } from '@radixdlt/radix-engine-toolkit'
import { Network } from '@xchainjs/xchain-client/src'
import { getSeed } from '@xchainjs/xchain-crypto'
import { Client } from '@xchainjs/xchain-radix/src'
import { RadixAsset, RadixBalance, Transaction } from '../src/types/radix'

const axios = require('axios')

describe('RadixClient Test', () => {
  let radixClient: Client
  const params = {
    network: Network.Mainnet,
  }
  let publicKey: PublicKey

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
    const txData = await radixClient.getRadixTransactionData(
      'txid_rdx1ggem7tu4nuhwm3lcc8z9jwyyp03l92pn9xfgjkdf0277hkr8fs6sudeks2',
    )
    expect(txData.transaction.transaction_status).toBe('CommittedSuccess')
  })

  it('client should be able to get balances for an account', async () => {
    const balances: RadixBalance[] = await radixClient.getRadixBalance(
      'account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg',
      [],
    )
    const allBalancesGreaterThanZero = balances.every((balance) => balance.amount.gt(0))
    expect(allBalancesGreaterThanZero).toBe(true)
  })

  it('client should be able to get balances for an account with filtered assets', async () => {
    const assets: RadixAsset[] = [
      { resource_address: 'resource_rdx1th88qcj5syl9ghka2g9l7tw497vy5x6zaatyvgfkwcfe8n9jt2npww' },
    ]
    const balances: RadixBalance[] = await radixClient.getRadixBalance(
      'account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg',
      assets,
    )
    expect(balances.length).toBe(1)
    const allBalancesGreaterThanZero = balances.every((balance) => balance.amount.gt(0))
    expect(allBalancesGreaterThanZero).toBe(true)
    expect(balances[0].asset.resource_address).toBe(
      'resource_rdx1th88qcj5syl9ghka2g9l7tw497vy5x6zaatyvgfkwcfe8n9jt2npww',
    )
  })

  it('client should be able to estimate the fee for a given transaction', async () => {
    const constructionMetadataResponse = await axios.post('https://mainnet.radixdlt.com/transaction/construction')
    const transaction: Transaction = {
      manifest: `CALL_METHOD
    Address("account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg")
    "lock_fee_and_withdraw"
    Decimal("4")
    Address("resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd")
    Decimal("5000")
;
TAKE_FROM_WORKTOP
    Address("resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd")
    Decimal("5000")
    Bucket("bucket1")
;
CALL_METHOD
    Address("component_rdx1cputx5thrnh29mup6ajz0x7v90g4dznvxwzwzvd9ngg8tuqvqlxmlh")
    "swap"
    Bucket("bucket1")
    Address("resource_rdx1t4upr78guuapv5ept7d7ptekk9mqhy605zgms33mcszen8l9fac8vf")
;
ASSERT_WORKTOP_CONTAINS
    Address("resource_rdx1t4upr78guuapv5ept7d7ptekk9mqhy605zgms33mcszen8l9fac8vf")
    Decimal("0")
;
CALL_METHOD
    Address("account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;`,
      start_epoch_inclusive: constructionMetadataResponse.data.ledger_state.epoch,
      end_epoch_exclusive: constructionMetadataResponse.data.ledger_state.epoch + 10,
      tip_percentage: 10,
      nonce: Math.floor(Math.random() * 1000000),
      signer_public_keys: [
        {
          key_type: 'EddsaEd25519',
          key_hex: publicKey.hex(),
        },
      ],
      flags: {
        use_free_credit: true,
        assume_all_signature_proofs: false,
        skip_epoch_check: true,
      },
    }
    const fee = await radixClient.getTransactionFees(transaction)
    expect(fee.gt(0)).toBe(true)
  })
})
