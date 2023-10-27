import { Route, Routes, useLocation } from "react-router-dom"
import AssetPage from "./AssetPage"
import ReceivePage from "./ReceivePage"
import AddressChain from "pages/wallet/AddressChain"
import SendPage from "./SendPage"
import WalletMain from "./WalletMain"
import { useTranslation } from "react-i18next"
import ExtensionPage from "extension/components/ExtensionPage"
import VestingDetailsPage from "./VestingDetailsPage"

interface IRoute {
  path: string
  element: React.ReactNode
  title: string
  backPath?: string
}

export const useWalletRoutes = (): IRoute[] => {
  const { t } = useTranslation()
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
      backPath: "receive",
      element: <AddressChain />,
      title: t("Copy Address"),
    },
    {
      path: "/send/*",
      title: t("Send"),
      element: <SendPage />,
    },
    {
      path: "/asset/:denom",
      element: <AssetPage />,
      backPath: "/",
      title: t("Asset"),
    },
    {
      path: "/asset/uluna/vesting",
      element: <VestingDetailsPage />,
      backPath: "asset/uluna",
      title: t("Vesting Details"),
    },
  ]
}

const getBackPath = (pathname: string) => {
  if (pathname.includes("/send/")) {
    const stepMatch = pathname.match(/\/send\/(\d+)/)
    if (stepMatch?.[1]) {
      const step = Number(stepMatch[1])
      return step > 1 ? `/send/${step - 1}` : "/"
    }
  }
}

export default function WalletRouter() {
  const routes = useWalletRoutes()
  const { pathname } = useLocation()

  return (
    <Routes>
      {routes.map((route, i) => (
        <Route
          key={i}
          path={route.path}
          element={
            <ExtensionPage
              fullHeight
              title={route.title}
              backButtonPath={getBackPath(pathname) ?? route.backPath}
              modal
            >
              {route.element}
            </ExtensionPage>
          }
        />
      ))}
    </Routes>
  )
}
