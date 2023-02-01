import { PropsWithChildren, useEffect, useState } from "react"
import axios from "axios"
import { STATION_ASSETS } from "config/constants"
import createContext from "utils/createContext"
import NetworkLoading from "./NetworkLoading"
import { incomingRequest } from "extension/utils"
import { randomAddress } from "utils/bech32"

export const [useNetworks, NetworksProvider] = createContext<{
  networks: InterchainNetworks
  filterEnabledNetworks: <T>(network: Record<string, T>) => Record<string, T>
  filterDisabledNetworks: <T>(network: Record<string, T>) => Record<string, T>
}>("useNetworks")

const InitNetworks = ({ children }: PropsWithChildren<{}>) => {
  const [networks, setNetworks] = useState<InterchainNetworks>()
  const [enabledNetworks, setEnabledNetworks] = useState<string[]>([])

  useEffect(() => {
    const fetchChains = async () => {
      const { data: chains } = await axios.get<InterchainNetworks>(
        "/chains.json",
        {
          baseURL: STATION_ASSETS,
        }
      )
      setNetworks(chains)
    }

    fetchChains()
  }, [])

  useEffect(() => {
    const testChains = async () => {
      if (!networks) return
      const testBase = {
        ...networks.mainnet,
        ...networks.testnet,
        ...networks.classic,
        //...networks.localterra,
      }

      // skip network check if there is an incoming request
      if (await incomingRequest()) {
        setEnabledNetworks(Object.keys(testBase))
        return
      }

      const stored = localStorage.getItem("enabledNetworks")
      const cached = stored && JSON.parse(stored)

      if (cached && cached.time > Date.now() - 10 * 60 * 1000) {
        setEnabledNetworks(cached.networks)
        return
      }

      const result = await Promise.all(
        Object.values(testBase).map(async (network) => {
          if (network.prefix === "terra") return network.chainID
          try {
            const { data } = await axios.get(
              `/cosmos/bank/v1beta1/balances/${randomAddress(network.prefix)}`,
              {
                baseURL: network.lcd,
                timeout: 3_000,
              }
            )
            return Array.isArray(data.balances) && network.chainID
          } catch (e) {
            console.error(e)
            return null
          }
        })
      )

      setEnabledNetworks(
        result.filter((r) => typeof r === "string") as string[]
      )
    }

    testChains()
  }, [networks])

  if (!networks || !enabledNetworks.length) return <NetworkLoading />

  return (
    <NetworksProvider
      value={{
        networks,
        filterEnabledNetworks: (networks) =>
          Object.fromEntries(
            Object.entries(networks).filter(
              ([chainID]) =>
                chainID === "localterra" || enabledNetworks.includes(chainID)
            )
          ),
        filterDisabledNetworks: (networks) =>
          Object.fromEntries(
            Object.entries(networks).filter(
              ([chainID]) => !enabledNetworks.includes(chainID)
            )
          ),
      }}
    >
      {children}
    </NetworksProvider>
  )
}

export default InitNetworks
