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
import { useNativeDenoms, useUnknownIBCDenoms } from "data/token"

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
  const readNativeDenom = useNativeDenoms()
  const unknownIBCDenoms = useUnknownIBCDenoms()
  const { data: prices } = useExchangeRates()

  const parsedtoken = tokens
    .filter(({ chainId }) => Object.keys(network).includes(chainId))
    .map((token) => {
      token.denom = token.denom.replace("cw20:", "") // remove cw20: prefix
      const balance =
        balances.find(
          ({ denom, chain }) => denom === token.denom && token.chainId === chain
        )?.amount ?? "0"
      let price, change
      if (token.symbol === "LUNC") {
        // Price and change currently not available for LUNC.
        price = prices?.["uluna:classic"]?.price ?? 0
        change = prices?.["uluna:classic"]?.change ?? 0
      } else {
        price = prices?.[token.originDenom]?.price ?? 0
        change = prices?.[token.originDenom]?.change ?? 0
      }
      const value = Number(balance) * price * Math.pow(10, -token.decimals)
      const { icon: chainIcon, name: chainName } = network[token.chainId]
      const ibcDenom = unknownIBCDenoms[[token.denom, token.chainId].join("*")]
      const { icon, symbol, isNonWhitelisted, name } = readNativeDenom(
        ibcDenom?.baseDenom ?? token.denom,
        ibcDenom?.chainIDs?.[0] ?? token.chainId
      )
      return {
        ...token,
        symbol: isNonWhitelisted ? token.symbol : symbol,
        icon: isNonWhitelisted ? token.icon : icon,
        name,
        balance,
        price,
        change,
        value,
        chain: {
          icon: chainIcon,
          name: chainName,
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
        const amount = toAmount(swap.offerInput, {
          decimals: swap.offerAsset.decimals,
        })
        return await routeMap[source]?.(
          { ...swap, offerInput: amount },
          network
        )
      })

      const results = await Promise.all(routePromises)
      const routes = results.filter(
        (result): result is RouteInfo => result !== null
      )

      if (routes.length === 0) {
        throw new Error("No routes available for this swap.")
      }
      const bestRoute = routes.sort((a, b) => a.txsRequired - b.txsRequired)[0]
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
    denom: "uluna",
  },
  offer: {
    chainID: "phoenix-1",
    originDenom: "uusdc",
    symbol: "axlUSDC",
  },
}

// Defaults
export const useGetSwapDefaults = (assets: SwapAssetExtra[]) => {
  const defaults = useMemo(() => {
    const askAsset = assets.find(
      (t) =>
        t.denom === DEFAULT_SWAP.ask.denom &&
        t.chainId === DEFAULT_SWAP.ask.chainID
    )
    const offerAsset = assets.find(
      (t) =>
        t.originDenom === DEFAULT_SWAP.offer.originDenom &&
        t.chainId === DEFAULT_SWAP.offer.chainID &&
        t.symbol === DEFAULT_SWAP.offer.symbol
    )

    return {
      askAsset: askAsset ?? assets[0],
      offerAsset: offerAsset ?? assets[1],
    }
  }, [assets])
  return defaults
}
