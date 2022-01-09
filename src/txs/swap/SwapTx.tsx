import { useTranslation } from "react-i18next"
import { Page } from "components/layout"
import TxContext from "../TxContext"
import SwapContext from "./SwapContext"
import SingleSwapContext from "./SingleSwapContext"
import SwapForm from "./SwapForm"

// The sequence below is required before rendering the Swap form:
// 1. `TxContext` - Fetch gas prices through, like other forms.
// 2. `SwapContext` - Complete the network request related to swap.
// 3. `SwapSingleContext` - Complete the network request not related to multiple swap

const SwapTx = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("Swap")} small>
      <TxContext>
        <SwapContext>
          <SingleSwapContext>
            <SwapForm />
          </SingleSwapContext>
        </SwapContext>
      </TxContext>
    </Page>
  )
}

export default SwapTx
