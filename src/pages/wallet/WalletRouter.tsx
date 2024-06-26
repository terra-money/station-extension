import { encode } from "js-base64"
import { useTranslation } from "react-i18next"
import { Route, Routes } from "react-router-dom"
import AddressChain from "pages/wallet/AddressChain"
import { useChainID } from "data/wallet"
import VestingDetailsPage from "./VestingDetailsPage"
import ReceivePage from "./ReceivePage"
import SendTx from "./SendPage/SendTx"
import WalletMain from "./WalletMain"
import AssetPage from "./AssetPage"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"
import SendContext from "./SendPage/SendContext"

interface IRoute {
  path: string
  element: React.ReactNode
  title?: string
  backPath?: string
  isFullHeight?: boolean
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
      isFullHeight: true,
    },
    {
      path: "/receive/:address",
      backPath: "/receive",
      element: <AddressChain />,
      title: t("Copy Address"),
      isFullHeight: true,
    },
    {
      path: "/send/*",
      element: (
        <SendContext>
          <SendTx />
        </SendContext>
      ),
    },
    {
      path: "/asset/:chain/:denom",
      element: <AssetPage />,
      backPath: "/",
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
              <ExtensionPageV2
                title={route.title}
                backButtonPath={route.backPath}
                fullHeight={route.isFullHeight ?? false}
              >
                {route.element}
              </ExtensionPageV2>
            ) : (
              route.element
            )
          }
        />
      ))}
    </Routes>
  )
}
