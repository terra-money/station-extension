import { QueryKey, useQuery, useQueryClient } from "react-query"
import { useInterchainLCDClient } from "./lcdClient"
import { atom, useRecoilValue, useSetRecoilState } from "recoil"
import { CARBON_API, OSMOSIS_GAS_ENDPOINT } from "config/constants"
import { useNetworks } from "app/InitNetworks"
import axios from "axios"
import { useCallback, useMemo } from "react"
import BigNumber from "bignumber.js"
import { isNil } from "ramda"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { useNetwork } from "data/wallet"
import { useIsWalletEmpty } from "data/queries/bank"
import { queryKey, RefetchOptions } from "data/query"
import { useAuth } from "auth"
import { getLocalSetting, SettingKey } from "utils/localStorage"
import { CreateTxOptions, Msg } from "@terra-money/feather.js"

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

interface UseGasEstimationProps {
  chain: string
  estimationTxValues: any
  createTx: (values: any) => CreateTxOptions | undefined
  txGasAdjustment?: number
  gasDenom?: string
}

export const useGasEstimation = ({
  chain,
  estimationTxValues,
  createTx,
  txGasAdjustment,
  gasDenom,
}: UseGasEstimationProps) => {
  const lcd = useInterchainLCDClient()
  const networks = useNetwork()
  const { wallet } = useAuth()
  const addresses = useInterchainAddresses()
  const isWalletEmpty = useIsWalletEmpty()
  const { data: carbonFees } = useCarbonFees()
  const { data: osmosisGas } = useOsmosisGas(!chain?.startsWith("osmosis-"))
  const isBroadcasting = useRecoilValue(isBroadcastingState)

  const simulationTx = estimationTxValues && createTx(estimationTxValues)
  const gasAdjustmentSetting = SettingKey.GasAdjustment
  const gasAdjustment =
    networks[chain]?.gasAdjustment *
    getLocalSetting<number>(gasAdjustmentSetting)

  const key = {
    address: addresses?.[chain],
    gasAdjustment: gasAdjustment * (txGasAdjustment ?? 1),
    estimationTxValues,
    msgs: simulationTx?.msgs.map(
      (msg: Msg) => msg.toData(networks[chain].isClassic)["@type"]
    ),
  }

  const carbonFee = useMemo(() => {
    const fee =
      carbonFees?.costs[key.msgs?.[0] ?? ""] ?? carbonFees?.costs["default_fee"]
    return Number(fee)
  }, [carbonFees, key.msgs])

  const { data: estimatedGas, ...estimatedGasState } = useQuery(
    [queryKey.tx.create, key, isWalletEmpty, carbonFee],
    async () => {
      if (!key.address || isWalletEmpty) return 0
      if (!wallet) return 0
      if (!simulationTx || !simulationTx.msgs.length) return 0
      try {
        if (chain.startsWith("carbon-")) return carbonFee
        const unsignedTx = await lcd.tx.create([{ address: key.address }], {
          ...simulationTx,
          feeDenoms: [gasDenom],
        })
        console.log(
          "unsignedTx.auth_info.fee.gas_limit",
          unsignedTx.auth_info.fee.gas_limit
        )
        return Math.ceil(unsignedTx.auth_info.fee.gas_limit)
      } catch (error) {
        console.error(error)
        return 200_000
      }
    },
    {
      ...RefetchOptions.INFINITY,
      retry: 3,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      enabled: !isBroadcasting,
    }
  )

  const getGasAmount = useCallback(
    (denom: CoinDenom) => {
      const gasPrice = chain?.startsWith("carbon-")
        ? carbonFees?.prices[denom]
        : chain?.startsWith("osmosis-")
        ? (osmosisGas || 0.0025) * 10
        : networks[chain]?.gasPrices[denom]
      if (isNil(estimatedGas) || !gasPrice) return "0"
      return new BigNumber(estimatedGas)
        .times(gasPrice)
        .integerValue(BigNumber.ROUND_CEIL)
        .toString()
    },
    [chain, carbonFees?.prices, osmosisGas, networks, estimatedGas]
  )

  return {
    estimatedGas,
    estimatedGasState,
    getGasAmount,
  }
}
