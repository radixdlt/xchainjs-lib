import { BaseAmount } from '@xchainjs/xchain-util/lib'

/**
 * Parameters for `/stream/transactions` endpoint
 * @see https://radix-babylon-gateway-api.redoc.ly/#operation/StreamTransactions
 */
export type GetTxsParams = {
  atLedgerState?: number
  fromLedgerState?: number
  cursor?: number
  limitPerPage?: number
  affectedGlobalEntitiesFilter?: []
}

type TransactionData = {
  transaction_status: string
  state_version: number
  epoch: number
  round: number
  round_timestamp: string
  payload_hash: string
  intent_hash: string
  fee_paid: string
  confirmed_at: string
  receipt: any
  manifest_classes: any
}

type LedgerState = {
  network: string
  state_version: number
  proposer_round_timestamp: string
  epoch: number
  round: number
}

type EntityDetails = {
  address: string
  fungible_resources: any
  non_fungible_resources: any
  metadata: any
  details: any
}

export type EntityDetailsResponse = {
  ledger_state: LedgerState
  items: EntityDetails[]
}

export type RadixTxResponse = {
  ledger_state: LedgerState
  transaction: TransactionData
}

export type RadixBalance = {
  asset: RadixAsset
  amount: BaseAmount
}

export type RadixAsset = {
  resource_address: string
}
