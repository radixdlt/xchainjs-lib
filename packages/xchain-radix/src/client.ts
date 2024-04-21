import { LTSRadixEngineToolkit, NetworkId, PublicKey, RadixEngineToolkit } from '@radixdlt/radix-engine-toolkit'
import {
  AssetInfo,
  Balance,
  BaseXChainClient,
  FeeOption,
  FeeType,
  Fees,
  Network,
  PreparedTx,
  Tx,
  TxHistoryParams,
  TxType,
  TxsPage,
  XChainClientParams,
} from '@xchainjs/xchain-client'
import { Address, Asset, assetAmount, assetToBase, baseAmount } from '@xchainjs/xchain-util'

const axios = require('axios')
import {
  MAINNET_GATEWAY_URL,
  RadixChain,
  STATE_ENTITY_DETAILS_PATH,
  STOKENET_GATEWAY_URL,
  STREAM_TRANSACTIONS_PATH,
  TRANSACTION_COMMITTED_DETAILS_PATH,
  TRANSACTION_CONSTRUCTION_PATH,
  TRANSACTION_PREVIEW_PATH,
  TransferTransactionManifest,
} from './const'
import { EntityDetailsResponse, Transaction } from './types/radix'

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
   * Get transaction an estimated fee for a given transaction
   *
   * @param {Transaction} transaction - The transaction to estimate the fee for
   * @returns {Fee} An estimated transaction fee
   */
  async getFees(): Promise<Fees> {
    const transactionPreviewUrl = `${this.getGatewayUrl()}${TRANSACTION_PREVIEW_PATH}`
    const transactionConstructionUrl = `${this.getGatewayUrl()}${TRANSACTION_CONSTRUCTION_PATH}`
    try {
      const constructionMetadataResponse = await axios.post(transactionConstructionUrl)
      const transaction: Transaction = {
        manifest: TransferTransactionManifest,
        start_epoch_inclusive: constructionMetadataResponse.data.ledger_state.epoch,
        end_epoch_exclusive: constructionMetadataResponse.data.ledger_state.epoch + 10,
        tip_percentage: 10,
        nonce: Math.floor(Math.random() * 1000000),
        signer_public_keys: [
          {
            key_type: 'EddsaEd25519',
            key_hex: this.publicKey.hex(),
          },
        ],
        flags: {
          use_free_credit: true,
          assume_all_signature_proofs: false,
          skip_epoch_check: true,
        },
      }
      const response = await axios.post(transactionPreviewUrl, transaction)
      const previewTransaction = response.data.receipt
      let totalFees = 0
      for (const key in previewTransaction.fee_summary) {
        if (!isNaN(parseFloat(previewTransaction.fee_summary[key])) && key.startsWith('xrd_total_')) {
          totalFees += parseFloat(previewTransaction.fee_summary[key])
        }
      }
      const estimatedFees: Fees = {
        type: FeeType.FlatFee,
        [FeeOption.Average]: assetToBase(assetAmount(totalFees)),
        [FeeOption.Fast]: assetToBase(assetAmount(totalFees)),
        [FeeOption.Fastest]: assetToBase(assetAmount(totalFees)),
      }
      return estimatedFees
    } catch (error) {
      throw new Error('Failed to calculate the fees')
    }
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
   * Get the Gateway URL based on the network.
   *
   * @returns {string} The explorer URL based on the network.
   */
  getGatewayUrl(): string {
    switch (this.getNetwork()) {
      case Network.Mainnet:
        return MAINNET_GATEWAY_URL
      case Network.Testnet:
        return STOKENET_GATEWAY_URL
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

  filterByAssets(resource: any, assets: Asset[]): boolean {
    return assets.length === 0 || assets.some((asset) => asset.symbol === resource.resource_address)
  }

  /**
   * Retrieves the balances of a given address.
   * @param {Address} address - The address to retrieve the balance for.
   * @param {Asset[]} assets - Assets to retrieve the balance for (optional).
   * @returns {Promise<Balance[]>} An array containing the balance of the address.
   */
  async getBalance(address: Address, assets: Asset[]): Promise<Balance[]> {
    const url = `${this.getGatewayUrl()}${STATE_ENTITY_DETAILS_PATH}`
    const requestBody = {
      addresses: [address],
      aggregation_level: 'Global',
    }

    try {
      const response = await axios.post(url, requestBody)
      const entityDetails: EntityDetailsResponse = response.data
      return entityDetails.items.flatMap((item: any) => {
        const balances: Balance[] = []
        // Check for fungible_resources
        if (item.fungible_resources && item.fungible_resources.items) {
          const fungibleBalances = item.fungible_resources.items
            .filter((resource: any) => this.filterByAssets(resource, assets))
            .map((resource: any) => ({
              asset: { symbol: resource.resource_address },
              amount: baseAmount(resource.amount),
            }))
          balances.push(...fungibleBalances)
        }
        // Check for non_fungible_resources
        if (item.non_fungible_resources && item.non_fungible_resources.items) {
          const nonFungibleBalances = item.non_fungible_resources.items
            .filter((resource: any) => this.filterByAssets(resource, assets))
            .map((resource: any) => ({
              asset: { symbol: resource.resource_address },
              amount: baseAmount(resource.amount),
            }))
          balances.push(...nonFungibleBalances)
        }
        return balances
      })
    } catch (error) {
      throw new Error('Failed to calculate balance')
    }
  }

  /**
   * Get transaction history of a given address with pagination options.
   * @param {TxHistoryParams} params The options to get transaction history. (optional)
   * @returns {TxsPage} The transaction history.
   */
  async getTransactions(params: TxHistoryParams): Promise<TxsPage> {
    const url = `${this.getGatewayUrl()}${STREAM_TRANSACTIONS_PATH}`
    const transactions = []

    try {
      let requestBody = this.constructRequestBody(params)
      let response = await axios.post(url, requestBody)

      while (response.data.items.length > 0) {
        for (const tx of response.data.items) {
          try {
            const transaction: Tx = await this.convertTransactionFromHex(tx.raw_hex, tx.confirmed_at, tx.intent_hash)
            transactions.push(transaction)
          } catch (error) {}
        }

        // If limit is greater than 100 and there are more transactions, fetch the next page
        if (params.limit && params.limit > 100 && response.data.next_cursor) {
          requestBody = this.constructRequestBody(params, response.data.next_cursor)
          response = await axios.post(url, requestBody)
        } else {
          break
        }
      }

      return { total: transactions.length, txs: transactions }
    } catch (error) {
      throw new Error('Failed to get transactions')
    }
  }

  private constructRequestBody(params: TxHistoryParams, cursor?: string) {
    const requestBody: any = {
      affected_global_entities_filter: [params.address],
      limit_per_page: params.limit && params.limit > 100 ? 100 : params.limit,
      manifest_resources_filter: [params.asset],
      from_ledger_state: {
        state_version: params.offset,
      },
      opt_ins: {
        raw_hex: true,
      },
    }

    if (cursor) {
      requestBody.cursor = cursor
    }

    return requestBody
  }

  /**
   * Get the transaction details of a given transaction id.
   * @param {string} txId The transaction id.
   * @returns {Tx} The transaction details of the given transaction id.
   */
  async getTransactionData(txId: string): Promise<Tx> {
    const url = `${this.getGatewayUrl()}${TRANSACTION_COMMITTED_DETAILS_PATH}`
    const requestBody = {
      intent_hash: txId,
      opt_ins: {
        manifest_instructions: true,
        raw_hex: true,
      },
    }

    try {
      const response = await axios.post(url, requestBody)
      const transaction: Tx = await this.convertTransactionFromHex(
        response.data.transaction.raw_hex,
        response.data.transaction.confirmed_at,
        response.data.transaction.intent_hash,
      )
      return transaction
    } catch (error) {
      throw new Error('Failed to fetch transaction data')
    }
  }

  async convertTransactionFromHex(transaction_hex: string, confirmed_at: string, intent_hash: string): Promise<Tx> {
    const binaryString = Buffer.from(transaction_hex, 'hex').toString('binary')
    const transactionBinary = new Uint8Array(binaryString.split('').map((char) => char.charCodeAt(0)))
    const transactionSummary = await LTSRadixEngineToolkit.Transaction.summarizeTransaction(transactionBinary)
    const withdrawAccount = Object.keys(transactionSummary.withdraws)[0]
    const depositAccount = Object.keys(transactionSummary.deposits)[0]
    const withdrawResource = Object.keys(transactionSummary.withdraws[withdrawAccount])[0]
    const withdrawAmount: number = transactionSummary.withdraws[withdrawAccount][withdrawResource].toNumber()

    const transaction: Tx = {
      from: [
        {
          from: withdrawAccount,
          amount: baseAmount(withdrawAmount),
          asset: { symbol: withdrawResource, ticker: withdrawResource, synth: false, chain: 'radix' },
        },
      ],
      to: [
        {
          to: depositAccount,
          amount: baseAmount(withdrawAmount),
          asset: { symbol: withdrawResource, ticker: withdrawResource, synth: false, chain: 'radix' },
        },
      ],
      date: new Date(confirmed_at),
      type: TxType.Transfer,
      hash: intent_hash,
      asset: { symbol: withdrawResource, ticker: withdrawResource, synth: false, chain: 'radix' },
    }
    return transaction
  }

  async transfer(): Promise<string> {
    throw new Error('Not implemented')
  }

  async broadcastTx(): Promise<string> {
    throw new Error('Not implemented')
  }

  async prepareTx(): Promise<PreparedTx> {
    throw new Error('Not implemented')
  }

  getAssetInfo(): AssetInfo {
    throw new Error('Method not implemented.')
  }
}

export { Client }
