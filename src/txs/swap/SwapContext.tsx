import { PropsWithChildren } from "react"
import createContext from "utils/createContext"
import { combineState } from "data/query"
import { useActiveDenoms } from "data/queries/coingecko"
import { TerraContracts } from "data/Terra/TerraAssets"
import { useCW20Pairs } from "data/Terra/TerraAssets"
import { useTerraContracts } from "data/Terra/TerraAssets"
import { Fetching } from "components/feedback"
import { useSwapTokens } from "data/queries/swap/hook"
import { SwapAssetExtra } from "data/queries/swap/types"

interface Swap {
  tokens: SwapAssetExtra[]
}

export const [useSwap, SwapProvider] = createContext<Swap>("useSwap")

const SwapContext = ({ children }: PropsWithChildren<{}>) => {
  const tokens = useSwapTokens()

  const render = () => {
    if (!tokens) return null
    const value = { tokens }
    return <SwapProvider value={value}>{children}</SwapProvider>
  }

  return !tokens.length ? null : render()
}

export default SwapContext
