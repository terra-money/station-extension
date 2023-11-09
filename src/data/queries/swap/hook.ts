import { useQueries } from "react-query"
import { useNetwork } from "data/wallet"
import {
  SupportedSource,
  SwapSource,
  SwapAssetBase,
  SwapAssetExtra,
  SwapState,
  RouteInfo,
} from "./types"
import { skipApi } from "./skip"
import { squidApi } from "./squid"
import { useBankBalance } from "../bank"
import { useExchangeRates } from "../coingecko"
import { useCallback } from "react"

// Tokens
const queryMap = {
  [SwapSource.SKIP]: skipApi.queryTokens, // queries should return SwapAsset[]
  [SwapSource.SQUID]: squidApi.queryTokens,
}

export const useSwapTokens = (sources?: SupportedSource[]) => {
  const querySources = sources ?? (Object.keys(queryMap) as SupportedSource[])

  return useQueries(
    querySources.map((source) => ({
      queryKey: ["swapTokens", source],
      queryFn: async () => queryMap[source](),
    }))
  )
}

export const useParseSwapTokens = (tokens: SwapAssetBase[]) => {
  const network = useNetwork()
  const balances = useBankBalance()
  const { data: prices } = useExchangeRates()

  return tokens
    .filter(({ chainId }) => Object.keys(network).includes(chainId))
    .map((token) => {
      const balance =
        balances.find(({ denom }) => denom === token.denom)?.amount ?? 0
      const price = prices?.[token.denom]?.price ?? 0
      const value = Number(balance) * price * Math.pow(10, -token.decimals)
      const { icon, name } = network[token.chainId]

      return {
        ...token,
        balance,
        price,
        value,
        chain: {
          icon,
          name,
        },
      } as SwapAssetExtra
    })
}

// Routing
const routeMap = {
  [SwapSource.SKIP]: (swap: SwapState) => skipApi.queryRoute(swap),
  [SwapSource.SQUID]: (swap: SwapState) => {},
}
export const useGetBestRoute = (sources?: SupportedSource[]) => {
  const routeSources = sources ?? (Object.keys(routeMap) as SupportedSource[])

  const getBestRoute = useCallback(
    async (swap: SwapState) => {
      const routePromises = routeSources.map(async (source) => {
        try {
          return await routeMap[source]?.(swap)
        } catch (error) {
          console.error(`Error getting route from ${source}:`, error)
          return null // Return null in case of error to not break Promise.all
        }
      })

      const results = await Promise.all(routePromises)
      const routes = results.filter(
        (result): result is RouteInfo => result !== null
      )

      if (routes.length === 0) {
        throw new Error("No routes available for this swap.")
      }
      const bestRoute = routes.sort(
        (a, b) => Number(b.amountOut) - Number(a.amountOut)
      )[0]
      return bestRoute
    },
    [routeSources]
  )

  return getBestRoute
}
