import { RefetchOptions, combineState, queryKey } from "data/query"
import { Account } from "@terra-money/feather.js"
import createContext from "utils/createContext"
import { isTerraChain } from "utils/chain"
import { useNetwork } from "data/wallet"
import { useQueries } from "react-query"
import axios from "axios"

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

export type InterchainAccountInfo = Record<string, Account>

export const [useInterchainAccountInfo, AccountInfoProvider] =
  createContext<InterchainAccountInfo[]>("useAccountInfo")

export const useInitialAccountInfo = (
  addresses: Record<string, string> | undefined
) => {
  const networks = useNetwork()

  // const LIMIT = 100
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
        queryFn: async () => {
          const result: any[] = []
          const hashArray: string[] = []

          if (!networks?.[chainID]?.lcd) {
            return result
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
                      // [paginationKeys.limit]: LIMIT,
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

          return (
            result
              .sort((a, b) => Number(b.height) - Number(a.height))
              // .slice(0, LIMIT)
              .map((tx) => ({ ...tx, chain: chainID }))
          )
        },
        // Data will never become stale and always stay in cache
        ...RefetchOptions.INFINITY,
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
  // .slice(0, LIMIT)

  return { activitySorted, state }
}
