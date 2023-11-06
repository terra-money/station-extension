import { PropsWithChildren, useMemo } from "react"
import { zipObj } from "ramda"
import { isDenomIBC } from "@terra-money/terra-utils"
import { AccAddress } from "@terra-money/feather.js"
import { getAmount } from "utils/coin"
import createContext from "utils/createContext"
import { combineState } from "data/query"
import { useBankBalance } from "data/queries/bank"
import { useTokenBalances } from "data/queries/wasm"
import { readIBCDenom, useNativeDenoms } from "data/token"
import { useIBCWhitelist } from "data/Terra/TerraAssets"
import { useCW20Whitelist } from "data/Terra/TerraAssets"
import { useCustomTokensCW20 } from "data/settings/CustomTokens"
import { useTFMTokens } from "data/external/tfm"
import { Card } from "components/layout"
import { SwapAssets, validateAssets } from "./useSwapUtils"
import { useSwapChains, useSwapTokens } from "data/queries/swap"
import { useChainID, useNetworkName } from "data/wallet"
import { useWhitelist } from "data/queries/chains"

export interface SlippageParams extends SwapAssets {
  input: number
  slippageInput: number
  ratio: Price
}

export interface SwapSpread {
  max_spread: string
  minimum_receive: Amount
  belief_price: string
  price: number
}

interface TFMSwap {
  options: {
    coins: TokenItemWithBalance[]
    tokens: TokenItemWithBalance[]
  }
  findTokenItem: (token: Token) => TokenItemWithBalance
  findDecimals: (token: Token) => number
}

export const [useTFMSwap, TFMSwapProvider] =
  createContext<TFMSwap>("useTFMSwap")

const TFMSwapContext = ({ children }: PropsWithChildren<{}>) => {
  const bankBalance = useBankBalance()
  const { list } = useCustomTokensCW20()
  const readNativeDenom = useNativeDenoms()
  const terraChainID = useChainID()
  const { ibcDenoms } = useWhitelist()
  const networkName = useNetworkName()

  const customTokens = list.map(({ token }) => token)

  /* contracts */
  const { data: ibcWhitelist, ...ibcWhitelistState } = useIBCWhitelist()
  const { data: cw20Whitelist, ...cw20WhitelistState } = useCW20Whitelist()
  const { data: TFMTokens, ...TFMTokensState } = useTFMTokens()
  const swapTokens = useSwapTokens(["skip"])
  const swapChains = useSwapChains(["skip"])
  console.log("swapTokens", swapTokens)
  console.log("swap Chains", swapChains)

  // Why?
  // To search tokens with symbol (ibc, cw20)
  // To filter tokens with balance (cw20)
  const availableList = useMemo(() => {
    if (!(swapTokens && ibcWhitelist && cw20Whitelist)) return

    const tokens = swapTokens.map(
      ({ ibcDenom, address }) => ibcDenom ?? address
    )

    const ibc = tokens.filter(
      (denom) =>
        ibcWhitelist[denom.replace("ibc/", "")] ||
        Object.values(ibcWhitelist).find(
          ({ base_denom }) => denom === base_denom
        )
    )

    const cw20 = tokens
      .filter((addr) => AccAddress.validate(addr))
      .filter((token) => cw20Whitelist[token])

    return { ibc, cw20 }
  }, [cw20Whitelist, ibcWhitelist, swapTokens])

  // Fetch cw20 balances: only listed and added by the user
  const cw20TokensBalanceRequired = useMemo(() => {
    if (!availableList) return []
    return customTokens.filter((token) =>
      availableList.cw20.find((address) => token === address)
    )
  }, [customTokens, availableList])

  const cw20TokensBalancesState = useTokenBalances(cw20TokensBalanceRequired)
  const cw20TokensBalances = useMemo(() => {
    if (cw20TokensBalancesState.some(({ isSuccess }) => !isSuccess)) return

    return zipObj(
      cw20TokensBalanceRequired,
      cw20TokensBalancesState.map(({ data }) => {
        if (!data) throw new Error()
        return data
      })
    )
  }, [cw20TokensBalanceRequired, cw20TokensBalancesState])

  const context = useMemo(() => {
    if (!(availableList && ibcWhitelist && cw20Whitelist)) return
    if (!cw20TokensBalances) return

    const coins = [
      {
        ...readNativeDenom("uluna"),
        balance: getAmount(bankBalance, "uluna"),
      },
    ]

    const ibc = availableList.ibc.map((token) => {
      const item = ibcWhitelist[token.replace("ibc/", "")]
      const balance = getAmount(bankBalance, token)
      return { ...readIBCDenom(item), balance }
    })

    const cw20 = availableList.cw20.map((token) => {
      const balance = cw20TokensBalances[token] ?? "0"
      return { ...cw20Whitelist[token], balance }
    })

    const options = {
      coins,
      tokens: [
        ...ibc,
        ...cw20,
        ...Object.entries(ibcDenoms[networkName] ?? {})
          .filter(([_, { chainID }]) => chainID === terraChainID)
          .map(([ibc, { token, chainID }]) => ({
            ...readNativeDenom(token, chainID),
            token: ibc.split(":")[1],
            balance: getAmount(bankBalance, token),
          }))
          .filter((entry) => (entry.isNonWhitelisted ? false : true)),
      ].filter(Boolean),
    }

    const findTokenItem = (token: Token) => {
      const key =
        AccAddress.validate(token) || isDenomIBC(token) ? "tokens" : "coins"

      const option = options[key].find((item) => item.token === token)
      if (!option) throw new Error()
      return option
    }

    const findDecimals = (token: Token) => findTokenItem(token).decimals

    return { options, findTokenItem, findDecimals }
  }, [
    bankBalance,
    ibcWhitelist,
    cw20Whitelist,
    ibcDenoms,
    networkName,
    terraChainID,
    availableList,
    cw20TokensBalances,
    readNativeDenom,
  ])

  const state = combineState(
    ibcWhitelistState,
    cw20WhitelistState,
    TFMTokensState,
    ...cw20TokensBalancesState
  )

  const render = () => {
    if (!context) return null
    return <TFMSwapProvider value={context}>{children}</TFMSwapProvider>
  }

  return <Card {...state}>{render()}</Card>
}

export default TFMSwapContext

/* type */
export const validateTFMSlippageParams = (
  params: Partial<SlippageParams>
): params is SlippageParams => {
  const { input, slippageInput, ...assets } = params
  return !!(validateAssets(assets) && input && slippageInput)
}
