import { NetworkId } from '@radixdlt/radix-engine-toolkit'
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
  [Network.Mainnet]: "m/44'/1022'/1'/525'/1460'/0'",
  [Network.Stagenet]: "m/44'/1022'/2'/525'/1460'/0'",
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

interface FeesEstimationParams {
  from: string
  to: string
  resourceAddress: string
  publicKey: string
}

export const feesEstimationPublicKeys: { [networkId: number]: FeesEstimationParams } = {
  [NetworkId.Mainnet]: {
    from: 'account_rdx16803fft0ppmre8cr48njz2mxr2ankuhn85k0r6yfhwapwe0qk0j2pg',
    to: 'account_rdx1685t40mreptjhs9g3pg9lgf7k7rgppzjeknjgrpc7d0sumcjrsw6kj',
    resourceAddress: XrdAssetMainnet.symbol,
    publicKey: '',
  },
  [NetworkId.Stokenet]: {
    from: 'account_tdx_2_1292a230ugrfdq96skhg92ccam3h6dv0kw707curmzel0d92ctqun5z',
    to: 'account_tdx_2_129wjagjzxltd0clr3q4z7hqpw5cc7weh9trs4e9k3zfwqpj636e5zf',
    resourceAddress: XrdAssetStokenet.symbol,
    publicKey: 'f926e5d67daa984375a86abbb305abc350c7dadba11d348c1cf4db27640c8d4e',
  },
}
