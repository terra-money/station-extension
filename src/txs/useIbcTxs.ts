import { useAuth } from "auth"
import axios from "axios"
import { RefetchOptions, queryKey } from "data/query"
import { useNetwork } from "data/wallet"
import { useQueries, useQuery, useQueryClient } from "react-query"
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
  const chains = Object.keys(useNetwork())
  const { wallet } = useAuth()
  const walletName = wallet?.name
  const [_ibcTxs, _setIbcTxsState] = useRecoilState(ibcTxsState)
  const queryClient = useQueryClient()

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
    (hash, state) => {
      if (state !== IbcTxStatus.LOADING) {
        setIbcTxs((txs) =>
          txs.map((tx) => (tx.txhash === hash ? { ...tx, state } : tx))
        )
        // when ibc tx is successful refetch balances
        queryClient.invalidateQueries(queryKey.bank.balance)
        queryClient.invalidateQueries(queryKey.bank.balances)
      }
    }
  )

  return {
    totalPending: txs.filter(
      ({ state, src_chain_id }) =>
        state === IbcTxStatus.LOADING && chains.includes(src_chain_id)
    ).length,
    totalSuccess: txs.filter(
      ({ state, src_chain_id }) =>
        state === IbcTxStatus.SUCCESS && chains.includes(src_chain_id)
    ).length,
    totalFailed: txs.filter(
      ({ state, src_chain_id }) =>
        state === IbcTxStatus.FAILED && chains.includes(src_chain_id)
    ).length,
    clearCompletedTxs: () =>
      setIbcTxs((txs) =>
        txs.filter(
          ({ state, src_chain_id }) =>
            state === IbcTxStatus.LOADING && chains.includes(src_chain_id)
        )
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

interface NextHopMemo {
  timeout_timestamp: number
  receiver?: string
  src_channel?: string
}

export interface IbcTxDetails {
  src_chain_id: string
  sequence: string
  src_port: string
  src_channel: string
  dst_port: string
  dst_channel: string
  timeout_timestamp: number

  next_hop_memo?: NextHopMemo
}

const useIbcChannelInfo = (details: (IbcTxDetails | undefined)[]) => {
  const networks = useNetwork()

  return useQueries(
    details.map((detail) => ({
      queryKey: [
        queryKey.ibc.channelInfo,
        detail?.src_channel,
        detail?.src_port,
        networks[detail?.src_chain_id ?? ""]?.lcd,
      ],
      queryFn: async () => {
        const { data } = await axios.get(
          `/ibc/core/channel/v1/channels/${detail!.src_channel}/ports/${
            detail!.src_port
          }/client_state`,
          { baseURL: networks[detail!.src_chain_id]?.lcd }
        )

        return data.identified_client_state.client_state.chain_id as string
      },
      ...RefetchOptions.INFINITY,
      enabled: !!detail && !!networks[detail.src_chain_id]?.lcd,
    }))
  )
}

export const useIbcTxStatus = (
  details: (IbcTxDetails & { txhash?: string })[],
  onSuccess?: (hash: string | undefined, state: IbcTxStatus) => any
) => {
  const networks = useNetwork()

  const oneHopDetails = details.filter(
    (detail) => !detail.next_hop_memo?.receiver
  )
  const oneHopChannelInfoData = useIbcChannelInfo(oneHopDetails)

  const multiHopTxs = details.filter(
    (detail) => !!detail.next_hop_memo?.receiver
  )
  const multiHopTxsNextTx = useIbcNextHops(multiHopTxs)
  const multiHopDetails = multiHopTxsNextTx.map(
    ({ data, isLoading }) => data && { data: getIbcTxDetails(data), isLoading }
  )

  const multiHopChannelInfoData = useIbcChannelInfo(
    multiHopDetails.map((dt) => dt?.data)
  )

  return useQueries([
    ...oneHopDetails.map((detail, i) => {
      const { data: dst_chain_id } = oneHopChannelInfoData[i]
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
    }),
    ...multiHopDetails.map((details, i) => {
      const { data: dst_chain_id } = multiHopChannelInfoData[i]
      const lcd = networks[dst_chain_id ?? ""]?.lcd
      const detail = details?.data
      const isLoading = !!details?.isLoading

      return {
        queryKey: [
          queryKey.ibc.packetStatus,
          detail?.sequence,
          detail?.dst_channel,
          detail?.dst_port,
          lcd,
        ],
        queryFn: async (): Promise<IbcTxStatus> => {
          if (!detail)
            return isLoading ||
              new Date().getTime() < multiHopTxs[i].timeout_timestamp
              ? IbcTxStatus.LOADING
              : IbcTxStatus.FAILED

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
          onSuccess && onSuccess(multiHopTxs[i].txhash, data)
        },
      }
    }),
  ])
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
          ? 15_000
          : false
      },
    }
  )
}

export const useIbcNextHop = (details?: IbcTxDetails) => {
  const result = useIbcNextHops(details ? [details] : [])[0]

  return {
    ...result,
    data: result?.data,
  }
}

const useIbcNextHops = (details: IbcTxDetails[]) => {
  const dst_chain_ids = useIbcChannelInfo(details)
  const networks = useNetwork()

  const lcds = dst_chain_ids.map(({ data: id }) => networks[id ?? ""]?.lcd)

  return useQueries(
    details.map((detail, i) => ({
      queryKey: [
        queryKey.ibc.receivePacket,
        detail.sequence,
        detail.dst_channel,
        detail.src_channel,
        lcds[i],
      ],
      queryFn: async (): Promise<ActivityItem | undefined> => {
        const { data } = await axios.get(
          `/cosmos/tx/v1beta1/txs?events=recv_packet.packet_sequence%3D${detail.sequence}&events=recv_packet.packet_src_channel%3D%27${detail.src_channel}%27&events=recv_packet.packet_dst_channel%3D%27${detail.dst_channel}%27`,
          { baseURL: lcds[i] }
        )

        if (!data.tx_responses.length) return undefined

        const result = {
          ...(data.tx_responses as ActivityItem[])[0],
          chain: dst_chain_ids[i].data,
        } as ActivityItem

        return result
      },

      staleTime: Infinity,
      enabled: !!details && !!lcds[i],
      refetchInterval: (data?: ActivityItem) => {
        if (data) {
          return false
        }

        return (detail.timeout_timestamp ?? 0) + 60_000 > new Date().getTime()
          ? 10_000
          : false
      },
    }))
  )
}

// helpers
function parsePacketData(pktData: string): NextHopMemo | undefined {
  function findAttribute(
    obj: Record<string, any>,
    attribute: string
  ): string | number | undefined {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === attribute) {
          return obj[key]
        } else if (typeof obj[key] === "object") {
          const result = findAttribute(obj[key], attribute)
          if (!!result) {
            return result
          }
        }
      }
    }
  }

  try {
    const data = JSON.parse(pktData)
    const memo = JSON.parse(data.memo)

    return {
      timeout_timestamp:
        Number(findAttribute(memo, "timeout_timestamp")) / 1_000_000,
      receiver: findAttribute(memo, "receiver") as string,
      src_channel: findAttribute(memo, "source_channel") as string,
    }
  } catch (e) {}
}

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
          next_hop_memo: parsePacketData(
            ibcEvent.attributes.find(({ key }) => key === "packet_data")!.value
          ),
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
