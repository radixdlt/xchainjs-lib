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

type LedgerData = {
  network: string
  state_version: number
  proposer_round_timestamp: string
  epoch: number
  round: number
}

export type RadixTxResponse = {
  ledger_state: LedgerData
  transaction: TransactionData
}
