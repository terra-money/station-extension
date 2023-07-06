import { atom, useRecoilState, useRecoilValue } from "recoil"
import { useNetworks } from "app/InitNetworks"
import { getStoredNetwork, storeNetwork } from "../scripts/network"
import { walletState } from "./useAuth"
import is from "../scripts/is"
import { useCustomLCDs } from "utils/localStorage"
import { NetworkName, ChainID, InterchainNetwork } from "types/network"

const networkState = atom({
  key: "network",
  default: getStoredNetwork(),
})

export const useNetworkState = () => {
  const [storedNetwork, setNetwork] = useRecoilState(networkState)

  const changeNetwork = (network: NetworkName) => {
    if (network !== storedNetwork) {
      setNetwork(network)
      storeNetwork(network)
    }
  }

  return [storedNetwork, changeNetwork] as const
}

/* helpers */
export const useNetworkOptions = () => {
  return [
    { value: "mainnet", label: "Mainnets" },
    { value: "testnet", label: "Testnets" },
    { value: "classic", label: "Terra Classic" },
    { value: "localterra", label: "LocalTerra" },
  ]
}

export const useNetwork = (): Record<ChainID, InterchainNetwork> => {
  const { networks, filterEnabledNetworks } = useNetworks()
  const [network] = useNetworkState()
  const wallet = useRecoilValue(walletState)
  const { customLCDs } = useCustomLCDs()

  function withCustomLCDs(networks: Record<ChainID, InterchainNetwork>) {
    return Object.fromEntries(
      Object.entries(networks ?? {}).map(([key, val]) => [
        key,
        { ...val, lcd: customLCDs[val?.chainID] || val.lcd },
      ]) ?? {}
    )
  }

  // multisig wallet are supported only on terra
  if (is.multisig(wallet)) {
    const terra = Object.values(
      withCustomLCDs(
        networks[network as NetworkName] as Record<ChainID, InterchainNetwork>
      ) ?? {}
    ).find(({ prefix }) => prefix === "terra")
    if (!terra) return {}
    return filterEnabledNetworks({ [terra?.chainID]: terra })
  }

  if (wallet && !wallet?.words?.["118"]) {
    const chains330 = Object.values(
      withCustomLCDs(
        networks[network as NetworkName] as Record<ChainID, InterchainNetwork>
      ) ?? {}
    ).filter(({ coinType }) => coinType === "330")

    return filterEnabledNetworks(
      chains330.reduce((acc, chain) => {
        acc[chain?.chainID] = chain
        return acc
      }, {} as Record<ChainID, InterchainNetwork>)
    )
  }

  return filterEnabledNetworks(withCustomLCDs(networks[network as NetworkName]))
}

export const useNetworkName = () => {
  const network = useRecoilValue(networkState)
  return network
}

export const useChainID = () => {
  const network = useRecoilValue(networkState)
  switch (network) {
    case "mainnet":
      return "phoenix-1"
    case "testnet":
      return "pisco-1"
    case "classic":
      return "columbus-5"
    case "localterra":
      return "localterra"
  }

  return ""
}
