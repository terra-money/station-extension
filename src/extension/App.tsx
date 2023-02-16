import { useEffect } from "react"
import { useRoutes } from "react-router-dom"
import { useAddress, useChainID, useNetwork, useNetworkName } from "data/wallet"
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
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { Flex } from "components/layout"
import NetworkStatus from "components/display/NetworkStatus"
import Preferences from "app/sections/Preferences"

const App = () => {
  const network = useNetwork()
  const name = useNetworkName()
  const chainID = useChainID()
  const address = useAddress()
  const addresses = useInterchainAddresses()

  useEffect(() => {
    storeNetwork({ ...network[chainID], name }, network)
  }, [network, chainID, name])

  useEffect(() => {
    if (address) storeWalletAddress(address, addresses ?? {})
    else clearWalletAddress()
  }, [address, addresses])

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
