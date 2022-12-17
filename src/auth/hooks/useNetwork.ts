import { atom, useRecoilState, useRecoilValue } from "recoil"
import { useNetworks } from "app/InitNetworks"
import { getStoredNetwork, storeNetwork } from "../scripts/network"
import { walletState } from "./useAuth"
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
  const wallet = useRecoilValue(walletState)

  // multisig wallet are supported only on terra
  if (is.multisig(wallet)) {
    const terra = Object.values(
      networks[network as NetworkName] as Record<ChainID, InterchainNetwork>
    ).find(({ prefix }) => prefix === "terra")
    if (!terra) return {}
    return { [terra.chainID]: terra }
  }

  if (!wallet?.words?.["118"]) {
    const chains330 = Object.values(
      networks[network as NetworkName] as Record<ChainID, InterchainNetwork>
    ).filter(({ coinType }) => coinType === "330")

    return chains330.reduce((acc, chain) => {
      acc[chain.chainID] = chain
      return acc
    }, {} as Record<ChainID, InterchainNetwork>)
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
