import { useEffect } from "react"
import { useRoutes, useLocation } from "react-router-dom"
import { useAddress, useChainID, useNetworkName } from "data/wallet"
import { ErrorBoundary, Wrong } from "components/feedback"
import InitBankBalance from "app/InitBankBalance"
import LatestTx from "app/sections/LatestTx"
import NetworkHeader from "app/sections/NetworkHeader"
import SwapTx from "txs/swap/SwapTx"
import SignMultisigTxPage from "pages/multisig/SignMultisigTxPage"
import PostMultisigTxPage from "pages/multisig/PostMultisigTxPage"
import {
  clearWalletAddress,
  storeNetwork,
  storeTheme,
  storeWalletAddress,
} from "./storage"
import RequestContainer from "./RequestContainer"
import ManageNetworks from "./networks/ManageNetworks"
import AddNetworkPage from "./networks/AddNetworkPage"
import Auth from "./auth/Auth"
import Header from "./layouts/Header"
import Front from "./modules/Front"
import { useAllInterchainAddresses, usePubkey } from "auth/hooks/useAddress"
import { Flex } from "components/layout"
import NetworkStatus from "components/display/NetworkStatus"
import PreferencesRouter from "app/sections/settings/PreferencesRouter"
import { useAuth } from "auth"
import is from "auth/scripts/is"
import { useNetworks } from "app/InitNetworks"
import { useTheme } from "data/settings/Theme"
import EnableCoinType from "app/sections/EnableCoinType"
import ChangeLogModal from "./update/ChangeLogModal"
import Welcome from "./modules/Welcome"
import ExtensionPage from "./components/ExtensionPage"
import { getErrorMessage } from "utils/error"
import ManageWalletsButton from "./auth/ManageWalletsButton"
import ManageWalletRouter from "./auth/ManageWalletRouter"
import PreferencesButton from "app/sections/settings/PreferencesButton"
import DashboardButton from "app/sections/DashboardButton"

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
      })
    else clearWalletAddress()
  }, [address, addresses, pubkey, wallet, name])

  useEffect(() => {
    storeTheme(theme)
  }, [theme])

  const routes = useRoutes([
    { path: "/networks", element: <ManageNetworks /> },
    { path: "/network/new", element: <AddNetworkPage /> },

    /* auth */
    { path: "/auth/*", element: <Auth /> },
    { path: "/manage-wallet/*", element: <ManageWalletRouter /> },
    { path: "/preferences/*", element: <PreferencesRouter /> },

    /* default txs */
    { path: "/swap/*", element: <SwapTx /> },
    { path: "/multisig/sign", element: <SignMultisigTxPage /> },
    { path: "/multisig/post", element: <PostMultisigTxPage /> },

    /* 404 */
    { path: "*", element: <Front /> },
  ])

  const location = useLocation()

  function render() {
    if (!wallet && !location.pathname.startsWith("/auth/")) {
      return <Welcome />
    }
    // main page
    const hidePaths = ["/auth/", "/manage-wallet/", "/preferences"]
    const hideHeader = hidePaths.some((p) => location.pathname.startsWith(p))

    return (
      <>
        {!hideHeader && (
          <Header>
            <Flex>
              <ManageWalletsButton />
              <NetworkHeader />
            </Flex>
            <Flex>
              <LatestTx />
              <EnableCoinType />
              <NetworkStatus />
              <PreferencesButton />
              <DashboardButton />
            </Flex>
          </Header>
        )}

        <ErrorBoundary fallback={fallback}>{routes}</ErrorBoundary>
      </>
    )
  }

  return (
    <ErrorBoundary fallback={fallback}>
      <InitBankBalance>
        <RequestContainer>{render()}</RequestContainer>
      </InitBankBalance>
      <ChangeLogModal />
    </ErrorBoundary>
  )
}

/* error */
export const fallback = (error: Error) => (
  <ExtensionPage>
    <Wrong>{getErrorMessage(error)}</Wrong>
  </ExtensionPage>
)

export default App
