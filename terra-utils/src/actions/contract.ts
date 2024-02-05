import { getChains, createLCDClient } from "./network"

export const queryContract = async <IData>(
  address: string,
  queryMsg: Record<string, unknown>,
): Promise<IData> => {
  const chains = getChains()
  const lcd = createLCDClient(chains)

  if (!lcd) {
    throw new Error("LCD client not set")
  }

  const result = (await lcd.wasm.contractQuery(address, queryMsg)) as IData
  return result
}

export const executeContract = async () => {
  return "executeContract"
}
