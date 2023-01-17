import { PropsWithChildren, useEffect, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { useNetworkName } from "data/wallet"
import { isWallet, useAuth } from "auth"
import Online from "./containers/Online"

const InitWallet = ({ children }: PropsWithChildren<{}>) => {
  useOnNetworkChange()
  const queryClient = useQueryClient()
  const networkName = useNetworkName()

  return (
    <QueryClientProvider client={queryClient} key={networkName}>
      {children}
      <Online />
    </QueryClientProvider>
  )
}

export default InitWallet

/* hooks */
const useOnNetworkChange = () => {
  const { wallet, disconnect } = useAuth()
  const isPreconfiguredWallet = isWallet.preconfigured(wallet)
  const shouldDisconnect = isPreconfiguredWallet

  useEffect(() => {
    if (shouldDisconnect) disconnect()
  }, [disconnect, shouldDisconnect])
}

const useQueryClient = () => {
  const name = useNetworkName()

  return useMemo(() => {
    if (!name) throw new Error()
    return new QueryClient()
  }, [name])
}
