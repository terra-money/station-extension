import { atom, useRecoilState, useRecoilValue } from "recoil"
import { useNetworks } from "app/InitNetworks"
import { getStoredNetwork, storeNetwork } from "../scripts/network"

const networkState = atom({
  key: "network",
  default: getStoredNetwork(),
})

export const useNetworkState = () => {
  const [network, setNetwork] = useRecoilState(networkState)

  const changeNetwork = (network: NetworkName) => {
    setNetwork(network)
    storeNetwork(network)
  }

  return [network, changeNetwork] as const
}

/* helpers */
export const useNetworkOptions = () => {
  return [
    { value: "mainnet", label: "mainnet" },
    { value: "testnet", label: "testnet" },
  ]
}

export const useNetwork = (): Record<ChainID, InterchainNetwork> => {
  const networks = useNetworks()
  const network = useRecoilValue(networkState)

  return networks[network as NetworkName]
}

export const useNetworkName = () => {
  return useRecoilValue(networkState)
}

export const useChainID = () => {
  const name = useRecoilValue(networkState)
  return name === "mainnet" ? "phoenix-1" : "pisco-1"
}
