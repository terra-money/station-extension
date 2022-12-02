import { useMemo } from "react"
import { LCDClient } from "@terra-money/terra.js"
import { LCDClient as InterchainLCDClient } from "@terra-money/feather.js"
import { useChainID, useNetwork } from "data/wallet"

export const useLCDClient = () => {
  const network = useNetwork()
  const chainID = useChainID()

  const lcdClient = useMemo(
    () => new LCDClient({ ...network[chainID], URL: network[chainID].lcd }),
    [network, chainID]
  )

  return lcdClient
}

export const useInterchainLCDClient = () => {
  const network = useNetwork()

  const lcdClient = useMemo(() => new InterchainLCDClient(network), [network])

  return lcdClient
}
