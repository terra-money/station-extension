import {
  clearWalletAddress,
  storeNetwork,
  storeTheme,
  storeWalletAddress,
} from "./storage"
import { useAllInterchainAddresses, usePubkey } from "auth/hooks/useAddress"
import PreferencesRouter from "app/sections/settings/PreferencesRouter"
import { useAddress, useChainID, useNetworkName } from "data/wallet"
import SignMultisigTxPage from "pages/multisig/SignMultisigTxPage"
import PostMultisigTxPage from "pages/multisig/PostMultisigTxPage"
import SettingsButton from "app/sections/settings/SettingsButton"
import ManageWalletsButton from "./auth/ManageWalletsButton"
import NetworkStatus from "components/display/NetworkStatus"
import { ErrorBoundary, Wrong } from "components/feedback"
import ManageWalletRouter from "./auth/ManageWalletRouter"
import DashboardButton from "app/sections/DashboardButton"
import { useRoutes, useLocation } from "react-router-dom"
import NetworkHeader from "app/sections/NetworkHeader"
import ManageNetworks from "./networks/ManageNetworks"
import AddNetworkPage from "./networks/AddNetworkPage"
import ExtensionPage from "./components/ExtensionPage"
import ChangeLogModal from "./update/ChangeLogModal"
import RequestContainer from "./RequestContainer"
import InitBankBalance from "app/InitBankBalance"
import { useNetworks } from "app/InitNetworks"
import { useTheme } from "data/settings/Theme"
import { getErrorMessage } from "utils/error"
import LatestTx from "app/sections/LatestTx"
import { Flex } from "components/layout"
import Welcome from "./modules/Welcome"
import Header from "./layouts/Header"
import SwapTx from "txs/swap/SwapTx"
import Front from "./modules/Front"
import { useEffect } from "react"
import is from "auth/scripts/is"
import { useAuth } from "auth"
import Auth from "./auth/Auth"
import UpgradeWalletButton from "app/sections/UpgradeWalletButton"
import { Tooltip } from "@terra-money/station-ui"
import { useTranslation } from "react-i18next"

const App = () => {
  const { networks } = useNetworks()
  const name = useNetworkName()
  const chainID = useChainID()
  const address = useAddress()
  const pubkey = usePubkey()
  const addresses = useAllInterchainAddresses()
  const { name: theme } = useTheme()
  const { wallet } = useAuth()
  const { t } = useTranslation()

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
            <Flex gap={16} style={{ marginTop: 8 }}>
              <ManageWalletsButton />
              <NetworkHeader />
            </Flex>
            <Flex gap={16} style={{ marginTop: 8 }}>
              <LatestTx />
              <UpgradeWalletButton />
              <NetworkStatus />
              <SettingsButton />
              <Tooltip
                content={t("Dashboard")}
                placement="top"
                children={<DashboardButton />}
              />
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
