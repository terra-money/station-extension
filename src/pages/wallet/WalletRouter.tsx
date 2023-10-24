import { Route, Routes, useParams } from "react-router-dom"
import AssetPage from "./AssetPage"
import ReceivePage from "./ReceivePage"
import AddressChain from "pages/wallet/AddressChain"
import SendPage from "./SendPage/SendPage"
import WalletMain from "./WalletMain"
import { useTranslation } from "react-i18next"
import ExtensionPage from "extension/components/ExtensionPage"

export const useWalletRoutes = () => {
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
      path: "/receive/:chain/:address",
      element: <AddressChain />,
    },
    {
      path: "/send/:denom",
      title: t("Send"),
      element: <SendPage />,
    },
    {
      path: "/asset/:denom",
      element: <AssetPage />,
    },
  ]
}
export default function WalletRouter() {
  const routes = useWalletRoutes()
  return (
    <ExtensionPage fullHeight>
      <Routes>
        {routes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Routes>
    </ExtensionPage>
  )
}
