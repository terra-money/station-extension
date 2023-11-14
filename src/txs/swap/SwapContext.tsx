import { PropsWithChildren, useMemo } from "react"
import createContext from "utils/createContext"
import { combineState } from "data/query"
import { Fetching } from "components/feedback"

import {
  useSwapTokens,
  useParseSwapTokens,
  useGetBestRoute,
} from "data/queries/swap/hook"
import {
  SwapAssetBase,
  SwapAssetExtra,
  SwapSource,
  RouteInfo,
  SwapState,
} from "data/queries/swap/types"

interface Swap {
  tokens: SwapAssetExtra[]
  getTokensWithBal: (tokens: SwapAssetExtra[]) => SwapAssetExtra[]
  getBestRoute: (swap: SwapState) => Promise<RouteInfo>
  defaultValues: {
    askAsset: SwapAssetExtra
    offerAsset: SwapAssetExtra
  }
}

export const [useSwap, SwapProvider] = createContext<Swap>("useSwap")

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

const SwapContext = ({ children }: PropsWithChildren<{}>) => {
  const SOURCES = [SwapSource.SKIP]
  const swap = useSwapTokens(SOURCES)
  const getBestRoute = useGetBestRoute(SOURCES)
  const tokens = swap.reduce(
    (acc, { data }) => (data ? [...acc, ...data] : acc),
    [] as SwapAssetBase[]
  )
  const parsed = useParseSwapTokens(tokens)
  const state = combineState(...swap)

  const defaultValues = useMemo(() => {
    return {
      askAsset:
        parsed.find(
          (t) =>
            t.symbol === DEFAULT_SWAP.ask.symbol &&
            t.chainId === DEFAULT_SWAP.ask.chainID
        ) ?? parsed[0],
      offerAsset:
        parsed.find(
          (t) =>
            t.symbol === DEFAULT_SWAP.offer.symbol &&
            t.chainId === DEFAULT_SWAP.offer.chainID
        ) ?? parsed[1],
    }
  }, [parsed])

  const getTokensWithBal = (tokens: SwapAssetExtra[]) => {
    return tokens.filter((t) => Number(t.balance) > 0)
  }

  const render = () => {
    if (!parsed) return null
    const value = {
      tokens: parsed,
      getTokensWithBal,
      getBestRoute,
      defaultValues,
    }
    return <SwapProvider value={value}>{children}</SwapProvider>
  }

  return !state.isSuccess ? null : <Fetching {...state}>{render()}</Fetching>
}

export default SwapContext
