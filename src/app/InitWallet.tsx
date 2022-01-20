import { FC, useEffect, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { useNetwork, useNetworkName } from "data/wallet"
import { isWallet, useAuth } from "auth"
import Online from "./containers/Online"
import WithNodeInfo from "./WithNodeInfo"

const InitWallet: FC = ({ children }) => {
  useOnNetworkChange()
  const queryClient = useQueryClient()
  const networkName = useNetworkName()

  return (
    <QueryClientProvider client={queryClient} key={networkName}>
      <WithNodeInfo>{children}</WithNodeInfo>
      <Online />
    </QueryClientProvider>
  )
}

export default InitWallet

/* hooks */
const useOnNetworkChange = () => {
  const { preconfigure } = useNetwork()
  const { wallet, disconnect } = useAuth()
  const isPreconfiguredWallet = isWallet.preconfigured(wallet)
  const shouldDisconnect = !preconfigure && isPreconfiguredWallet

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
