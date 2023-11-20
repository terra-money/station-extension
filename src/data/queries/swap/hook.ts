import { useQueries } from "react-query"
import { IInterchainNetworks, useNetwork } from "data/wallet"
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
import { useCallback, useMemo } from "react"
import { useAllInterchainAddresses } from "auth/hooks/useAddress"
import { InterchainAddresses } from "types/network"
import { toAmount } from "@terra-money/terra-utils"

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

  const parsedtoken = tokens
    .filter(({ chainId }) => Object.keys(network).includes(chainId))
    .map((token) => {
      const balance =
        balances.find(
          ({ denom, chain }) => denom === token.denom && token.chainId === chain
        )?.amount ?? "0"
      const price = prices?.[token.denom]?.price ?? 0
      const change = prices?.[token.denom]?.change ?? 0
      const value = Number(balance) * price * Math.pow(10, -token.decimals)
      const { icon, name } = network[token.chainId]

      return {
        ...token,
        balance,
        price,
        change,
        value,
        chain: {
          icon,
          name,
        },
      } as SwapAssetExtra
    })
  return parsedtoken
}

// Routing
const routeMap = {
  [SwapSource.SKIP]: (swap: SwapState, network: IInterchainNetworks) =>
    skipApi.queryRoute(swap, network),
  [SwapSource.SQUID]: (swap: SwapState) => {},
}

export const useGetBestRoute = (sources?: SupportedSource[]) => {
  const routeSources = sources ?? (Object.keys(routeMap) as SupportedSource[])
  const network = useNetwork()

  const getBestRoute = useCallback(
    async (swap: SwapState) => {
      const routePromises = routeSources.map(async (source) => {
        try {
          const amount = toAmount(swap.offerInput, {
            decimals: swap.offerAsset.decimals,
          })
          return await routeMap[source]?.(
            { ...swap, offerInput: amount },
            network
          )
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
    [routeSources, network]
  )

  return getBestRoute
}

// Msgs
const msgMap = {
  [SwapSource.SKIP]: (swap: SwapState, addresses: InterchainAddresses) =>
    skipApi.queryMsgs(swap, addresses),
  [SwapSource.SQUID]: (swap: SwapState) => {},
}
export const useGetMsgs = (sources?: SupportedSource[]) => {
  const msgSources = sources ?? (Object.keys(routeMap) as SupportedSource[])
  const addresses = useAllInterchainAddresses() // use all in case intermediary network validation fails

  const getMsgs = useCallback(
    async (swap: SwapState) => {
      if (!addresses) return null
      const routePromises = msgSources.map((source) => {
        try {
          const amount = toAmount(swap.offerInput, {
            decimals: swap.offerAsset.decimals,
          })
          return msgMap[source]?.({ ...swap, offerInput: amount }, addresses)
        } catch (error) {
          console.error(`Error getting msgs from ${source}:`, error)
          return null
        }
      })
      return (await Promise.all(routePromises)).flat()
    },
    [msgSources, addresses]
  )

  return getMsgs
}

const DEFAULT_SWAP = {
  ask: {
    chainID: "phoenix-1",
    symbol: "LUNA",
  },
  offer: {
    chainID: "axelar-dojo-1",
    symbol: "USDC",
  },
}

// Defaults
export const useGetSwapDefaults = (assets: SwapAssetExtra[]) => {
  const defaults = useMemo(() => {
    const askAsset = assets.find(
      (t) =>
        t.symbol === DEFAULT_SWAP.ask.symbol &&
        t.chainId === DEFAULT_SWAP.ask.chainID
    )
    const offerAsset = assets.find(
      (t) =>
        t.symbol === DEFAULT_SWAP.offer.symbol &&
        t.chainId === DEFAULT_SWAP.offer.chainID
    )

    return {
      askAsset: askAsset ?? assets[0],
      offerAsset: offerAsset ?? assets[1],
    }
  }, [assets])
  return defaults
}
