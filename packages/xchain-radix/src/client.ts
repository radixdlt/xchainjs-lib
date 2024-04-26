import { CommittedTransactionInfo, GatewayApiClient } from '@radixdlt/babylon-gateway-api-sdk'
import {
  LTSRadixEngineToolkit,
  NetworkId,
  PrivateKey,
  RadixEngineToolkit,
  SimpleTransactionBuilder,
} from '@radixdlt/radix-engine-toolkit'
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
  TxParams,
  TxType,
  TxsPage,
  XChainClientParams,
} from '@xchainjs/xchain-client'
import { getSeed } from '@xchainjs/xchain-crypto/lib'
import { Address, Asset, assetAmount, assetToBase, baseAmount } from '@xchainjs/xchain-util'
import axios from 'axios'
import {
  AssetXRD,
  KeyType,
  MAINNET_GATEWAY_URL,
  RadixChain,
  STATE_ENTITY_DETAILS_PATH,
  STOKENET_GATEWAY_URL,
  TRANSACTION_COMMITTED_DETAILS_PATH,
  TRANSACTION_CONSTRUCTION_PATH,
  TRANSACTION_PREVIEW_PATH,
  TRANSACTION_SUBMIT_PATH,
  TransferTransactionManifest,
  XRD_DECIMAL,
} from './const'
import { EntityDetailsResponse, Transaction } from './types/radix'

/**
 * Custom Radix client
 */

class Client extends BaseXChainClient {
  privateKey: PrivateKey
  gatewayApiClient: GatewayApiClient
  constructor(params: XChainClientParams, keyType: KeyType) {
    super(RadixChain, { network: params.network, phrase: params.phrase })
    const seed = getSeed(this.phrase)
    const hexString = seed.toString('hex').substring(0, 64)
    if (!seed || seed.length < 32) {
      throw new Error('Invalid seed provided')
    }
    let privateKey: PrivateKey
    if (keyType == KeyType.Ed25519) {
      privateKey = new PrivateKey.Ed25519(hexString)
    } else {
      privateKey = new PrivateKey.Secp256k1(hexString)
    }
    if (!privateKey) {
      throw new Error('Failed to generate private key')
    }
    this.privateKey = privateKey
    this.gatewayApiClient = GatewayApiClient.initialize({
      networkId: this.getRadixNetwork(),
      applicationName: 'xchainjs',
    })
  }
  /**
   * Get an estimated fee for a test transaction that involves sending
   * XRD from one account to another
   *
   * @returns {Fee} An estimated fee
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
            key_hex: this.privateKey.publicKey().hex(),
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

  getRadixNetwork(): number {
    const network = this.getNetwork()
    let networkId: number
    switch (network) {
      case Network.Mainnet:
        networkId = NetworkId.Mainnet
        break
      case Network.Testnet:
        networkId = NetworkId.InternalTestNet
        break
      case Network.Stagenet:
        networkId = NetworkId.Stokenet
        break
      default:
        networkId = NetworkId.Stokenet
        break
    }
    return networkId
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
    const networkId = this.getRadixNetwork()
    const address = await LTSRadixEngineToolkit.Derive.virtualAccountAddress(this.privateKey.publicKey(), networkId)
    return address.toString()
  }

  /**
   * Get the explorer URL based on the network.
   *
   * @returns {string} The explorer URL based on the network.
   */
  getExplorerUrl(): string {
    switch (this.getRadixNetwork()) {
      case NetworkId.Mainnet:
        return 'https://dashboard.radixdlt.com'
      case NetworkId.Stokenet:
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
    switch (this.getRadixNetwork()) {
      case NetworkId.Mainnet:
        return MAINNET_GATEWAY_URL
      case NetworkId.Stokenet:
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

  /**
   * Helper method to check if a resource is included in a list of assets
   * @param resource - The resource to be checked
   * @param assets - The list of assets whret the resource is included
   * @returns True if the resource is included in the assets list, False otherwise
   */
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
    let hasNextPage = true
    let nextCursor = undefined
    let committedTransactions: CommittedTransactionInfo[] = []
    const txList: TxsPage = { txs: [], total: 0 }

    while (hasNextPage) {
      const response = await this.gatewayApiClient.stream.innerClient.streamTransactions({
        streamTransactionsRequest: {
          affected_global_entities_filter: [params.address],
          limit_per_page: params.limit && params.limit > 100 ? 100 : params.limit,
          from_ledger_state: {
            state_version: params.offset,
          },
          manifest_resources_filter: [params.asset || ''],
          opt_ins: {
            raw_hex: true,
          },
          cursor: nextCursor,
        },
      })
      committedTransactions = committedTransactions.concat(response.items)
      if (response.next_cursor) {
        nextCursor = response.next_cursor
      } else {
        hasNextPage = false
      }
    }
    for (const txn of committedTransactions) {
      try {
        if (
          txn.raw_hex !== undefined &&
          txn.confirmed_at !== null &&
          txn.intent_hash !== undefined &&
          txn.confirmed_at !== undefined
        ) {
          const transaction: Tx = await this.convertTransactionFromHex(txn.raw_hex, txn.intent_hash, txn.confirmed_at)
          txList.txs.push(transaction)
        }
      } catch (error) {}
    }
    return txList
  }

  /**
   * Get the transaction details of a given transaction id.
   * This method uses LTSRadixEngineToolkit.Transaction.summarizeTransaction
   * to convert a transaction hex to a transaction summary. If the transaction was not built with
   * the SimpleTransactionBuilder, the method will fail to get the transaction data
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

  /**
   * Helper function to convert a transaction in hex, returned by the gateway to a Tx type
   * @param transaction_hex - The raw_hex returned by the gateway for a transaction id
   * @param confirmed_at - The confirmed_at date for the transaction
   * @param intent_hash - The transaction intent hash
   * @returns a transaction in Tx type
   */
  async convertTransactionFromHex(transaction_hex: string, intent_hash: string, confirmed_at: Date): Promise<Tx> {
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
      date: confirmed_at,
      type: TxType.Transfer,
      hash: intent_hash,
      asset: { symbol: withdrawResource, ticker: withdrawResource, synth: false, chain: 'radix' },
    }
    return transaction
  }

  /**
   * Creates a transaction using the SimpleTransactionBuilder, signs it with the
   * private key and returns the signed hex
   * @param params - The transactions params
   * @returns A signed transaction hex
   */
  async transfer(params: TxParams): Promise<string> {
    const networkId = this.network === Network.Mainnet ? NetworkId.Mainnet : NetworkId.Stokenet
    const transactionConstructionUrl = `${this.getGatewayUrl()}${TRANSACTION_CONSTRUCTION_PATH}`
    const fromAccount = await this.getAddressAsync()
    try {
      const constructionMetadataResponse = await axios.post(transactionConstructionUrl)
      const builder = await SimpleTransactionBuilder.new({
        networkId: networkId,
        validFromEpoch: constructionMetadataResponse.data.ledger_state.epoch,
        fromAccount: fromAccount,
        signerPublicKey: this.privateKey.publicKey(),
      })

      const transaction = await builder
        .transferFungible({
          toAccount: JSON.parse((await this.prepareTx(params)).rawUnsignedTx)['toAccount'],
          resourceAddress: JSON.parse((await this.prepareTx(params)).rawUnsignedTx)['resourceAddress'],
          amount: JSON.parse((await this.prepareTx(params)).rawUnsignedTx)['amount'],
        })
        .compileIntent()
        .compileNotarizedAsync(async (hash) => this.privateKey.signToSignature(hash))
      return transaction.toHex()
    } catch (error) {
      throw new Error('Failed to transfer')
    }
  }
  /**
   * Submits a transaction
   * @param txHex - The transaction hex build with the transfer method
   * @returns - The response from the gateway
   */
  async broadcastTx(txHex: string): Promise<string> {
    const url = `${this.getGatewayUrl()}${TRANSACTION_SUBMIT_PATH}`
    const requestBody = {
      notarized_transaction_hex: txHex,
    }

    try {
      const response = await axios.post(url, requestBody)
      return JSON.stringify(response.data)
    } catch (error) {
      throw new Error('Failed to broadcast tx')
    }
  }

  /**
   * Prepares a transaction to be used by the transfer method
   * It will include a non signed transaction
   * @param params - The transaction params
   * @returns a PreparedTx
   */
  async prepareTx(params: TxParams): Promise<PreparedTx> {
    if (params.asset == undefined) {
      throw new Error('asset can not be undefined')
    }
    const transaction = {
      toAccount: params.recipient,
      resourceAddress: params.asset.symbol,
      amount: params.amount.amount().toString(),
    }
    const prepareTx: PreparedTx = {
      rawUnsignedTx: JSON.stringify(transaction),
    }
    return prepareTx
  }

  /**
   * Get asset information.
   * @returns Asset information.
   */
  getAssetInfo(): AssetInfo {
    const assetInfo: AssetInfo = {
      asset: AssetXRD,
      decimal: XRD_DECIMAL,
    }
    return assetInfo
  }
}

export { Client }
