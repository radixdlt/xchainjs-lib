import { Network, RootDerivationPaths } from '@xchainjs/xchain-client/lib'
import { Asset } from '@xchainjs/xchain-util/lib'

/**
 * Chain identifier for Radix.
 * This constant represents the identifier for the Radix Chain.
 */
export const RadixChain = 'RADIX' as const

export const MAINNET_GATEWAY_URL = 'https://mainnet.radixdlt.com'
export const STOKENET_GATEWAY_URL = 'https://stokenet.radixdlt.com'

export const AssetXRD: Asset = {
  chain: RadixChain,
  symbol: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
  ticker: 'XRD',
  synth: false,
}

export const XRD_DECIMAL = 18

export const XrdAsset: Asset = {
  symbol: 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd',
  ticker: 'XRD',
  synth: false,
  chain: RadixChain,
}

export const xrdRootDerivationPaths: RootDerivationPaths = {
  [Network.Mainnet]: "m/44'/1022'/2'/525'/1460'/0'",
  [Network.Stagenet]: "m/44'/1022'/1'/525'/1460'/0'",
  [Network.Testnet]: "m/44'/1022'/1'/525'/1460'/0'",
}
