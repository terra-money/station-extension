import { PropsWithChildren } from "react"
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
}

export const [useSwap, SwapProvider] = createContext<Swap>("useSwap")

const SOURCES = [SwapSource.SKIP]

const SwapContext = ({ children }: PropsWithChildren<{}>) => {
  const swap = useSwapTokens(SOURCES)
  const getBestRoute = useGetBestRoute(SOURCES)

  const tokens = swap.reduce(
    (acc, { data }) => (data ? [...acc, ...data] : acc),
    [] as SwapAssetBase[]
  )
  const state = combineState(...swap)
  const parsed = useParseSwapTokens(tokens)

  const getTokensWithBal = (tokens: SwapAssetExtra[]) => {
    return tokens.filter((t) => t.balance > 0)
  }

  const render = () => {
    if (!parsed) return null
    const value = { tokens: parsed, getTokensWithBal, getBestRoute }
    return <SwapProvider value={value}>{children}</SwapProvider>
  }

  return !state.isSuccess ? null : <Fetching {...state}>{render()}</Fetching>
}

export default SwapContext
