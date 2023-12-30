import { RefetchOptions, combineState, queryKey } from "data/query"
import { isTerraChain } from "utils/chain"
import { useNetwork } from "data/wallet"
import { useQueries } from "react-query"
import axios from "axios"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { getIbcTxDetails, getRecvIbcTxDetails } from "txs/useIbcTxs"

interface PaginationKeys {
  limit: string
  offset: string
  reverse: string
}

/**
 * Returns pagination keys for the given chain. Switched by cosmos_sdk
 * version in the future, isTerra for now.
 *
 * @param isTerra boolean based on chain-id.  True if Terra, false if not.
 */
function getPaginationKeys(isTerra: boolean): PaginationKeys {
  if (isTerra) {
    return {
      limit: "limit",
      offset: "page",
      reverse: "orderBy",
    }
  } else {
    return {
      limit: "pagination.limit",
      offset: "pagination.offset",
      reverse: "pagination.reverse",
    }
  }
}

export const useTxActivity = () => {
  const networks = useNetwork()
  const addresses = useInterchainAddresses()

  const LIMIT = 100
  const EVENTS = [
    // any tx signed by the user
    "message.sender",
    // any coin received
    "transfer.recipient",
    // any coin sent
    "transfer.sender",
  ]
  const activityData = useQueries(
    Object.entries(addresses ?? {}).map(([chainID, address]) => {
      const isTerra = isTerraChain(chainID)

      // return pagination keys by network.
      const paginationKeys = getPaginationKeys(isTerra)

      return {
        queryKey: [queryKey.History, networks?.[chainID]?.lcd, address],
        queryFn: async (): Promise<ActivityItem[]> => {
          const result: AccountHistoryItem[] = []
          const hashArray: string[] = []

          if (!networks?.[chainID]?.lcd) {
            return []
          }

          const requests = (
            await Promise.all(
              EVENTS.map((event) => {
                try {
                  return axios.get<AccountHistory>(`/cosmos/tx/v1beta1/txs`, {
                    baseURL: networks[chainID].lcd,
                    params: {
                      events: `${event}='${address}'`,
                      //order_by: "ORDER_BY_DESC",
                      [paginationKeys.offset]: 0 || undefined,
                      [paginationKeys.reverse]: isTerra ? 2 : true,
                      [paginationKeys.limit]: LIMIT,
                    },
                  })
                } catch (e) {
                  return {}
                }
              })
            )
          ).filter((request) => !!request) as { data: AccountHistory }[]

          for (const { data } of requests) {
            data.tx_responses.forEach((tx) => {
              if (!hashArray.includes(tx.txhash)) {
                result.push(tx)
                hashArray.push(tx.txhash)
              }
            })
          }

          return result
            .sort((a, b) => Number(b.height) - Number(a.height))
            .slice(0, LIMIT)
            .map((tx) => ({ ...tx, chain: chainID }))
        },
        ...RefetchOptions.DEFAULT,
      }
    })
  )

  const state = combineState(...activityData)

  const activitySorted: ActivityItem[] = []
  const discarededTxsHashes: string[] = []

  const result = activityData
    .reduce(
      (acc, { data }) => (data ? [...acc, ...data] : acc),
      [] as ActivityItem[]
    )
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

  result.forEach((tx, i) => {
    if (discarededTxsHashes.includes(tx.txhash)) return

    const senderDetails = getIbcTxDetails(tx)

    !!senderDetails &&
      result
        .slice(i + 1, result.length)
        .filter((tx) => {
          const receiverDetails = getRecvIbcTxDetails(tx)

          if (!receiverDetails) return false
          return (
            receiverDetails.sequence === senderDetails.sequence &&
            receiverDetails.timeout_timestamp ===
              senderDetails.timeout_timestamp &&
            receiverDetails.dst_channel === senderDetails.dst_channel &&
            receiverDetails.src_channel === senderDetails.src_channel
          )
        })
        .forEach((tx) => discarededTxsHashes.push(tx.txhash))

    activitySorted.push(tx)
  })

  return { activitySorted: activitySorted.reverse().slice(0, LIMIT), state }
}
