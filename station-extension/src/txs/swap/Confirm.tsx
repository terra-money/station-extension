import { Form, SubmitButton, SectionHeader, SummaryTable } from "station-ui"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Tx from "txs/Tx"
import SwapTimeline from "./components/SwapTimeline"

const Confirm = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { state } = location
  const rows = [
    {
      label: t("Min Received"),
      value: state.route.amountOut,
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
      <SwapTimeline {...state} />
      <SectionHeader title={t("Details")} withLine />
      <SummaryTable rows={rows} />
      <SubmitButton label={t("Confirm")} icon={<span></span>} />
    </Form>
    // </Tx>
  )
}

export default Confirm
