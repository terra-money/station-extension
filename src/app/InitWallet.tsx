import { FC, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { useNetworkName } from "data/wallet"
import Online from "./containers/Online"

const InitWallet: FC = ({ children }) => {
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
const useQueryClient = () => {
  const name = useNetworkName()

  return useMemo(() => {
    if (!name) throw new Error()
    return new QueryClient()
  }, [name])
}
