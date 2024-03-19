import { VALIDATION_TIMEOUT } from "config/constants"
import { queryKey, RefetchOptions } from "../query"
import { useQueries, useQuery } from "react-query"
import { useNetworks } from "app/InitNetworks"
import { randomAddress } from "utils/bech32"
import axios from "axios"
import { useState } from "react"
import { ChainID } from "types/network"

export const useLocalNodeInfo = (chainID: string) => {
  const { networks } = useNetworks()
  return useQuery(
    [queryKey.tendermint.nodeInfo],
    async () => {
      const { data } = await axios.get(
        "cosmos/base/tendermint/v1beta1/node_info",
        {
          baseURL: networks[chainID][chainID].lcd,
        }
      )
      return data
    },
    { ...RefetchOptions.INFINITY, enabled: chainID === "localterra" }
  )
}

export const useValidateLCD = (
  lcd?: string,
  chainID?: string,
  enabled?: boolean
) => {
  return useQuery(
    [lcd, chainID],
    async () => {
      if (!lcd || !chainID) return

      // basic URL validation
      try {
        const url = new URL(lcd)
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          return "The LCD must be an HTTP or HTTPS URL"
        }
      } catch (_) {
        return "Invalid URL provided"
      }

      // node_info validation
      try {
        const { data } = await axios.get(
          "/cosmos/base/tendermint/v1beta1/node_info",
          {
            baseURL: lcd,
            timeout: 3_000,
          }
        )

        const nodeChain =
          "default_node_info" in data
            ? (data.default_node_info.network as string)
            : (data.node_info.network as string)

        if (nodeChain !== chainID) {
          return `Invalid chain. Expected ${chainID}, got ${nodeChain}.`
        }
      } catch (e) {
        return "Unable to connect to the LCD"
      }

      // valid
    },
    { ...RefetchOptions.INFINITY, enabled }
  )
}

interface Network {
  chainID: string
  prefix: string
  lcd: string
}

export const useValidNetworks = (networks: Network[]) => {
  const MAX_ATTEMPTS = 10
  const REFETCH_WAIT_INTERVAL = 5000 // 5 seconds

  const [failedNetworks, setFailedNetworks] = useState<Network[]>([])
  const [successNetworks, setSuccessNetworks] = useState<ChainID[]>([])
  const [attemptCount, setAttemptCount] = useState(0)

  return useQueries(
    networks.map(({ chainID, prefix, lcd }) => {
      return {
        queryKey: [queryKey.tendermint.nodeInfo, lcd],
        queryFn: async () => {
          if (successNetworks.includes(chainID) || prefix === "terra")
            return chainID
          const res = await axios.get(
            `/cosmos/bank/v1beta1/balances/${randomAddress(prefix)}`,
            {
              baseURL: lcd,
              timeout: VALIDATION_TIMEOUT,
            }
          )
          if (Array.isArray(res?.data?.balances)) {
            setSuccessNetworks((prev) => [...prev, chainID])
            return chainID
          }
        },
        ...RefetchOptions.INFINITY,
        enabled: attemptCount < MAX_ATTEMPTS,
        refetchOnMount: false,
        refetchInterval: failedNetworks.some((network) => network.lcd === lcd)
          ? REFETCH_WAIT_INTERVAL
          : undefined,
        onSettled: (data: any, error: any) => {
          if (error && attemptCount < MAX_ATTEMPTS - 1) {
            setFailedNetworks((prev) => [...prev, { chainID, prefix, lcd }])
            setAttemptCount(attemptCount + 1)
          } else if (data) {
            setSuccessNetworks((prev) => [...prev, chainID])
          }
        },
      }
    })
  )
}
