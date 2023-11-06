import { useQueries } from "react-query"
import { useNetwork } from "data/wallet"
import {
  SupportedSource,
  SwapSource,
  SwapAsset,
  SwapAssetWithBalanceAndValue,
} from "./types"
import { querySkipTokens } from "./skip"
import { querySquidTokens } from "./squid"
import { useBankBalance } from "../bank"
import { useExchangeRates } from "../coingecko"

const queryMap = {
  [SwapSource.SKIP]: querySkipTokens,
  [SwapSource.SQUID]: querySquidTokens,
}

export const useSwapTokens = (selectedSources?: SupportedSource[]) => {
  const network = useNetwork()
  const balances = useBankBalance()
  const { data: prices } = useExchangeRates()

  const querySources =
    selectedSources ?? (Object.keys(queryMap) as SupportedSource[])

  const res = useQueries(
    querySources.map((source) => ({
      queryKey: ["swapTokens", source],
      queryFn: async () => queryMap[source](),
    }))
  )

  const tokens = res
    .reduce(
      (acc, { data }) => (data ? [...data, ...acc] : acc),
      [] as SwapAsset[]
    )
    .filter(
      ({ chainId }) =>
        typeof chainId === "string" && Object.keys(network).includes(chainId)
    )
    .map((token) => {
      const balance =
        balances.find(({ denom }) => denom === token.denom)?.amount ?? 0
      const price = prices?.[token.denom]?.price ?? 0
      const value = Number(balance) * price * Math.pow(10, -token.decimals)

      return {
        ...token,
        balance,
        price,
        value,
      }
    })

  return tokens as SwapAssetWithBalanceAndValue[]
}
