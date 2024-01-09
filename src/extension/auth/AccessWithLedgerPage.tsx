import { useTranslation } from "react-i18next"
import AccessWithLedgerForm from "auth/ledger/AccessWithLedgerForm"
import ExtensionPage from "../components/ExtensionPage"
import { useState } from "react"

export enum Pages {
  form = "form",
  askCosmos = "askCosmos",
  choosePasswordForm = "choosePasswordForm",
  complete = "complete",
}

const AccessWithLedgerPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(Pages.form)

  let title, subtitle

  switch (page) {
    case Pages.form:
      title = "Access with Ledger"
      subtitle = "Enter your preferred wallet name and mode of connection"
      break
    case Pages.choosePasswordForm:
      title = "Set a password"
      subtitle =
        "Set a global password for your wallet on this device. Choose a strong password with more than 10 characters."
      break
    default:
      title = ""
      subtitle = ""
  }

  return (
    <ExtensionPage title={t(title)} subtitle={t(subtitle)} fullHeight>
      <AccessWithLedgerForm page={page} setPage={setPage} />
    </ExtensionPage>
  )
}

export default AccessWithLedgerPage
