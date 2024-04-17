import { LTSRadixEngineToolkit, NetworkId, PublicKey, RadixEngineToolkit } from '@radixdlt/radix-engine-toolkit'
import {
  AssetInfo,
  Balance,
  BaseXChainClient,
  Fees,
  Network,
  PreparedTx,
  Tx,
  TxParams,
  TxsPage,
  XChainClientParams,
} from '@xchainjs/xchain-client'
import { Address, assetAmount, assetToBase } from '@xchainjs/xchain-util'

const axios = require('axios')
import { RadixChain } from './const'
import { EntityDetailsResponse, RadixAsset, RadixBalance, RadixTxResponse } from './types/radix'

/**
 * Custom Radix client
 */

class Client extends BaseXChainClient {
  publicKey: PublicKey
  /**
   * Constructor
   * Client has to be initialised with network type and public key.
   * @param {XChainClientParams} params
   */
  constructor({ network = Network.Mainnet }: XChainClientParams, publicKey: PublicKey) {
    super(RadixChain, { network })
    this.publicKey = publicKey
  }

  /**
   * Get transaction fees.
   *
   * @param {TxParams} params - The transaction parameters.
   * @returns {Fees} The average, fast, and fastest fees.
   * @throws {"Params need to be passed"} Thrown if parameters are not provided.
   */
  async getFees(params?: TxParams): Promise<Fees> {
    if (!params) throw new Error('Params need to be passed')
    const fees = await this.estimateFees()
    return fees
  }

  /**
   * Get the address for a given account.
   * @deprecated Use getAddressAsync instead.
   */
  getAddress(): string {
    throw new Error('getAddress is synchronous and cannot retrieve addresses directly. Use getAddressAsync instead.')
  }

  /**
   * Get the current address asynchronously for a given account.
   * @returns {Address} A promise resolving to the current address.
   * @throws {Error} Thrown if the phrase has not been set before.
   * A phrase is needed to create a wallet and to derive an address from it.
   */
  async getAddressAsync(): Promise<string> {
    const network = this.getNetwork()
    const networkId = network === Network.Mainnet ? NetworkId.Mainnet : NetworkId.Stokenet
    const address = await LTSRadixEngineToolkit.Derive.virtualAccountAddress(this.publicKey, networkId)
    return address.toString()
  }

  /**
   * Get the explorer URL based on the network.
   *
   * @returns {string} The explorer URL based on the network.
   */
  getExplorerUrl(): string {
    switch (this.getNetwork()) {
      case Network.Mainnet:
        return 'https://dashboard.radixdlt.com'
      case Network.Testnet:
        return 'https://stokenet-dashboard.radixdlt.com'
      default:
        throw new Error('Unsupported network')
    }
  }

  /**
   * Get the explorer URL for a given account address based on the network.
   * @param {Address} address The address to generate the explorer URL for.
   * @returns {string} The explorer URL for the given address.
   */
  getExplorerAddressUrl(address: Address): string {
    return `${this.getExplorerUrl()}/account/${address}`
  }

  /**
   * Get the explorer URL for a given transaction ID based on the network.
   * @param {string} txID The transaction ID to generate the explorer URL for.
   * @returns {string} The explorer URL for the given transaction ID.
   */
  getExplorerTxUrl(txID: string): string {
    return `${this.getExplorerUrl()}/transaction/${txID}`
  }

  /**
   *  Validate the given address.
   * @param {Address} address The address to validate.
   * @returns {boolean} `true` if the address is valid, `false` otherwise.
   */
  async validateAddressAsync(address: string): Promise<boolean> {
    try {
      await RadixEngineToolkit.Address.decode(address)
      return true
    } catch (error) {
      return false
    }
  }

  validateAddress(): boolean {
    throw new Error(
      'validateAddress is synchronous and cannot retrieve addresses directly. Use getAddressAsync instead.',
    )
  }

  getBalance(): Promise<Balance[]> {
    throw new Error('getBalance is not implemented. Use getRadixBalance instead')
  }

  filterByAssets(resource: any, assets: RadixAsset[]): boolean {
    return assets.length === 0 || assets.some((asset) => asset.resource_address === resource.resource_address)
  }

  /**
   * Retrieves the balances of a given address.
   * @param {Address} address - The address to retrieve the balance for.
   * @param {Asset[]} assets - Assets to retrieve the balance for (optional).
   * @returns {Promise<Balance[]>} An array containing the balance of the address.
   * @throws {"Invalid asset"} Thrown when the provided asset is invalid.
   */
  async getRadixBalance(address: Address, assets: RadixAsset[]): Promise<RadixBalance[]> {
    const url = 'https://mainnet.radixdlt.com/state/entity/details'
    const requestBody = {
      addresses: [address],
      aggregation_level: 'Global',
    }

    try {
      const response = await axios.post(url, requestBody)
      const entityDetails: EntityDetailsResponse = response.data
      return entityDetails.items.flatMap((item: any) => {
        const balances: RadixBalance[] = []
        // Check for fungible_resources
        if (item.fungible_resources && item.fungible_resources.items) {
          const fungibleBalances = item.fungible_resources.items
            .filter((resource: any) => this.filterByAssets(resource, assets))
            .map((resource: any) => ({
              asset: { resource_address: resource.resource_address },
              amount: assetToBase(assetAmount(resource.amount)),
            }))
          balances.push(...fungibleBalances)
        }
        // Check for non_fungible_resources
        if (item.non_fungible_resources && item.non_fungible_resources.items) {
          const nonFungibleBalances = item.non_fungible_resources.items
            .filter((resource: any) => this.filterByAssets(resource, assets))
            .map((resource: any) => ({
              asset: { resource_address: resource.resource_address },
              amount: assetToBase(assetAmount(resource.amount)),
            }))
          balances.push(...nonFungibleBalances)
        }
        return balances
      })
    } catch (error) {
      // Handle errors
      throw new Error('Failed to fetch transaction data')
    }
  }

  /**
   * Get transaction history of a given address with pagination options.
   * @param {TxHistoryParams} params The options to get transaction history. (optional)
   * @returns {TxsPage} The transaction history.
   */
  async getTransactions(): Promise<TxsPage> {
    throw new Error('Not implemented')
  }

  /**
   * Get the transaction details of a given transaction id.
   * @param {string} txId The transaction id.
   * @returns {Tx} The transaction details of the given transaction id.
   */
  async getTransactionData(): Promise<Tx> {
    throw new Error('getTransactionData is not implemented. Use getRadixTransactionData instead')
  }

  /**
   * Get the transaction details of a given transaction id.
   * @param {string} txId The transaction id.
   * @returns {RadixTxResponse} The transaction details of the given transaction id.
   */
  async getRadixTransactionData(txId: string): Promise<RadixTxResponse> {
    const url = 'https://mainnet.radixdlt.com/transaction/committed-details'
    const requestBody = {
      intent_hash: txId,
    }

    try {
      const response = await axios.post(url, requestBody)
      const transactionData: RadixTxResponse = response.data
      return transactionData
    } catch (error) {
      // Handle errors
      throw new Error('Failed to fetch transaction data')
    }
  }

  async transfer(): Promise<string> {
    throw new Error('Not implemented')
  }

  async broadcastTx(): Promise<string> {
    throw new Error('Not implemented')
  }

  getAssetInfo(): AssetInfo {
    throw new Error('Method not implemented.')
  }

  async prepareTx(): Promise<PreparedTx> {
    throw new Error('Not implemented')
  }

  async estimateFees(): Promise<Fees> {
    throw new Error('Not implemented')
  }
}

export { Client }
