import axios from "axios"
import { SQUID_SWAP_API } from "config/constants"

type SupportedSource = "squid" | "skip"

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

export const querySwapTokens = async (source: SupportedSource[]) => {
  const tokens = await Promise.all(
    source.map(async (source) => {
      return await sources[source].queryTokens()
    })
  )
  return tokens.flat()
}
