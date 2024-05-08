import {
  CommittedTransactionInfo,
  GatewayApiClient,
  GatewayStatusResponse,
  PublicKey,
  StateEntityDetailsRequest,
  StateEntityDetailsResponse,
  TransactionCommittedDetailsRequest,
  TransactionCommittedDetailsResponse,
  TransactionPreviewRequest,
  TransactionPreviewResponse,
} from '@radixdlt/babylon-gateway-api-sdk'
import {
  Convert,
  Curve,
  LTSRadixEngineToolkit,
  NetworkId,
  PrivateKey,
  RadixEngineToolkit,
  TransactionBuilder,
  TransactionManifest,
  generateRandomNonce,
} from '@radixdlt/radix-engine-toolkit'
import {
  AssetInfo,
  Balance,
  BaseXChainClient,
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
  singleFee,
} from '@xchainjs/xchain-client'
import { getSeed } from '@xchainjs/xchain-crypto/lib'
import { Address, Asset, baseAmount } from '@xchainjs/xchain-util'
import { bech32m } from 'bech32'
import BIP32Factory, { BIP32Interface } from 'bip32'
import { derivePath } from 'ed25519-hd-key'
import * as ecc from 'tiny-secp256k1'
// eslint-disable-next-line ordered-imports/ordered-imports
import {
  MAINNET_GATEWAY_URL,
  RadixChain,
  STOKENET_GATEWAY_URL,
  XRD_DECIMAL,
  XrdAsset,
  bech32Networks,
  xrdRootDerivationPaths,
} from './const'

const xChainJsNetworkToRadixNetworkId = (network: Network): number => {
  switch (network) {
    case Network.Mainnet:
    case Network.Stagenet:
      return NetworkId.Mainnet
    case Network.Testnet:
      return NetworkId.Stokenet
  }
}

const gatewayClient = (network: Network): GatewayApiClient => {
  const applicationName = 'xchainjs'
  return GatewayApiClient.initialize({
    networkId: xChainJsNetworkToRadixNetworkId(network),
    applicationName,
  })
}

/**
 * Custom Radix client
 */

export default class Client extends BaseXChainClient {
  gatewayApiClient: GatewayApiClient
  curve: Curve
  constructor(
    {
      network = Network.Mainnet,
      phrase,
      rootDerivationPaths = xrdRootDerivationPaths,
      feeBounds = {
        lower: 1,
        upper: 1,
      },
    }: XChainClientParams,
    curve: Curve,
  ) {
    super(RadixChain, {
      network: network,
      phrase: phrase,
      rootDerivationPaths: rootDerivationPaths,
      feeBounds: feeBounds,
    })
    this.curve = curve
    this.gatewayApiClient = gatewayClient(network)
  }

  setNetwork(network: Network): void {
    super.setNetwork(network)
    this.gatewayApiClient = gatewayClient(network)
  }

  /**
   * Get an estimated fee for a test transaction that involves sending
   * XRD from one account to another
   *
   * @returns {Fee} An estimated fee
   */
  async getFees(): Promise<Fees> {
    try {
      const txParams: TxParams = {
        asset: XrdAsset,
        amount: baseAmount(1),
        recipient: 'account_rdx1685t40mreptjhs9g3pg9lgf7k7rgppzjeknjgrpc7d0sumcjrsw6kj',
      }

      this.curve

      const publicKey: PublicKey = {
        key_hex: this.getRadixPrivateKey().publicKey().hexString(),
        key_type: this.curve === 'Secp256k1' ? 'EcdsaSecp256k1' : 'EddsaEd25519',
      }
      const txManifest = this.prepareTx(txParams)
      const gatewayStatusResponse: GatewayStatusResponse = await this.gatewayApiClient.status.getCurrent()
      const transactionPreviewRequest: TransactionPreviewRequest = {
        manifest: (await txManifest).rawUnsignedTx,
        start_epoch_inclusive: gatewayStatusResponse.ledger_state.epoch,
        end_epoch_exclusive: gatewayStatusResponse.ledger_state.epoch + 10,
        tip_percentage: 10,
        nonce: generateRandomNonce(),
        notary_is_signatory: true,
        notary_public_key: publicKey,
        flags: {
          use_free_credit: false,
          assume_all_signature_proofs: false,
          skip_epoch_check: true,
        },
        signer_public_keys: [],
      }
      const transactionPreviewResponse: TransactionPreviewResponse =
        await this.gatewayApiClient.transaction.innerClient.transactionPreview({
          transactionPreviewRequest: transactionPreviewRequest,
        })
      const receipt = transactionPreviewResponse.receipt as {
        status: string
        fee_summary: {
          execution_cost_units_consumed: number
          finalization_cost_units_consumed: number
          xrd_total_execution_cost: string
          xrd_total_finalization_cost: string
          xrd_total_royalty_cost: string
          xrd_total_storage_cost: string
          xrd_total_tipping_cost: string
        }
      }

      if (receipt.status !== 'Rejected') {
        const totalFees =
          parseFloat(receipt.fee_summary.xrd_total_execution_cost) +
          parseFloat(receipt.fee_summary.xrd_total_finalization_cost) +
          parseFloat(receipt.fee_summary.xrd_total_royalty_cost) +
          parseFloat(receipt.fee_summary.xrd_total_storage_cost) +
          parseFloat(receipt.fee_summary.xrd_total_tipping_cost)
        const decimalDiff = XRD_DECIMAL - 8
        // Adjust the fee rate to match radix decimal precision
        const feeRate1e18 = totalFees * 10 ** decimalDiff
        // Create the fee amount with the adjusted fee rate
        const fee = baseAmount(feeRate1e18, XRD_DECIMAL)
        return singleFee(FeeType.FlatFee, fee)
      } else {
        throw new Error('Preview transaction was Rejected')
      }
    } catch (error) {
      throw new Error('Failed to calculate the fees')
    }
  }

  getRadixNetwork(): number {
    return xChainJsNetworkToRadixNetworkId(this.getNetwork())
  }

  getPrivateKey(): Buffer {
    const seed = getSeed(this.phrase)
    let derivationPath
    if (this.rootDerivationPaths) {
      derivationPath = this.rootDerivationPaths[this.getNetwork()]
    } else {
      derivationPath = xrdRootDerivationPaths[this.getNetwork()]
    }

    if (this.curve === 'Ed25519') {
      const seedHex = seed.toString('hex')
      const keys = derivePath(derivationPath, seedHex)
      return keys.key
    } else {
      const bip32 = BIP32Factory(ecc)
      const node: BIP32Interface = bip32.fromSeed(seed)
      const child: BIP32Interface = node.derivePath(derivationPath)
      if (!child.privateKey) throw new Error('child does not have a privateKey')
      return child.privateKey
    }
  }

  getRadixPrivateKey(): PrivateKey {
    const privateKey = this.getPrivateKey()
    const privateKeyBytes = Uint8Array.from(privateKey)
    if (this.curve == 'Ed25519') {
      return new PrivateKey.Ed25519(privateKeyBytes)
    } else {
      return new PrivateKey.Secp256k1(privateKeyBytes)
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
    const networkId = this.getRadixNetwork()
    const radixPrivateKey = this.getRadixPrivateKey()
    const address = await LTSRadixEngineToolkit.Derive.virtualAccountAddress(radixPrivateKey.publicKey(), networkId)
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
      const decodedAddress = bech32m.decode(address)

      if (!decodedAddress.prefix.startsWith('account_')) {
        return false
      }

      const network = decodedAddress.prefix.split('_')[1]
      if (bech32Networks[this.getRadixNetwork()] !== network) {
        return false
      }

      if (address.length !== 66) {
        return false
      }

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
    const stateEntityDetailsRequest: StateEntityDetailsRequest = {
      addresses: [address],
      aggregation_level: 'Global',
    }
    try {
      const stateEntityDetailsResponse: StateEntityDetailsResponse =
        await this.gatewayApiClient.state.innerClient.stateEntityDetails({
          stateEntityDetailsRequest: stateEntityDetailsRequest,
        })
      return stateEntityDetailsResponse.items.flatMap((item: any) => {
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
    try {
      const transactionCommittedDetailsRequest: TransactionCommittedDetailsRequest = {
        intent_hash: txId,
        opt_ins: {
          raw_hex: true,
        },
      }
      const transactionCommittedDetailsResponse: TransactionCommittedDetailsResponse =
        await this.gatewayApiClient.transaction.innerClient.transactionCommittedDetails({
          transactionCommittedDetailsRequest: transactionCommittedDetailsRequest,
        })
      if (
        transactionCommittedDetailsResponse.transaction.raw_hex !== undefined &&
        transactionCommittedDetailsResponse.transaction.confirmed_at !== null &&
        transactionCommittedDetailsResponse.transaction.confirmed_at !== undefined &&
        transactionCommittedDetailsResponse.transaction.intent_hash !== undefined
      ) {
        const transaction: Tx = await this.convertTransactionFromHex(
          transactionCommittedDetailsResponse.transaction.raw_hex,
          transactionCommittedDetailsResponse.transaction.intent_hash,
          transactionCommittedDetailsResponse.transaction.confirmed_at,
        )
        return transaction
      } else {
        throw new Error('Incomplete transaction data received')
      }
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
    const transactionBinary = Convert.HexString.toUint8Array(transaction_hex)
    try {
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
            asset: { symbol: withdrawResource, ticker: withdrawResource, synth: false, chain: RadixChain },
          },
        ],
        to: [
          {
            to: depositAccount,
            amount: baseAmount(withdrawAmount),
            asset: { symbol: withdrawResource, ticker: withdrawResource, synth: false, chain: RadixChain },
          },
        ],
        date: confirmed_at,
        type: TxType.Transfer,
        hash: intent_hash,
        asset: { symbol: withdrawResource, ticker: withdrawResource, synth: false, chain: RadixChain },
      }
      return transaction
    } catch (error) {
      return {
        from: [],
        to: [],
        asset: XrdAsset,
        date: confirmed_at,
        type: TxType.Unknown,
        hash: intent_hash,
      }
    }
  }

  /**
   * Creates a transaction using the SimpleTransactionBuilder, signs it with the
   * private key and returns the signed hex
   * @param params - The transactions params
   * @returns A signed transaction hex
   */
  async transfer(params: TxParams, broadcastTx = true): Promise<string> {
    const networkId = this.getRadixNetwork()
    const radixPrivateKey = this.getRadixPrivateKey()

    if (params.asset == undefined) {
      params.asset = XrdAsset
    }

    const preparedTransaction = await this.prepareTx(params)
    const compiledTransactionManifest = await Convert.HexString.toUint8Array(preparedTransaction.rawUnsignedTx)
    const transactionManifest = await RadixEngineToolkit.TransactionManifest.decompile(
      compiledTransactionManifest,
      networkId,
    )
    try {
      const gatewayStatusResponse: GatewayStatusResponse = await this.gatewayApiClient.status.getCurrent()
      const notarizedTransaction = await TransactionBuilder.new().then((builder) =>
        builder
          .header({
            networkId: networkId,
            startEpochInclusive: gatewayStatusResponse.ledger_state.epoch,
            endEpochExclusive: gatewayStatusResponse.ledger_state.epoch + 10,
            nonce: generateRandomNonce(),
            notaryPublicKey: radixPrivateKey.publicKey(),
            notaryIsSignatory: true,
            tipPercentage: 0,
          })
          .plainTextMessage(params.memo ? params.memo : '')
          .manifest(transactionManifest)
          .notarize(radixPrivateKey),
      )

      const compiledTransaction = await RadixEngineToolkit.NotarizedTransaction.compile(notarizedTransaction)
      const compiledTransactionHex = Convert.Uint8Array.toHexString(compiledTransaction)

      if (broadcastTx) {
        await this.broadcastTx(compiledTransactionHex)
      }
      const transactionId = await RadixEngineToolkit.NotarizedTransaction.intentHash(notarizedTransaction)
      return transactionId.id
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
    await this.gatewayApiClient.transaction.innerClient.transactionSubmit({
      transactionSubmitRequest: {
        notarized_transaction_hex: txHex,
      },
    })
    const notarizedTransaction = await RadixEngineToolkit.NotarizedTransaction.decompile(
      Convert.HexString.toUint8Array(txHex),
    )
    const intentHash = await RadixEngineToolkit.NotarizedTransaction.intentHash(notarizedTransaction)
    return Convert.Uint8Array.toHexString(intentHash.hash)
  }

  /**
   * Prepares a transaction to be used by the transfer method
   * It will include a non signed transaction
   * @param params - The transaction params
   * @returns a PreparedTx
   */
  async prepareTx(params: TxParams): Promise<PreparedTx> {
    if (params.asset == undefined) {
      params.asset = XrdAsset
    }
    const fromAddress = await this.getAddressAsync()
    const stringManifest = `
    CALL_METHOD
      Address("${fromAddress}")
      "lock_fee"
      Decimal("${this.feeBounds.upper}");
    CALL_METHOD
      Address("${fromAddress}")
      "withdraw"
      Address("${params.asset.symbol}")
      Decimal("${params.amount.amount()}");
    TAKE_FROM_WORKTOP
      Address("${params.asset.symbol}")
      Decimal("${params.amount.amount()}")
      Bucket("xrd_payment");
    CALL_METHOD
      Address("${params.recipient}")
      "try_deposit_or_abort"
      Bucket("xrd_payment")
      None;
    `

    const transactionsManifest = {
      instructions: { kind: 'String', value: stringManifest },
      blobs: [],
    } as TransactionManifest
    const networkId = this.getRadixNetwork()
    try {
      const transactionIntent = await RadixEngineToolkit.TransactionManifest.compile(transactionsManifest, networkId)
      const transactionIntentHex = await Convert.Uint8Array.toHexString(transactionIntent)
      const preparedTx = {
        rawUnsignedTx: transactionIntentHex,
      }
      return preparedTx
    } catch (error) {
      throw new Error('Failed to transfer')
    }
  }

  /**
   * Get asset information.
   * @returns Asset information.
   */
  getAssetInfo(): AssetInfo {
    return {
      asset: XrdAsset,
      decimal: XRD_DECIMAL,
    }
  }
}

export { Client }
