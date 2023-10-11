import { useTranslation } from "react-i18next"
import AccessWithLedgerForm from "auth/ledger/AccessWithLedgerForm"
import ExtensionPage from "../components/ExtensionPage"

const AccessWithLedgerPage = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage
      title={t("Access with Ledger")}
      //backButtonPath="/"
      subtitle=" "
      fullHeight
    >
      <AccessWithLedgerForm />
    </ExtensionPage>
  )
}

export default AccessWithLedgerPage
