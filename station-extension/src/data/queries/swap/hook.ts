import { useQueries } from "react-query"
import { useNetwork } from "data/wallet"
import {
  SupportedSource,
  SwapSource,
  SwapAssetBase,
  SwapAssetExtra,
} from "./types"
import { querySkipTokens } from "./skip"
import { querySquidTokens } from "./squid"
import { useBankBalance } from "../bank"
import { useExchangeRates } from "../coingecko"

const queryMap = {
  [SwapSource.SKIP]: querySkipTokens, // queries should return SwapAsset[]
  [SwapSource.SQUID]: querySquidTokens,
}

export const useSwapTokens = (selectedSources?: SupportedSource[]) => {
  const querySources =
    selectedSources ?? (Object.keys(queryMap) as SupportedSource[])

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
