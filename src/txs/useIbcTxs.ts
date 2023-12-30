import axios from "axios"
import { RefetchOptions, queryKey } from "data/query"
import { useNetwork } from "data/wallet"
import { useQuery } from "react-query"
/*
import { useAuth } from "auth"
import { useEffect } from "react"
import { useQueries, useQuery } from "react-query"
import { atom, useRecoilState } from "recoil"
import { ChainID } from "types/network"

type WalletName = string
type TxHash = string

export enum IbcTxState {
  BROADCASTING = "broadcasting",
  PENDING = "loading",
  //RECEIVED = "received",
  SUCCESS = "success",
  ERROR = "failed",
}

type IbcTx = {
  state: IbcTxState
  txhash: TxHash
  chainID: ChainID
  timestamp: number
  msgs: Object[]
}

type StoredIbcTxs = Record<WalletName, IbcTx[]>
const LOCALSTORAGE_IBC_TXS_KEY = "ibcTxs"

const ibcTxsState = atom<StoredIbcTxs>({
  key: "ibc-txs",
  default: JSON.parse(localStorage.getItem(LOCALSTORAGE_IBC_TXS_KEY) ?? "{}"),
})

export default function useIbcTxs() {
  const { wallet } = useAuth()
  const walletName = wallet?.name
  const [_ibcTxs, _setIbcTxsState] = useRecoilState(ibcTxsState)

  const txs = _ibcTxs[walletName] ?? []
  function setIbcTxs(state: (prev: IbcTx[]) => IbcTx[]) {
    const newState = {
      ..._ibcTxs,
      [walletName]: state(_ibcTxs[walletName] ?? []),
    }
    _setIbcTxsState(newState)
    localStorage.setItem(LOCALSTORAGE_IBC_TXS_KEY, JSON.stringify(newState))
  }

  // query broadcasting txs
  useQueries(
    txs
      .filter(({ state }) => state === IbcTxState.BROADCASTING)
      .map(({ chainID, txhash, ...txData }) => ({
        queryKey: [queryKey.ibc.transactionStatus, chainID, txhash],
        queryFn: async () => {
          const { data } = await axios.post(
            "https://api.skip.money/v2/tx/track",
            {
              tx_hash: txhash,
              chain_id: chainID,
            }
          )
          return data
        },
        // ping the Skip API every 5 sec
        retryDelay: 5_000,
        // if after 5 minutes the transaction has not been broadcasted yet set the status to failed
        retry: (failureCount: number) => {
          if (failureCount > 60) {
            setIbcTxs((s) => [
              ...s.filter((d) => txhash !== d.txhash),
              {
                ...txData,
                chainID,
                txhash,
                state: IbcTxState.ERROR,
              },
            ])
            return false
          }
          return true
        },
        onSuccess: () => {
          setIbcTxs((s) => [
            ...s.filter((d) => txhash !== d.txhash),
            {
              ...txData,
              chainID,
              txhash,
              state: IbcTxState.PENDING,
            },
          ])
        },
      }))
  )

  const result = useQueries(
    txs
      .filter(({ state }) => state === IbcTxState.PENDING)
      .map(({ chainID, txhash, ...txData }) => ({
        queryKey: [queryKey.ibc.transactionStatus, chainID, txhash],
        queryFn: async () => {
          const { data } = await axios.get(
            `https://api.skip.money/v2/tx/status?tx_hash=${txhash}&chain_id=${chainID}`
          )
          return { ...txData, state: data.state as string, txhash, chainID }
        },
        refetchInterval: (data: any) => {
          if (
            [
              "STATE_COMPLETED_SUCCESS",
              "STATE_RECEIVED",
              "STATE_COMPLETED_ERROR",
              "STATE_ABANDONED",
            ].includes(data?.state)
          ) {
            return false
          }
          return 10_000
        },
        ...RefetchOptions.INFINITY,
      }))
  )

  useEffect(() => {
    result.forEach(({ data }) => {
      if (
        data &&
        [
          "STATE_COMPLETED_SUCCESS",
          "STATE_RECEIVED",
          "STATE_COMPLETED_ERROR",
          "STATE_ABANDONED",
        ].includes(data.state)
      ) {
        setIbcTxs((s) => [
          ...s.filter(({ txhash }) => txhash !== data.txhash),
          {
            ...data,
            state: ["STATE_COMPLETED_SUCCESS", "STATE_RECEIVED"].includes(
              data.state
            )
              ? IbcTxState.SUCCESS
              : IbcTxState.ERROR,
          },
        ])
      }
    })
  }, [result]) // eslint-disable-line

  return {
    trackIbcTx: (txhash: TxHash, chainID: ChainID, msgs: Object[]) => {
      setIbcTxs((s) => [
        {
          txhash,
          chainID,
          state: IbcTxState.BROADCASTING,
          timestamp: Date.now(),
          msgs,
        },
        ...s,
      ])
    },
    clearCompletedTxs: () => {
      setIbcTxs((s) =>
        s.filter(({ state }) =>
          [IbcTxState.PENDING, IbcTxState.BROADCASTING].includes(state)
        )
      )
    },
    ibcTxs: [...txs].sort((a, b) => b.timestamp - a.timestamp),
  }
}
*/

interface IbcTxDetails {
  src_chain_id: string
  sequence: string
  src_port: string
  src_channel: string
  dst_port: string
  dst_channel: string
  timeout_timestamp: number
}

export const getIbcTxDetails = (tx: ActivityItem): IbcTxDetails | undefined => {
  for (const log of tx.logs) {
    const ibcEvent = log.events.find((e) => e.type === "send_packet")

    if (ibcEvent) {
      try {
        return {
          src_chain_id: tx.chain,
          sequence: ibcEvent.attributes.find(
            ({ key }) => key === "packet_sequence"
          )!.value,
          src_port: ibcEvent.attributes.find(
            ({ key }) => key === "packet_src_port"
          )!.value,
          src_channel: ibcEvent.attributes.find(
            ({ key }) => key === "packet_src_channel"
          )!.value,
          dst_port: ibcEvent.attributes.find(
            ({ key }) => key === "packet_dst_port"
          )!.value,
          dst_channel: ibcEvent.attributes.find(
            ({ key }) => key === "packet_dst_channel"
          )!.value,
          timeout_timestamp:
            Number(
              ibcEvent.attributes.find(
                ({ key }) => key === "packet_timeout_timestamp"
              )!.value
            ) / 1_000_000,
        }
      } catch (e) {}
    }
  }

  // this is not an ibc tx
  return undefined
}

export const getRecvIbcTxDetails = (
  tx: ActivityItem
): IbcTxDetails | undefined => {
  for (const log of tx.logs) {
    const ibcEvent = log.events.find((e) => e.type === "recv_packet")

    if (ibcEvent) {
      try {
        return {
          src_chain_id: tx.chain,
          sequence: ibcEvent.attributes.find(
            ({ key }) => key === "packet_sequence"
          )!.value,
          src_port: ibcEvent.attributes.find(
            ({ key }) => key === "packet_src_port"
          )!.value,
          src_channel: ibcEvent.attributes.find(
            ({ key }) => key === "packet_src_channel"
          )!.value,
          dst_port: ibcEvent.attributes.find(
            ({ key }) => key === "packet_dst_port"
          )!.value,
          dst_channel: ibcEvent.attributes.find(
            ({ key }) => key === "packet_dst_channel"
          )!.value,
          timeout_timestamp:
            Number(
              ibcEvent.attributes.find(
                ({ key }) => key === "packet_timeout_timestamp"
              )!.value
            ) / 1_000_000,
        }
      } catch (e) {}
    }
  }

  // this is not an ibc tx
  return undefined
}

export const useIbcChannelInfo = (details?: IbcTxDetails) => {
  const networks = useNetwork()
  const lcd = networks[details?.src_chain_id ?? ""]?.lcd

  return useQuery(
    [queryKey.ibc.channelInfo, details?.src_channel, details?.src_port, lcd],
    async () => {
      const { data } = await axios.get(
        `/ibc/core/channel/v1/channels/${details!.src_channel}/ports/${
          details!.src_port
        }/client_state`,
        { baseURL: lcd }
      )

      return data.identified_client_state.client_state.chain_id as string
    },
    {
      ...RefetchOptions.INFINITY,
      enabled: !!details && !!lcd,
    }
  )
}

export enum IbcTxStatus {
  LOADING = "loading",
  SUCCESS = "success",
  FAILED = "failed",
}

export const useIbcTxStatus = (details?: IbcTxDetails) => {
  const { data: dst_chain_id } = useIbcChannelInfo(details)
  const networks = useNetwork()

  const lcd = networks[dst_chain_id ?? ""]?.lcd

  return useQuery(
    [
      queryKey.ibc.packetStatus,
      details?.sequence,
      details?.dst_channel,
      details?.dst_port,
      lcd,
    ],
    async (): Promise<IbcTxStatus> => {
      try {
        const { data } = await axios.get<{ received: boolean }>(
          `/ibc/core/channel/v1/channels/${details!.dst_channel}/ports/${
            details!.dst_port
          }/packet_receipts/${details!.sequence}`,
          { baseURL: lcd }
        )

        if (data.received) {
          return IbcTxStatus.SUCCESS
        }
      } catch (e) {}

      return new Date().getTime() < details!.timeout_timestamp
        ? IbcTxStatus.LOADING
        : IbcTxStatus.FAILED
    },
    {
      ...RefetchOptions.INFINITY,
      enabled: !!details && !!lcd,
      refetchInterval: (data?: IbcTxStatus) => {
        if (data === IbcTxStatus.FAILED || data === IbcTxStatus.SUCCESS) {
          return false
        }

        return 10_000
      },
    }
  )
}
