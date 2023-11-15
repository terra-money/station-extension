import { PropsWithChildren, useEffect } from "react"
import createContext from "utils/createContext"
import { combineState } from "data/query"
import { Fetching } from "components/feedback"

import {
  useSwapTokens,
  useParseSwapTokens,
  useGetBestRoute,
  useGetSwapDefaults,
  useGetMsgs,
} from "data/queries/swap/hook"
import {
  SwapAssetBase,
  SwapAssetExtra,
  SwapSource,
  RouteInfo,
  SwapState,
} from "data/queries/swap/types"
import { UseFormReturn, useForm } from "react-hook-form"

interface Swap {
  tokens: SwapAssetExtra[]
  getTokensWithBal: (tokens: SwapAssetExtra[]) => SwapAssetExtra[]
  getBestRoute: (swap: SwapState) => Promise<RouteInfo>
  getMsgs: (swap: SwapState) => any
  form: UseFormReturn<SwapState>
}

export const [useSwap, SwapProvider] = createContext<Swap>("useSwap")

const SwapContext = ({ children }: PropsWithChildren<{}>) => {
  const SOURCES = [SwapSource.SKIP]

  const swap = useSwapTokens(SOURCES)
  const getBestRoute = useGetBestRoute(SOURCES)
  const getMsgs = useGetMsgs(SOURCES)
  const tokens = swap.reduce(
    (acc, { data }) => (data ? [...acc, ...data] : acc),
    [] as SwapAssetBase[]
  )

  const parsed = useParseSwapTokens(tokens)
  const defaultValues = useGetSwapDefaults(parsed)
  const state = combineState(...swap)

  const form = useForm<SwapState>({ mode: "onChange" })
  const { askAsset, offerAsset } = form.watch()

  useEffect(() => {
    if (!askAsset || !offerAsset) {
      form.reset({
        askAsset: defaultValues.askAsset,
        offerAsset: defaultValues.offerAsset,
      })
    }
  }, [defaultValues, form, askAsset, offerAsset])

  const getTokensWithBal = (tokens: SwapAssetExtra[]) => {
    return tokens.filter((t) => Number(t.balance) > 0)
  }

  const render = () => {
    if (!offerAsset || !askAsset) return null
    const value = {
      tokens: parsed,
      getTokensWithBal,
      getBestRoute,
      form,
      getMsgs,
    }
    return <SwapProvider value={value}>{children}</SwapProvider>
  }

  return !state.isSuccess ? null : <Fetching {...state}>{render()}</Fetching>
}

export default SwapContext
