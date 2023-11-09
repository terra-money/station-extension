import { useTranslation } from "react-i18next"
import ExtensionPage from "extension/components/ExtensionPage"
import SwapForm from "./SwapForm"
import SwapContext from "./SwapContext"

// The sequence below is required before rendering the Swap form:
// 1. `SwapContext` - Complete the network request related to swap.
// 2. `SwapSingleContext` - Complete the network request not related to multiple swap

const SwapTx = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage fullHeight title={t("Swap")} modal>
      <SwapContext>
        <SwapForm />
      </SwapContext>
    </ExtensionPage>
  )
}

export default SwapTx
