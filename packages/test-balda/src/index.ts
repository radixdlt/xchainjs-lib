import { Network, XChainClientParams } from '@xchainjs/xchain-client'
import { Client } from '@xchainjs/xchain-radix'

const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
const params: XChainClientParams = {
  network: Network.Testnet,
  phrase: phrase,
  feeBounds: { lower: 1, upper: 5 },
}

async function main() {
  const client = new Client(params, 'Ed25519')

  const transactionData = await client.getTransactionData(
    'txid_tdx_2_1fgw02h20l6k5wn627mqm7y9c5yhkfh8kj4q04ehtalkfxda856js47wxg7',
  )
  console.log(transactionData)
}

main().catch(console.error)
