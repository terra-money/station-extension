import { useQuery } from "react-query"
import axios from "axios"
import { useChainID, useNetwork } from "data/wallet"
import { queryKey, RefetchOptions } from "../query"

export const useNodeInfo = () => {
  const network = useNetwork()
  const chainID = useChainID()

  return useQuery(
    [queryKey.tendermint.nodeInfo],
    async () => {
      const { data } = await axios.get("node_info", {
        baseURL: network[chainID].lcd,
      })
      return data
    },
    { ...RefetchOptions.INFINITY }
  )
}
