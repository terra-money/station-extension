import { useQuery } from "react-query"
import { queryKey, RefetchOptions } from "../query"
import { useInterchainLCDClient } from "./lcdClient"
import { AccAddress } from "@terra-money/feather.js"

// TODO: make interchain
export const useAccountInfo = (address: AccAddress, enabled = true) => {
  const lcd = useInterchainLCDClient()

  return useQuery(
    [queryKey.auth.accountInfo],
    async () => {
      return await lcd.auth.accountInfo(address)
    },
    { ...RefetchOptions.INFINITY, enabled }
  )
}
