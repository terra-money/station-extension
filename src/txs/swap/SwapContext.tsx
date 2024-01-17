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
import { useSwapSlippage } from "utils/localStorage"
import SwapLoadingPage from "./components/SwapLoadingPage"

interface Swap {
  tokens: SwapAssetExtra[]
  getTokensWithBal: (tokens: SwapAssetExtra[]) => SwapAssetExtra[]
  getBestRoute: (swap: SwapState) => Promise<RouteInfo>
  getMsgs: (swap: SwapState) => any
  form: UseFormReturn<SwapState>
  slippage: string
  changeSlippage: (slippage: string) => void
}

export const [useSwap, SwapProvider] = createContext<Swap>("useSwap")

const SwapContext = ({ children }: PropsWithChildren<{}>) => {
  const SOURCES = [SwapSource.SKIP]

  const swap = useSwapTokens(SOURCES)
  const getBestRoute = useGetBestRoute(SOURCES)
  const getMsgs = useGetMsgs(SOURCES)

  const { slippage, changeSlippage } = useSwapSlippage()
  const tokens = swap.reduce(
    (acc, { data }) => (data ? [...acc, ...data] : acc),
    [] as SwapAssetBase[]
  )

  const parsed = useParseSwapTokens(tokens)
  const defaultValues = useGetSwapDefaults(parsed)
  const state = combineState(...swap)

  const form = useForm<SwapState>({ mode: "onChange" })
  const { askAsset } = form.watch()

  useEffect(() => {
    if (!askAsset) {
      form.reset({
        askAsset: defaultValues.askAsset,
        offerAsset: defaultValues.offerAsset,
        slippageTolerance: slippage,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues.askAsset, defaultValues.offerAsset])

  useEffect(() => {
    form.setValue("slippageTolerance", slippage)
  }, [slippage, form])

  const getTokensWithBal = (tokens: SwapAssetExtra[]) =>
    tokens.filter((t) => Number(t.balance) > 0)

  const render = () => {
    const value = {
      tokens: parsed,
      getTokensWithBal,
      getBestRoute,
      form,
      getMsgs,
      slippage,
      changeSlippage,
    }
    return <SwapProvider value={value}>{children}</SwapProvider>
  }

  return (
    <Fetching {...state}>
      {!state.isSuccess || !askAsset || !parsed ? (
        <SwapLoadingPage />
      ) : (
        render()
      )}
    </Fetching>
  )
}

export default SwapContext
