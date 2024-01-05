import {
  Coin,
  Coins,
  CreateTxOptions,
  Msg,
  MsgExecuteContract,
  MsgTransfer,
  TxInfo,
} from "@terra-money/feather.js"
import { useAuth } from "auth"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { useNetwork } from "auth/hooks/useNetwork"
import axios from "axios"
import { useBalances } from "data/queries/bank"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { useCarbonFees, useOsmosisGas } from "data/queries/tx"
import { RefetchOptions, queryKey } from "data/query"
import { useQuery } from "react-query"

export function useIsBalanceLoading(chainID: string) {
  const { data, isLoading } = useBalances()

  return !data.find(({ chain }) => chain === chainID) && isLoading
}

export function useChainsWithGas() {
  const networks = useNetwork()
  const { data: balances } = useBalances()

  return Object.values(networks)
    .filter(({ chainID, gasPrices }) => {
      const gasDenoms = Object.keys(gasPrices)

      return balances?.find(
        ({ denom, chain }) => gasDenoms.includes(denom) && chain === chainID
      )
    })
    .map(({ chainID }) => chainID)
}

export function useAvailableGasDenoms(chainID: string, gas: number) {
  const networks = useNetwork()
  const network = networks[chainID]
  const { data: balances } = useBalances()

  if (!network) return []

  return Object.entries(network.gasPrices)
    .filter(([denom, gasPrice]) => {
      const balance = balances?.find(
        ({ denom: balanceDenom, chain }) =>
          balanceDenom === denom && chain === chainID
      )

      return balance && gasPrice * gas <= Number(balance.amount)
    })
    .map(([denom]) => denom)
}

export function useSwappableDenoms() {
  const networks = useNetwork()
  const { data: balances } = useBalances()

  return Object.values(networks)
    .map(({ chainID, baseAsset, ...network }) => {
      return {
        chainID,
        baseAsset,
        ...network,
        balance: Number(
          balances?.find(
            ({ denom, chain }) => denom === baseAsset && chain === chainID
          )?.amount
        ),
      }
    })
    .filter(({ gasPrices, baseAsset, balance }) => {
      const gasPrice = gasPrices[baseAsset]

      if (!gasPrice) return false

      return balance > gasPrice * 1_500_000
    })
    .map(({ baseAsset, chainID, balance }) => ({
      denom: baseAsset,
      chainID,
      balance,
    }))
}

export function useSwapRoute(
  {
    fromDenom,
    toDenom,
    fromChain,
    toChain,
    amount,
    type,
  }: {
    fromDenom?: string
    toDenom: string
    fromChain?: string
    toChain: string
    amount: number
    type: "in" | "out"
  },
  disabled?: boolean
) {
  const addresses = useInterchainAddresses()
  const { data: carbonFees } = useCarbonFees()
  const lcd = useInterchainLCDClient()
  const networks = useNetwork()
  const isOsmosis = fromChain?.startsWith("osmosis-")
  const { data: osmosisGas } = useOsmosisGas(!isOsmosis)

  async function estimateGas(chainID: string, msg: Msg) {
    try {
      if (chainID.startsWith("carbon-")) {
        return Number(
          carbonFees?.costs[msg.toData()["@type"]] ??
            carbonFees?.costs["default_fee"]
        )
      }
      const unsignedTx = await lcd.tx.create(
        [{ address: addresses![chainID] }],
        {
          chainID,
          msgs: [msg],
          feeDenoms: [fromDenom ?? ""],
        }
      )

      return Math.ceil(
        unsignedTx.auth_info.fee.gas_limit *
          (isOsmosis
            ? (osmosisGas || 0.0025) * 10
            : networks[chainID]?.gasAdjustment ?? 1)
      )
    } catch (error) {
      console.error(error)
      return 200_000
    }
  }

  return useQuery(
    [
      queryKey.Skip.swap,
      fromDenom,
      toDenom,
      fromChain,
      toChain,
      amount,
      type,
      addresses,
    ],
    async () => {
      try {
        const { data } = await axios.post(
          "https://api.skip.money/v1/fungible/msgs_direct",
          {
            chain_ids_to_addresses: addresses,
            source_asset_denom: fromDenom,
            source_asset_chain_id: fromChain,
            dest_asset_denom: toDenom,
            dest_asset_chain_id: toChain,
            amount_out: type === "out" ? amount.toString() : "",
            amount_in: type === "in" ? amount.toString() : "",
            slippage_tolerance_percent: "10",
          }
        )

        // TODO: multiple msgs swaps
        if (data.msgs.length > 1) throw new Error()

        const chainID = data?.msgs?.[0].chain_id
        const jsonMsg = JSON.parse(data?.msgs?.[0].msg)

        const msg: Msg = jsonMsg.source_channel
          ? new MsgTransfer(
              "transfer",
              jsonMsg.source_channel,
              new Coin(jsonMsg.token?.denom ?? "", jsonMsg.token?.amount),
              jsonMsg.sender,
              jsonMsg.receiver,
              undefined,
              (Date.now() + 120 * 1000) * 1e6,
              jsonMsg.memo
            )
          : new MsgExecuteContract(
              jsonMsg.sender,
              jsonMsg.contract,
              jsonMsg.msg,
              Coins.fromAmino(jsonMsg.funds)
            )

        const gasAmount = await estimateGas(chainID, msg)

        return {
          chainID,
          msg,
          amount_in: Number(data.route.amount_in),
          amount_out: Number(data.route.amount_out),
          gasAmount,
          feeAmount: Math.ceil(
            gasAmount * networks[chainID]?.gasPrices[fromDenom ?? ""] ?? 0
          ),
        }
      } catch (error) {
        throw new Error("The selected asset cannot be swapped")
      }
    },
    {
      ...RefetchOptions.DEFAULT,
      retry: false,
      enabled: !!fromChain && !!fromDenom && !disabled,
      staleTime: 120_000,
    }
  )
}

export function useIsBalanceEnough() {
  const { data: balances } = useBalances()

  return {
    isBalanceEnough: (
      denom: string,
      chainID: string,
      requiredAmount: number
    ) => {
      const b = balances?.find(
        ({ chain, denom: d }) => chain === chainID && d === denom
      )

      return b && Number(b.amount) >= requiredAmount
    },
    getBalanceAmount: (denom: string, chainID: string) => {
      const b = balances?.find(
        ({ chain, denom: d }) => chain === chainID && d === denom
      )

      return (b && Number(b.amount)) ?? 0
    },
  }
}

export function useSubmitTx() {
  const auth = useAuth()

  return async (txOptions: CreateTxOptions, password: string) => {
    // broadcast the tx
    const result = await auth.post(txOptions, password, undefined, true)

    return result as TxInfo
  }
}

export enum SkipTxStatus {
  COMPLETED = "STATE_COMPLETED",
  FAILED = "STATE_FAILED",
  SUCCESS = "STATE_SUCCESS",
  PENDING = "STATE_PENDING",
  RECEIVED = "STATE_RECEIVED",
  UNKNOWN = "STATE_UNKNOWN",
}

export async function checkSkipTxStatus(txhash: string, chainID: string) {
  const { data } = await axios.get(
    `https://api.skip.money/v1/tx/status?tx_hash=${txhash}&chain_id=${chainID}`
  )

  const state = data.status as SkipTxStatus

  return {
    state:
      state === SkipTxStatus.COMPLETED
        ? data.error
          ? SkipTxStatus.FAILED
          : SkipTxStatus.SUCCESS
        : state,
    error: (data.transfer_sequence || []).find(
      ({ state }: any) => state === "TRANSFER_FAILURE"
    )?.packet_txs?.error?.message,
  }
}
