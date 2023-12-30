import { useAuth } from "auth"
import axios from "axios"
import { RefetchOptions, queryKey } from "data/query"
import { useNetwork } from "data/wallet"
import { useQueries, useQuery } from "react-query"
import { atom, useRecoilState } from "recoil"

const LOCALSTORAGE_IBC_TXS_KEY = "pendingIbcTxs"

type WalletName = string
type StoredIbcTxs = Record<WalletName, IbcTx[]>

const ibcTxsState = atom<StoredIbcTxs>({
  key: "pending-ibc-txs",
  default: JSON.parse(localStorage.getItem(LOCALSTORAGE_IBC_TXS_KEY) ?? "{}"),
})

export enum IbcTxStatus {
  LOADING = "loading",
  SUCCESS = "success",
  FAILED = "failed",
}

type IbcTx = {
  state: IbcTxStatus
  txhash: string
} & IbcTxDetails

export const usePendingIbcTx = () => {
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

  useIbcTxStatus(
    txs.filter(({ state }) => state === IbcTxStatus.LOADING),
    (hash, state) =>
      state !== IbcTxStatus.LOADING &&
      setIbcTxs((txs) =>
        txs.map((tx) => (tx.txhash === hash ? { ...tx, state } : tx))
      )
  )

  return {
    totalPending: txs.filter(({ state }) => state === IbcTxStatus.LOADING)
      .length,
    totalSuccess: txs.filter(({ state }) => state === IbcTxStatus.SUCCESS)
      .length,
    totalFailed: txs.filter(({ state }) => state === IbcTxStatus.FAILED).length,
    clearCompletedTxs: () =>
      setIbcTxs((txs) =>
        txs.filter(({ state }) => state === IbcTxStatus.LOADING)
      ),
    showStatusTxHashes: txs.map(({ txhash }) => txhash),
    addTx: (tx: ActivityItem) => {
      const ibcDetails = getIbcTxDetails(tx)
      if (ibcDetails) {
        setIbcTxs((txs) => [
          ...txs,
          { ...ibcDetails, txhash: tx.txhash, state: IbcTxStatus.LOADING },
        ])
      }
    },
  }
}

export interface IbcTxDetails {
  src_chain_id: string
  sequence: string
  src_port: string
  src_channel: string
  dst_port: string
  dst_channel: string
  timeout_timestamp: number
}

const useIbcChannelInfo = (details: IbcTxDetails[]) => {
  const networks = useNetwork()

  return useQueries(
    details.map((detail) => ({
      queryKey: [
        queryKey.ibc.channelInfo,
        detail.src_channel,
        detail.src_port,
        networks[detail.src_chain_id]?.lcd,
      ],
      queryFn: async () => {
        const { data } = await axios.get(
          `/ibc/core/channel/v1/channels/${detail!.src_channel}/ports/${
            detail!.src_port
          }/client_state`,
          { baseURL: networks[detail.src_chain_id]?.lcd }
        )

        return data.identified_client_state.client_state.chain_id as string
      },
      ...RefetchOptions.INFINITY,
      enabled: !!networks[detail.src_chain_id]?.lcd,
    }))
  )
}

export const useIbcTxStatus = (
  details: (IbcTxDetails & { txhash?: string })[],
  onSuccess?: (hash: string | undefined, state: IbcTxStatus) => any
) => {
  const networks = useNetwork()
  const channelInfoData = useIbcChannelInfo(details)

  return useQueries(
    details.map((detail, i) => {
      const { data: dst_chain_id } = channelInfoData[i]
      const lcd = networks[dst_chain_id ?? ""]?.lcd

      return {
        queryKey: [
          queryKey.ibc.packetStatus,
          detail.sequence,
          detail.dst_channel,
          detail.dst_port,
          lcd,
        ],
        queryFn: async (): Promise<IbcTxStatus> => {
          try {
            const { data } = await axios.get<{ received: boolean }>(
              `/ibc/core/channel/v1/channels/${detail.dst_channel}/ports/${detail.dst_port}/packet_receipts/${detail.sequence}`,
              { baseURL: lcd }
            )

            if (data.received) {
              return IbcTxStatus.SUCCESS
            }
          } catch (e) {}

          return new Date().getTime() < detail.timeout_timestamp
            ? IbcTxStatus.LOADING
            : IbcTxStatus.FAILED
        },
        ...RefetchOptions.INFINITY,
        enabled: !!lcd,
        refetchInterval: (data?: IbcTxStatus) => {
          if (data === IbcTxStatus.FAILED || data === IbcTxStatus.SUCCESS) {
            return false
          }
          return 10_000
        },
        onSuccess: (data: IbcTxStatus) => {
          onSuccess && onSuccess(detail.txhash, data)
        },
      }
    })
  )
}

export const useIbcPrevHop = (details?: IbcTxDetails) => {
  const src_chain_id = useIbcChannelInfo(
    details
      ? [
          {
            ...details,
            src_channel: details.dst_channel,
            src_port: details.dst_port,
            dst_channel: details.src_channel,
            dst_port: details.src_port,
          },
        ]
      : []
  )[0]?.data
  const networks = useNetwork()

  const lcd = networks[src_chain_id ?? ""]?.lcd

  return useQuery(
    [
      queryKey.ibc.sendPacket,
      details?.sequence,
      details?.dst_channel,
      details?.src_channel,
      lcd,
    ],
    async (): Promise<ActivityItem | undefined> => {
      const { data } = await axios.get(
        `/cosmos/tx/v1beta1/txs?events=send_packet.packet_sequence%3D${
          details!.sequence
        }&events=send_packet.packet_src_channel%3D%27${
          details!.src_channel
        }%27&events=send_packet.packet_dst_channel%3D%27${
          details!.dst_channel
        }%27`,
        { baseURL: lcd }
      )

      if (!data.tx_responses.length) return undefined

      return {
        ...(data.tx_responses as ActivityItem[])[0],
        chain: src_chain_id,
      } as ActivityItem
    },
    {
      staleTime: Infinity,
      enabled: !!details && !!lcd,
      refetchInterval: (data?: ActivityItem) => {
        if (data) {
          return false
        }
        return (details?.timeout_timestamp ?? 0) + 60_000 < new Date().getTime()
          ? 25_000
          : false
      },
    }
  )
}

export const useIbcNextHop = (details?: IbcTxDetails) => {
  const dst_chain_id = useIbcChannelInfo(details ? [details] : [])[0]?.data
  const networks = useNetwork()

  const lcd = networks[dst_chain_id ?? ""]?.lcd

  return useQuery(
    [
      queryKey.ibc.receivePacket,
      details?.sequence,
      details?.dst_channel,
      details?.src_channel,
      lcd,
    ],
    async (): Promise<ActivityItem | undefined> => {
      const { data } = await axios.get(
        `/cosmos/tx/v1beta1/txs?events=recv_packet.packet_sequence%3D${
          details!.sequence
        }&events=recv_packet.packet_src_channel%3D%27${
          details!.src_channel
        }%27&events=recv_packet.packet_dst_channel%3D%27${
          details!.dst_channel
        }%27`,
        { baseURL: lcd }
      )

      if (!data.tx_responses.length) return undefined

      return {
        ...(data.tx_responses as ActivityItem[])[0],
        chain: dst_chain_id,
      } as ActivityItem
    },
    {
      staleTime: Infinity,
      enabled: !!details && !!lcd,
      refetchInterval: (data?: ActivityItem) => {
        if (data) {
          return false
        }
        return (details?.timeout_timestamp ?? 0) + 60_000 < new Date().getTime()
          ? 25_000
          : false
      },
    }
  )
}

// helpers
export const getIbcTxDetails = (tx: {
  logs: ActivityItem["logs"]
  chain: string
}): IbcTxDetails | undefined => {
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

export const getRecvIbcTxDetails = (tx: {
  logs: ActivityItem["logs"]
  chain: string
}): (IbcTxDetails & { next_hop?: IbcTxDetails }) | undefined => {
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
          next_hop: getIbcTxDetails({ logs: [log], chain: tx.chain }),
        }
      } catch (e) {}
    }
  }

  // this is not an ibc tx
  return undefined
}
