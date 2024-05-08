import { Network, RootDerivationPaths } from '@xchainjs/xchain-client/lib'
import { Asset } from '@xchainjs/xchain-util/lib'

/**
 * Chain identifier for Radix.
 * This constant represents the identifier for the Radix Chain.
 */
export const RadixChain = 'RADIX' as const

export const MAINNET_GATEWAY_URL = 'https://mainnet.radixdlt.com'
export const STOKENET_GATEWAY_URL = 'https://stokenet.radixdlt.com'

export const XRD_DECIMAL = 18

export const XrdAssetMainnet: Asset = {
  symbol: 'resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc',
  ticker: 'XRD',
  synth: false,
  chain: RadixChain,
}

export const XrdAssetStokenet: Asset = {
  symbol: 'resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc',
  ticker: 'XRD',
  synth: false,
  chain: RadixChain,
}

export const xrdRootDerivationPaths: RootDerivationPaths = {
  [Network.Mainnet]: "m/44'/1022'/2'/525'/1460'/0'",
  [Network.Stagenet]: "m/44'/1022'/1'/525'/1460'/0'",
  [Network.Testnet]: "m/44'/1022'/12'/525'/1460'/0'",
}

export const bech32Networks: { [key: number]: string } = {
  1: 'rdx',
  2: 'tdx',
  3: 'tdx',
}

export const bech32Lengths: { [key: number]: number } = {
  1: 66,
  2: 69,
  3: 69,
}
