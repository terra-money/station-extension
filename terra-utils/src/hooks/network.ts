import { useMemo } from "react"
import { LCDClient } from "@terra-money/feather.js"
import { useQuery } from "@tanstack/react-query"
import { InterchainNetwork } from "../types/network"
import { createLCDClient, getChains } from "../actions"

export const useLCDClient = () => {
  const chains = getChains()
  const queryKey = useMemo(() => ["USE_LCD_CLIENT", chains] as const, [chains])

  return useQuery<LCDClient>({
    queryKey,
    queryFn: async ({ queryKey: [, _chains] }) => {
      const chainsConfig = _chains as Record<string, InterchainNetwork>
      return createLCDClient(chainsConfig)
    }
  })
}
