import { useTranslation } from "react-i18next"
import ExtensionPage from "extension/components/ExtensionPage"
import Setup from "./Setup"
import Confirm from "./Confirm"
import SwapContext from "./SwapContext"
import { Routes, Route, useLocation } from "react-router-dom"

// The sequence below is required before rendering the Swap form:
// 1. `SwapContext` - Complete the network request related to swap.
// 2. `SwapSingleContext` - Complete the network request not related to multiple swap

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
        </Routes>
      </SwapContext>
    </ExtensionPage>
  )
}

export default SwapTx
