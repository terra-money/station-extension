import { useTranslation } from "react-i18next"
import { Routes, Route, useLocation } from "react-router-dom"
import Setup from "./SwapSetup"
import Confirm from "./SwapConfirm"
import SwapContext from "./SwapContext"
import SwapSettings from "./SwapSettingsPage"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"

const SwapTx = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const backPath = location.pathname.split("/").slice(0, -1).join("/")
  const routes = [
    { path: "/", element: <Setup />, title: "Swap" },
    { path: "/confirm", element: <Confirm />, title: "Confirm Swap" },
    { path: "/slippage", element: <SwapSettings />, title: "Swap Settings" },
  ]

  return (
    <SwapContext>
      <Routes>
        {routes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={
              <ExtensionPageV2
                backButtonPath={backPath}
                title={t(r.title)}
                overNavbar={r.path !== "/"}
              >
                {r.element}
              </ExtensionPageV2>
            }
          />
        ))}
      </Routes>
    </SwapContext>
  )
}

export default SwapTx
