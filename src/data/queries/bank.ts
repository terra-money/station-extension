import { useQueries } from "react-query"
import createContext from "utils/createContext"
import { combineState, queryKey, RefetchOptions } from "../query"
import { useInterchainLCDClient } from "./lcdClient"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { useCustomTokensCW20 } from "data/settings/CustomTokens"
import { useNetwork } from "data/wallet"
import { getChainIDFromAddress } from "utils/bech32"
import { Coin, Coins } from "@terra-money/feather.js"
import { Pagination } from "@terra-money/feather.js/dist/client/lcd/APIRequester"

export const useInitialTokenBalance = () => {
  const addresses = useInterchainAddresses()
  const networks = useNetwork()
  const lcd = useInterchainLCDClient()
  const { list: cw20 } = useCustomTokensCW20()

  return useQueries(
    cw20.map(({ token }) => {
      const chainID = getChainIDFromAddress(token, networks)
      const address = chainID && addresses?.[chainID]
      return {
        queryKey: [queryKey.bank.balances, token, chainID, address],
        queryFn: async () => {
          if (!address)
            return {
              amount: "0",
              denom: token,
              chain: chainID,
            } as CoinBalance

          const { balance } = await lcd.wasm.contractQuery<{ balance: Amount }>(
            token,
            { balance: { address } }
          )

          return {
            amount: balance,
            denom: token,
            chain: chainID,
          } as CoinBalance
        },
        ...RefetchOptions.DEFAULT,
        staleTime: 3 * 60 * 1000,
      }
    })
  )
}

// As a wallet app, native token balance is always required from the beginning.
export const [useBankBalance, BankBalanceProvider] =
  createContext<CoinBalance[]>("useBankBalance")

export const useInitialBankBalance = () => {
  const lcd = useInterchainLCDClient()
  const addresses = useInterchainAddresses()

  return useQueries(
    Object.entries(addresses ?? {}).map(([chainID, address]) => {
      return {
        queryKey: [queryKey.bank.balances, address, chainID],
        queryFn: async () => {
          const rawBalances: Coin[] = []
          let next_key: string | null = null

          do {
            const data: [Coins, Pagination] = ["phoenix-1", "pisco-1"].includes(
              chainID
            )
              ? await lcd.bank.spendableBalances(
                  address,
                  next_key ? { "pagination.key": next_key } : undefined
                )
              : await lcd.bank.balance(
                  address,
                  next_key ? { "pagination.key": next_key } : undefined
                )

            rawBalances.push(...data[0].toArray())
            next_key = data[1].next_key
          } while (next_key)

          return rawBalances.map(({ denom, amount }) => ({
            denom,
            amount: amount.toString(),
            chain: chainID,
          })) as CoinBalance[]
        },
        disabled: !address,
        ...RefetchOptions.DEFAULT,
        staleTime: 3 * 60 * 1000,
      }
    })
  )
}

export interface CoinBalance {
  amount: string
  denom: string
  chain: string
}

export const useBalances = () => {
  const addresses = useInterchainAddresses()
  const lcd = useInterchainLCDClient()

  const results = useQueries(
    Object.entries(addresses ?? {}).map(([chainID, address]) => {
      return {
        queryKey: [queryKey.bank.balance, address, chainID],
        queryFn: async () => {
          const balance = await lcd.bank.balance(address)
          return balance[0].toArray().map(({ denom, amount }) => {
            return {
              denom,
              amount: amount.toString(),
              chain: chainID,
            } as CoinBalance
          })
        },
        ...RefetchOptions.DEFAULT,
        staleTime: 3 * 60 * 1000,
      }
    })
  )

  const data = [] as CoinBalance[]
  results.forEach(({ data: result }) => {
    if (result) data.push(...result)
  })

  return {
    ...combineState(...results),
    data,
  }
}

export const useIsWalletEmpty = () => {
  const bankBalance = useBankBalance()
  return !bankBalance.length
}
