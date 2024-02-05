import { LCDClient } from "@terra-money/feather.js"
import { InterchainNetwork } from "../types/network"
import { networks } from "../tempNetworks"

export const createLCDClient = (
  chainsConfig: Record<string, InterchainNetwork>
) => {
  if (Object.keys(chainsConfig).length < 1) throw new Error("No chains set")
  return new LCDClient(chainsConfig)
}

export const getChains = () => {
  return networks.mainnet as Record<string, InterchainNetwork>
}
