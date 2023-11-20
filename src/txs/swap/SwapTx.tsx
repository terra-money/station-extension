import { useTranslation } from "react-i18next"
import ExtensionPage from "extension/components/ExtensionPage"
import Setup from "./SwapSetup"
import Confirm from "./SwapConfirm"
import SwapContext from "./SwapContext"
import { Routes, Route, useLocation } from "react-router-dom"
import Slippage from "./SlippagePage"

const SwapTx = () => {
  const location = useLocation()
  const backPath = location.pathname.split("/").slice(0, -1).join("/")

  const { t } = useTranslation()
  return (
    <ExtensionPage fullHeight backButtonPath={backPath} title={t("Swap")} modal>
      <SwapContext>
        <Routes>
          <Route path="/" element={<Setup />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/slippage" element={<Slippage />} />
        </Routes>
      </SwapContext>
    </ExtensionPage>
  )
}

export default SwapTx
