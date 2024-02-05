import { CreateTxOptions, TxInfo } from "@terra-money/feather.js"
import { createLCDClient, getChains } from "./network"

export const pollTransactionStatus = async (
  txhash: string,
  chainId: string,
): Promise<TxInfo> => {
  const chains = getChains()
  const lcd = createLCDClient(chains)

  const timeout = 12000
  const interval = 1000
  let elapsed = 0

  while (elapsed < timeout) {
    try {
      const txInfoData = await lcd.tx.txInfo(txhash, chainId)
      if (txInfoData) {
        return txInfoData
      }
    } catch (error) {
      // handle errors for now, let them happen as that just means no tx yet
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
    elapsed += interval
  }
  throw new Error("Polling timed out")
}

export const simulateTx = async (sender: string, tx: CreateTxOptions) => {
  // simulate tx and return
  // add trys and error capturing
  const chains = getChains()
  const lcd = createLCDClient(chains)
  return await lcd.tx.create([{ address: sender }], tx)
}

export const estimatedGas = (tx: CreateTxOptions) => {
  // parse gas out of estimated gas
  // unsignedTx.auth_info.fee.gasLimit
  console.log(tx)
}
