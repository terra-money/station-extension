import { PropsWithChildren, useEffect } from "react"
import { isWallet, useAuth } from "auth"
import Online from "./containers/Online"

const InitWallet = ({ children }: PropsWithChildren<{}>) => {
  useOnNetworkChange()
  return (
    <>
      {children}
      <Online />
    </>
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
