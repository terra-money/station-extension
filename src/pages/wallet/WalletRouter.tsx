import ExtensionPage from "extension/components/ExtensionPage"
import VestingDetailsPage from "./VestingDetailsPage"
import AddressChain from "pages/wallet/AddressChain"
import { Route, Routes } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useChainID } from "data/wallet"
import ReceivePage from "./ReceivePage"
import SendTx from "./SendPage/SendTx"
import WalletMain from "./WalletMain"
import AssetPage from "./AssetPage"
import { encode } from "js-base64"

interface IRoute {
  path: string
  element: React.ReactNode
  title?: string
  backPath?: string
}

export const useWalletRoutes = (): IRoute[] => {
  const { t } = useTranslation()
  const chainID = useChainID()

  return [
    {
      path: "/",
      element: <WalletMain />,
      title: "",
    },
    {
      path: "/receive",
      title: t("Receive"),
      element: <ReceivePage />,
    },
    {
      path: "/receive/:address",
      backPath: "/receive",
      element: <AddressChain />,
      title: t("Copy Address"),
    },
    {
      path: "/send/*",
      element: <SendTx />,
    },
    {
      path: "/asset/:chain/:denom",
      element: <AssetPage />,
      backPath: "/",
      title: t("Asset"),
    },
    {
      path: `/asset/${chainID}/${encode("uluna")}/vesting`,
      element: <VestingDetailsPage />,
      backPath: `/asset/${chainID}/${encode("uluna")}`,
      title: t("Vesting Details"),
    },
  ]
}

export default function WalletRouter() {
  const routes = useWalletRoutes()
  return (
    <Routes>
      {routes.map((route, i) => (
        <Route
          key={i}
          path={route.path}
          element={
            route.title ? (
              <ExtensionPage
                title={route.title}
                backButtonPath={route.backPath}
                modal
              >
                {route.element}
              </ExtensionPage>
            ) : (
              route.element
            )
          }
        />
      ))}
    </Routes>
  )
}
