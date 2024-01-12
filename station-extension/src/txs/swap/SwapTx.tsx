import { useTranslation } from "react-i18next"
import ExtensionPage from "extension/components/ExtensionPage"
import Setup from "./SwapSetup"
import Confirm from "./SwapConfirm"
import SwapContext from "./SwapContext"
import { Routes, Route, useLocation } from "react-router-dom"
import SwapSettings from "./SwapSettingsPage"

const SwapTx = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const backPath = location.pathname.split("/").slice(0, -1).join("/")
  const routes = [
    { path: "/", element: <Setup />, title: "Swap" },
    { path: "/confirm", element: <Confirm />, title: "Confirm Swap" },
    {
      path: "/slippage",
      element: <SwapSettings />,
      title: "Slippage Settings",
    },
  ]

  return (
    <SwapContext>
      <Routes>
        {routes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={
              <ExtensionPage backButtonPath={backPath} title={t(r.title)} modal>
                {r.element}
              </ExtensionPage>
            }
          />
        ))}
      </Routes>
    </SwapContext>
  )
}

export default SwapTx
