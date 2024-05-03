# `@xchainjs/xchain-client`

Radix module for XChainJS clients

## Modules

- `client` - Custom client for communicating with the Radix Chain by using the [radix-engine-toolkit](https://github.com/radixdlt/typescript-radix-engine-toolkit/tree/main) and the [radix gateway api](https://radix-babylon-gateway-api.redoc.ly/)

- `types` - Typescript type defintions used by the client on top of the types defined by the [Typescript Gateway API SDK](https://www.npmjs.com/package/@radixdlt/babylon-gateway-api-sdk)

## Installation

```
yarn add @xchainjs/xchain-radix
```

## Examples

### Creating a radix client

```
import { Network, XChainClientParams } from '@xchainjs/xchain-client/lib'
import { Client } from '@xchainjs/xchain-radix'

const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
const params: XChainClientParams = {
  network: Network.Mainnet,
  phrase: phrase,
}
const client = new Client(params)
const assetInfo = client.getAssetInfo
console.log(assetInfo)
```

### Creating a transaction

```
import { Network, TxParams, XChainClientParams } from '@xchainjs/xchain-client/lib'
import { Client } from '@xchainjs/xchain-radix'
import { XrdAsset } from '@xchainjs/xchain-radix/src/const'
import { baseAmount } from '@xchainjs/xchain-util'

const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
const params: XChainClientParams = {
  network: Network.Mainnet,
  phrase: phrase,
}
const radixClient = new Client(params)

const txParams: TxParams = {
  asset: XrdAsset,
  amount: baseAmount(1000),
  recipient: 'account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg',
}
const transferTransaction = await radixClient.transfer(txParams)
console.log(transferTransaction)
```

### Getting a transaction data

```
import { Network, Tx, TxParams, XChainClientParams } from '@xchainjs/xchain-client/lib'
import { Client } from '@xchainjs/xchain-radix'
import { XrdAsset } from '@xchainjs/xchain-radix/src/const'
import { baseAmount } from '@xchainjs/xchain-util'

const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
const params: XChainClientParams = {
  network: Network.Mainnet,
  phrase: phrase,
}
const radixClient = new Client(params)

const txParams: TxParams = {
  asset: XrdAsset,
  amount: baseAmount(1000),
  recipient: 'account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg',
}
const transferTransaction = await radixClient.transfer(txParams)
const transaction: Tx = await radixClient.getTransactionData(transferTransaction)
console.log(transaction)
```

### Getting balances

```
import { Balance, Network, XChainClientParams } from '@xchainjs/xchain-client/lib'
import { Client } from '@xchainjs/xchain-radix'
import { Asset } from '@xchainjs/xchain-util/lib'

const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
const params: XChainClientParams = {
  network: Network.Mainnet,
  phrase: phrase,
}
const radixClient = new Client(params)
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
console.log(balances)
```

### Getting fees

```
import { Fees, Network, XChainClientParams } from '@xchainjs/xchain-client/lib'
import { Client } from '@xchainjs/xchain-radix'

const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
const params: XChainClientParams = {
  network: Network.Mainnet,
  phrase: phrase,
}
const radixClient = new Client(params)
const fees: Fees = await radixClient.getFees()
console.log(fees)
```

### Getting transactions history

```
import { Network, XChainClientParams } from '@xchainjs/xchain-client/lib'
import { Client } from '@xchainjs/xchain-radix'

const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
const params: XChainClientParams = {
  network: Network.Mainnet,
  phrase: phrase,
}
const radixClient = new Client(params)
const transactionsHistoryParams = {
  address: 'account_rdx169yt0y36etavnnxp4du5ekn7qq8thuls750q6frq5xw8gfq52dhxhg',
  offset: 72533720,
  limit: 200,
  asset: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
}
const txs = await (await radixClient.getTransactions(transactionsHistoryParams)).txs
console.log(txs)
```

## Service providers

This package uses the following service providers

| Function                    | Service               | Notes                                                                             | Rate limits                   |
| --------------------------- | --------------------- | --------------------------------------------------------------------------------- | ----------------------------- |
| Balances                    | Radix Network Gateway | https://radix-babylon-gateway-api.redoc.ly/#operation/StateEntityDetails          | x requests per IP per second. |
| Transaction history         | Radix Network Gateway | https://radix-babylon-gateway-api.redoc.ly/#operation/StreamTransactions          | x requests per IP per minute  |
| Transaction details by hash | Radix Network Gateway | https://radix-babylon-gateway-api.redoc.ly/#operation/TransactionCommittedDetails | x requests per IP per second  |
| Fees                        | Radix Network Gateway | https://radix-babylon-gateway-api.redoc.ly/#operation/TransactionPreview          | x requests per IP per second  |
| Transaction broadcast       | Radix Network Gateway | https://radix-babylon-gateway-api.redoc.ly/#operation/TransactionSubmit           | x requests per IP per second  |
| Transfer                    | Radix Network Gateway | https://radix-babylon-gateway-api.redoc.ly/#operation/TransactionSubmit           | x requests per IP per second  |
| Explorer                    | Dashboard             | https://dashboard.radixdlt.com/                                                   |                               |
