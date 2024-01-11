import { QueryKey, useQuery, useQueryClient } from "react-query"
import { useInterchainLCDClient } from "./lcdClient"
import { atom, useSetRecoilState } from "recoil"
import { CARBON_API, OSMOSIS_GAS_ENDPOINT } from "config/constants"
import { useNetworks } from "app/InitNetworks"
import { RefetchOptions } from "../query"
import { queryKey } from "../query"
import axios from "axios"

interface LatestTx {
  txhash: string
  chainID: string
  redirectAfterTx?: { label: string; path: string }
  queryKeys?: QueryKey[]
  onSuccess?: () => void
}

interface OsmosisGasResponse {
  base_fee: string
}

export const latestTxState = atom<LatestTx>({
  key: "latestTx",
  default: { txhash: "", chainID: "" },
})

export const isBroadcastingState = atom({
  key: "isBroadcasting",
  default: false,
})

export const useTxInfo = ({ txhash, queryKeys, chainID }: LatestTx) => {
  const setIsBroadcasting = useSetRecoilState(isBroadcastingState)
  const queryClient = useQueryClient()
  const lcd = useInterchainLCDClient()

  return useQuery(
    [queryKey.tx.txInfo, txhash],
    () => lcd.tx.txInfo(txhash, chainID),
    {
      enabled: !!txhash,
      retry: true,
      retryDelay: 1000,
      onSettled: () => setIsBroadcasting(false),
      onSuccess: () => {
        queryKeys?.forEach((queryKey) => {
          queryClient.invalidateQueries(queryKey)
        })

        queryClient.invalidateQueries(queryKey.History)
        queryClient.invalidateQueries(queryKey.bank.balances)
        queryClient.invalidateQueries(queryKey.tx.create)
      },
    }
  )
}

export const useOsmosisGas = (disabled?: boolean) => {
  const { networks } = useNetworks()

  return useQuery(
    [queryKey.tx.osmosisGas],
    async () => {
      try {
        const { data } = await axios.get<OsmosisGasResponse>(
          OSMOSIS_GAS_ENDPOINT,
          {
            baseURL: networks["mainnet"]["osmosis-1"].lcd, // hard set for now.
          }
        )
        return Number(data.base_fee)
      } catch (e) {
        return 0.0025
      }
    },
    {
      ...RefetchOptions.INFINITY,
      staleTime: 60 * 1000, // cache data for 1 min
      enabled: !disabled,
    }
  )
}

export const useCarbonFees = () => {
  return useQuery(
    [queryKey.tx.fees],
    async () => {
      const [{ data: gasPrices }, { data: gasCosts }] = await Promise.all([
        axios.get("carbon/fee/v1/gas_prices", { baseURL: CARBON_API }),
        axios.get("carbon/fee/v1/gas_costs", { baseURL: CARBON_API }),
      ])
      const prices = gasPrices.min_gas_prices.reduce((acc: any, p: any) => {
        acc[p.denom] = p.gas_price
        return acc
      }, {})

      const costs = gasCosts.msg_gas_costs.reduce((acc: any, p: any) => {
        acc[p.msg_type] = p.gas_cost
        return acc
      }, {})

      return { prices, costs }
    },
    { ...RefetchOptions.INFINITY }
  )
}
