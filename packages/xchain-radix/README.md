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



## Service providers
