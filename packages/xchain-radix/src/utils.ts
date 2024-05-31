import { Configuration, StatusApi, TransactionApi, TransactionSubmitResponse } from '@radixdlt/babylon-gateway-api-sdk'
import { Convert, SimpleTransactionBuilder } from '@radixdlt/radix-engine-toolkit'

const getCurrentEpoch = async (statusApi: StatusApi): Promise<number> =>
  statusApi.gatewayStatus().then((output: { ledger_state: { epoch: number } }) => output.ledger_state.epoch)

const submitTransaction = async (
  transactionApi: TransactionApi,
  compiledTransaction: Uint8Array,
): Promise<TransactionSubmitResponse> =>
  transactionApi.transactionSubmit({
    transactionSubmitRequest: {
      notarized_transaction_hex: Convert.Uint8Array.toHexString(compiledTransaction),
    },
  })

export const fund = async () => {
  const toAccount = 'account_tdx_2_12ya6ctt0yhdtlz086kkdva6u3m40qtud7tu057mv37pfpjj5jqcl8e' // Read the toAccount parameter from command-line arguments
  if (!toAccount) {
    console.error('Please provide a toAccount address as a command-line argument.')
    process.exit(1)
  }

  const apiConfiguration = new Configuration({
    basePath: 'https://stokenet.radixdlt.com',
  })
  const statusApi = new StatusApi(apiConfiguration)
  const currentEpoch = await getCurrentEpoch(statusApi)
  const freeXrdForAccountTransaction = await SimpleTransactionBuilder.freeXrdFromFaucet({
    networkId: 2,
    toAccount: toAccount,
    validFromEpoch: currentEpoch,
  })
  const transactionApi = new TransactionApi(apiConfiguration)

  // After the transaction has been built, we can get the transaction id (transaction hash) which is
  // the identifier used to get information on this transaction through the gateway.
  console.log('Transaction ID:', freeXrdForAccountTransaction.transactionId.id)

  // To submit the transaction to the Gateway API, it must first be compiled or converted from its
  // human readable format down to an array of bytes that can be consumed by the gateway. This can
  // be done by calling the compile method on the transaction object.
  const submissionResult = await submitTransaction(transactionApi, freeXrdForAccountTransaction.compiled)
  console.log('Transaction submission result:', submissionResult)
}
