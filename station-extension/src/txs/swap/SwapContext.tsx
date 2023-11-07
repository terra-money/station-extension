import { PropsWithChildren } from "react"
import createContext from "utils/createContext"
import { combineState } from "data/query"
import { Fetching } from "components/feedback"
import { useSwapTokens, useParseSwapTokens } from "data/queries/swap/hook"
import { SwapAssetBase, SwapAssetExtra } from "data/queries/swap/types"

interface Swap {
  tokens: SwapAssetExtra[]
}

export const [useSwap, SwapProvider] = createContext<Swap>("useSwap")

const SwapContext = ({ children }: PropsWithChildren<{}>) => {
  const swap = useSwapTokens()
  const tokens = swap.reduce(
    (acc, { data }) => (data ? [...acc, ...data] : acc),
    [] as SwapAssetBase[]
  )
  const state = combineState(...swap)
  const parsed = useParseSwapTokens(tokens)

  const render = () => {
    if (!parsed) return null
    const value = { tokens: parsed }
    return <SwapProvider value={value}>{children}</SwapProvider>
  }

  return !state.isSuccess ? null : <Fetching {...state}>{render()}</Fetching>
}

export default SwapContext
