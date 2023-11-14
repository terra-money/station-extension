import { Form, SubmitButton, SectionHeader, SummaryTable } from "station-ui"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import SwapTimeline from "./components/SwapTimeline"
import { toInput } from "txs/utils"

const Confirm = () => {
  const { state: swapState } = useLocation()
  const { t } = useTranslation()

  const rows = [
    {
      label: t("Min Received"),
      value: toInput(swapState.route.amountOut, swapState.askAsset.decimals),
    },
    {
      label: t("Transaction Fee"),
      value: "tbd",
    },
    {
      label: t("Price Impact"),
      value: "tbd",
    },
  ]

  return (
    // <Tx>
    <Form>
      <SwapTimeline {...swapState} />
      <SectionHeader title={t("Details")} withLine />
      <SummaryTable rows={rows} />
      <SubmitButton label={t("Confirm")} icon={<span></span>} />
    </Form>
    // </Tx>
  )
}

export default Confirm
