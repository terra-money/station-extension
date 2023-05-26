import { useEffect } from "react"
import { useRoutes } from "react-router-dom"
import { useAddress, useChainID, useNetworkName } from "data/wallet"
import { ErrorBoundary } from "components/feedback"
import { fallback } from "app/App"
import InitBankBalance from "app/InitBankBalance"
import LatestTx from "app/sections/LatestTx"
import NetworkHeader from "app/sections/NetworkHeader"
import SwapTx from "txs/swap/SwapTx"
import SignMultisigTxPage from "pages/multisig/SignMultisigTxPage"
import PostMultisigTxPage from "pages/multisig/PostMultisigTxPage"
import { clearWalletAddress, storeNetwork, storeWalletAddress } from "./storage"
import RequestContainer from "./RequestContainer"
import ManageNetworks from "./networks/ManageNetworks"
import AddNetworkPage from "./networks/AddNetworkPage"
import Auth from "./auth/Auth"
import Header from "./layouts/Header"
import Front from "./modules/Front"
import ManageWallets from "./auth/SelectWallets"
import { useAllInterchainAddresses, usePubkey } from "auth/hooks/useAddress"
import { Flex } from "components/layout"
import NetworkStatus from "components/display/NetworkStatus"
import Preferences from "app/sections/Preferences"
import { useAuth } from "auth"
import is from "auth/scripts/is"
import { useNetworks } from "app/InitNetworks"
import { useTheme } from "data/settings/Theme"

const App = () => {
  const { networks } = useNetworks()
  const name = useNetworkName()
  const chainID = useChainID()
  const address = useAddress()
  const pubkey = usePubkey()
  const addresses = useAllInterchainAddresses()
  const { name: theme } = useTheme()
  const { wallet } = useAuth()

  useEffect(() => {
    storeNetwork({ ...networks[name][chainID], name }, networks[name])
  }, [networks, chainID, name])

  useEffect(() => {
    if (address)
      storeWalletAddress({
        address,
        addresses: addresses ?? {},
        name: wallet?.name,
        ledger: is.ledger(wallet),
        pubkey,
        network: name,
        theme,
      })
    else clearWalletAddress()
  }, [address, addresses, pubkey, wallet, name, theme])

  const routes = useRoutes([
    { path: "/networks", element: <ManageNetworks /> },
    { path: "/network/new", element: <AddNetworkPage /> },

    /* auth */
    { path: "/auth/*", element: <Auth /> },

    /* default txs */
    { path: "/swap", element: <SwapTx /> },
    { path: "/multisig/sign", element: <SignMultisigTxPage /> },
    { path: "/multisig/post", element: <PostMultisigTxPage /> },

    /* 404 */
    { path: "*", element: <Front /> },
  ])

  return (
    <ErrorBoundary fallback={fallback}>
      <InitBankBalance>
        <RequestContainer>
          <Header>
            <ManageWallets />
            <Flex gap={5}>
              <LatestTx />
              <NetworkHeader />
              <NetworkStatus />
              <Preferences />
            </Flex>
          </Header>

          <ErrorBoundary fallback={fallback}>{routes}</ErrorBoundary>
        </RequestContainer>
      </InitBankBalance>
    </ErrorBoundary>
  )
}

export default App
