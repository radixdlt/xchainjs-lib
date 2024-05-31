import { Network } from '@xchainjs/xchain-client'
import { assetAmount, assetToBase, assetToString, baseToAsset } from '@xchainjs/xchain-util'

import { Client } from '../src'
import { fund } from '../src/utils'

describe('e2e tests', () => {
  let clientSecp256k1: Client
  let clientEd25519: Client
  const phrase = 'secret merry chef deposit future view bone shadow rely sunset keep mixed'

  beforeAll(() => {
    clientEd25519 = new Client({
      network: Network.Testnet,
      phrase,
      curve: 'Ed25519',
    })
    clientSecp256k1 = new Client({
      network: Network.Testnet,
      phrase,
      curve: 'Secp256k1',
    })
  })

  it('Should get address', async () => {
    const addressEd25519 = await clientEd25519.getAddressAsync()
    const addressSecp256k1 = await clientSecp256k1.getAddressAsync()

    console.log({
      addressEd25519: addressEd25519,
      addressSecp256k1: addressSecp256k1,
    })
  })

  it('Should get fees', async () => {
    const fees = await clientEd25519.getFees()
    console.log(fees)
  })

  it('Should get address url', async () => {
    const url = clientEd25519.getExplorerAddressUrl(await clientEd25519.getAddressAsync())
    console.log({ url })
  })

  it('Should get transaction url', async () => {
    const url = clientEd25519.getExplorerTxUrl('txid_rdx19rx0k3pxm9kghdda8yd0jpnt0gv6qr5c40g83j6w5ayf6p0vj2eq4htfha')
    console.log({ url })
  })

  it('Should validate address', async () => {
    const valid = clientEd25519.validateAddress('account_rdx168nr5dwmll4k2x5apegw5dhrpejf3xac7khjhgjqyg4qddj9tg9v4d')
    console.log({ valid })
  })

  it('Should get balance', async () => {
    const balances = await clientEd25519.getBalance(
      'account_tdx_2_12927ya6vxtmhu8w0qkwtumw8kjmlv930agjzezfgg6yp3j6agn3gfc',
    )
    for (const balance of balances) {
      console.log(`${assetToString(balance.asset)} --> ${baseToAsset(balance.amount).amount().toString()}`)
    }
  })

  it('Should get transaction data', async () => {
    const transaction = await clientEd25519.getTransactionData(
      'txid_tdx_2_1qm9aqwnfqpxutfuqwhy4s3zjnxx97mkc82tnytw6tl25np2rl47s5me9q5',
    )
    console.log(transaction)
  })

  it('should get transaction history', async () => {
    const txs = await clientEd25519.getTransactions({
      address: 'account_tdx_2_12927ya6vxtmhu8w0qkwtumw8kjmlv930agjzezfgg6yp3j6agn3gfc',
      offset: 94150,
    })
    console.log(txs)
  })

  it('Should send transaction', async () => {
    const hash = await clientEd25519.transfer({
      recipient: 'account_tdx_2_12ywhfpfdlvmgahszz3tgg3xaj0q674e9h0xefmskgc2f7gw2rs7jmg',
      amount: assetToBase(assetAmount(1, 18)),
      memo: 'memo',
    })

    console.log({ hash })
  })
})

describe('Fund', () => {
  it('fund address', async () => {
    await fund()
  })
})
