import { PropsWithChildren, useEffect, useState } from "react"
import axios from "axios"
import { STATION_ASSETS } from "config/constants"
import createContext from "utils/createContext"
import NetworkLoading from "./NetworkLoading"
import extension from "extensionizer"
import { ExtensionStorage } from "../extension/utils"
import { isBytes, isSign } from "../extension/utils"
import { isNil } from "ramda"

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
              "cosmos/base/tendermint/v1beta1/node_info",
              {
                baseURL: network.lcd,
                timeout: 5_000,
              }
            )
            return "default_node_info" in data
              ? (data.default_node_info.network as string)
              : (data.node_info.network as string)
          } catch (e) {
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

  if (!networks || !enabledNetworks.length)
    return <NetworkLoading title="Connecting to available networks..." />

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

async function incomingRequest() {
  // Requests from storage
  // except for that is already success or failure
  return new Promise<boolean>((resolve) => {
    extension.storage?.local.get(
      ["connect", "post", "sign"],
      (storage: ExtensionStorage) => {
        const { connect = { allowed: [], request: [] } } = storage
        const { sign = [], post = [] } = storage
        const [connectRequest] = connect.request
        const signRequests = sign.filter(({ success }) => isNil(success))
        const postRequest = post.find(({ success }) => isNil(success))
        const signRequest = signRequests.find(isSign)
        const bytesRequest = signRequests.find(isBytes)

        return resolve(
          !!(connectRequest || postRequest || signRequest || bytesRequest)
        )
      }
    )
  })
}

export default InitNetworks
