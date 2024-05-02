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
import { Client } from '@xchainjs/xchain-radix'

const phrase = 'rural bright ball negative already grass good grant nation screen model pizza'
const params: XChainClientParams = {
    network: Network.Mainnet,
    phrase: phrase,
}
const client = new Client(params)
```

### Creating a transaction
```
import { Client, XrdAsset } from '@xchainjs/xchain-radix'

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
import { Client, XrdAsset } from '@xchainjs/xchain-radix'

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

## Service providers
