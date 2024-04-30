import { Network, RootDerivationPaths } from '@xchainjs/xchain-client/lib'
import { Asset } from '@xchainjs/xchain-util/lib'

/**
 * Chain identifier for Radix.
 * This constant represents the identifier for the Radix Chain.
 */
export const RadixChain = 'RADIX' as const

export const TransferTransactionManifest = `CALL_METHOD
Address("account_rdx129u2xndsvv9y52y4lfw9kegnszygfus5fah9y0exawahdk83ak4xvl")
"lock_fee"
Decimal("0.596010036572999997")
;
CALL_METHOD
Address("account_rdx129u2xndsvv9y52y4lfw9kegnszygfus5fah9y0exawahdk83ak4xvl")
"withdraw"
Address("resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd")
Decimal("15")
;
TAKE_FROM_WORKTOP
Address("resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd")
Decimal("15")
Bucket("bucket1")
;
CALL_METHOD
Address("account_rdx129gdqkf3uh5y9y73d3yj9dgapwa2tr00zxtzy5q7tjw5dr6ygh703d")
"try_deposit_or_abort"
Bucket("bucket1")
Enum<0u8>()
;
`

export const MAINNET_GATEWAY_URL = 'https://mainnet.radixdlt.com'
export const STOKENET_GATEWAY_URL = 'https://stokenet.radixdlt.com'
export const TRANSACTION_PREVIEW_PATH = '/transaction/preview'
export const TRANSACTION_CONSTRUCTION_PATH = '/transaction/construction'
export const TRANSACTION_COMMITTED_DETAILS_PATH = '/transaction/committed-details'
export const TRANSACTION_SUBMIT_PATH = '/transaction/submit'
export const STATE_ENTITY_DETAILS_PATH = '/state/entity/details'
export const STREAM_TRANSACTIONS_PATH = '/stream/transactions'

export enum KeyType {
  Ed25519 = 'Ed25519',
  Secp256k1 = 'Secp256k1',
}

export const AssetXRD: Asset = {
  chain: RadixChain,
  symbol: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
  ticker: 'XRD',
  synth: false,
}

export const XRD_DECIMAL = 8

export const XrdAsset: Asset = {
  symbol: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
  ticker: 'XRD',
  synth: false,
  chain: RadixChain,
}

export const xrdRootDerivationPaths: RootDerivationPaths = {
  [Network.Mainnet]: "m/44'/1022'/1'/525'/1460'/0'",
  [Network.Stagenet]: "m/44'/1022'/2'/525'/1460'/0'",
  [Network.Testnet]: "m/44'/1022'/2'/525'/1460'/0'",
}