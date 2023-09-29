import { useTranslation } from "react-i18next"
import ExtensionPage from "../components/ExtensionPage"
import ExportWalletForm from "auth/modules/manage/ExportWalletForm"

const ExportWalletPage = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage title={t("Export wallet")} backButtonPath="/">
      <ExportWalletForm />
    </ExtensionPage>
  )
}

export default ExportWalletPage
