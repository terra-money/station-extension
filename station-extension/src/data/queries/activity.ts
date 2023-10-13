import { useQueries } from "react-query"
import { useNetwork } from "data/wallet"
import { isTerraChain } from "utils/chain"
import axios from "axios"
import { combineState, queryKey } from "data/query"

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

export const useActivity = (addresses: Record<string, string> | undefined) => {
  const networks = useNetwork()

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
    Object.keys(addresses ?? {}).map((chain) => {
      const address = chain && addresses?.[chain]

      const isTerra = isTerraChain(chain)

      // return pagination keys by network.
      const paginationKeys = getPaginationKeys(isTerra)

      return {
        queryKey: [queryKey.History, networks?.[chain]?.lcd, address],
        queryFn: async () => {
          const result: any[] = []
          const hashArray: string[] = []

          if (!networks?.[chain]?.lcd) {
            return result
          }

          const requests = await Promise.all(
            EVENTS.map((event) => {
              return axios.get<AccountHistory>(`/cosmos/tx/v1beta1/txs`, {
                baseURL: networks[chain].lcd,
                params: {
                  events: `${event}='${address}'`,
                  //order_by: "ORDER_BY_DESC",
                  [paginationKeys.offset]: 0 || undefined,
                  [paginationKeys.reverse]: isTerra ? 2 : true,
                  [paginationKeys.limit]: LIMIT,
                },
              })
            })
          )

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
            .map((tx) => ({ ...tx, chain }))
        },
        // Data will never become stale and always stay in cache
        cacheTime: Infinity,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchIntervalInBackground: false,
      }
    })
  )

  const state = combineState(...activityData)

  const activitySorted = activityData
    .reduce((acc, { data }) => (data ? [...acc, ...data] : acc), [] as any[])
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, LIMIT)

  return { activitySorted, state }
}
