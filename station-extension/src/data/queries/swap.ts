import axios from "axios"
import { useQueries } from "react-query"
import { SQUID_SWAP_API } from "config/constants"
import {
  TokenData as SquidToken,
  ChainData as SquidChain,
} from "@0xsquid/sdk/dist/types"
import { useNetwork } from "data/wallet"

type SwapToken = SquidToken
type SwapChain = SquidChain
type SupportedSource = "squid"

const sources = {
  squid: {
    queryTokens: async () => {
      const result = await axios.get(SQUID_SWAP_API.routes.tokens, {
        baseURL: SQUID_SWAP_API.baseUrl,
        headers: { "x-integrator-id": SQUID_SWAP_API.integrationID },
      })
      return result.data
    },
    queryChains: async () => {
      const result = await axios.get(SQUID_SWAP_API.routes.chains, {
        baseURL: SQUID_SWAP_API.baseUrl,
        headers: {
          "x-integrator-id": SQUID_SWAP_API.integrationID,
        },
      })
      return result.data
    },
  },
}

export const useSwapTokens = (source: SupportedSource[]) => {
  const network = useNetwork()
  const res = useQueries(
    source.map((source) => ({
      queryKey: ["swapTokens", source],
      queryFn: async () => sources[source].queryTokens(),
    }))
  )
  const tokens = res
    .reduce(
      (acc, { data }) => (data ? [...data.tokens, ...acc] : acc),
      [] as SwapToken[]
    )
    .filter(
      ({ chainId }) =>
        typeof chainId === "string" && Object.keys(network).includes(chainId)
    )
  return tokens
}

export const useSwapChains = (source: SupportedSource[]) => {
  const network = useNetwork()
  const res = useQueries(
    source.map((source) => ({
      queryKey: ["swapChains", source],
      queryFn: async () => sources[source].queryChains(),
    }))
  )
  const chains = res
    .reduce(
      (acc, { data }) => (data ? [...data.chains, ...acc] : acc),
      [] as SwapChain[]
    )
    .filter(
      ({ chainId }) =>
        typeof chainId === "string" && Object.keys(network).includes(chainId)
    )
  return chains
}
