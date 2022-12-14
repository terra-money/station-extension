import { atom, useRecoilState, useRecoilValue } from "recoil"
import { useNetworks } from "app/InitNetworks"
import { getStoredNetwork, storeNetwork } from "../scripts/network"
import useAuth from "./useAuth"
import is from "../scripts/is"

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
  const { wallet } = useAuth()

  // multisig wallet are supported only on terra
  if (is.multisig(wallet)) {
    const terra = Object.values(
      networks[network as NetworkName] as Record<ChainID, InterchainNetwork>
    ).find(({ prefix }) => prefix === "terra")
    if (!terra) return {}
    return { [terra.chainID]: terra }
  }

  return networks[network as NetworkName]
}

export const useNetworkName = () => {
  return useRecoilValue(networkState)
}

export const useChainID = () => {
  const name = useRecoilValue(networkState)
  return name === "mainnet" ? "phoenix-1" : "pisco-1"
}
