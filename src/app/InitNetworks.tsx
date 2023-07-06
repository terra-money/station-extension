import { PropsWithChildren, useEffect, useState } from "react"
import axios from "axios"
import { STATION_ASSETS } from "config/constants"
import createContext from "utils/createContext"
import { useCustomChains, useCustomLCDs } from "utils/localStorage"
import { useValidNetworks } from "data/queries/tendermint"
import { WithFetching } from "components/feedback"
import { combineState } from "data/query"
import { InterchainNetworks } from "types/network"

export const [useNetworks, NetworksProvider] = createContext<{
  networks: InterchainNetworks
  networksLoading: boolean
  filterEnabledNetworks: <T>(network: Record<string, T>) => Record<string, T>
  filterDisabledNetworks: <T>(network: Record<string, T>) => Record<string, T>
}>("useNetworks")

const InitNetworks = ({ children }: PropsWithChildren<{}>) => {
  const [defaultNetworks, setNetworks] = useState<InterchainNetworks>()
  const { customLCDs } = useCustomLCDs()
  const { customChains } = useCustomChains()

  const networks = {
    mainnet: {
      ...customChains?.mainnet,
      ...defaultNetworks?.mainnet,
    },
    testnet: {
      ...customChains?.testnet,
      ...defaultNetworks?.testnet,
    },
    classic: {
      ...customChains?.classic,
      ...defaultNetworks?.classic,
    },
    localterra: {
      ...defaultNetworks?.localterra,
    },
  }

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

  const testBase = networks
    ? Object.values(
        {
          ...networks.mainnet,
          ...networks.testnet,
          ...networks.classic,
        } ?? {}
      ).map((chain) => {
        const lcd = customLCDs[chain?.chainID] ?? chain.lcd
        return { ...chain, lcd }
      })
    : []

  const validationResult = useValidNetworks(testBase)

  const validNetworks = validationResult.reduce(
    (acc, { data }) => (data ? [...acc, data] : acc),
    [] as string[]
  )
  const validationState = combineState(...validationResult)

  if (!networks) return null

  return (
    <WithFetching {...validationState} height={2}>
      {(progress) => (
        <NetworksProvider
          value={{
            networks,
            networksLoading: validationState.isLoading,
            filterEnabledNetworks: (networks) =>
              Object.fromEntries(
                Object.entries(networks ?? {}).filter(
                  ([chainID]) =>
                    chainID === "localterra" || validNetworks.includes(chainID)
                ) ?? {}
              ),
            filterDisabledNetworks: (networks) =>
              Object.fromEntries(
                Object.entries(networks ?? {}).filter(
                  ([chainID]) => !validNetworks.includes(chainID)
                ) ?? {}
              ),
          }}
        >
          {progress}
          {children}
        </NetworksProvider>
      )}
    </WithFetching>
  )
}

export default InitNetworks
