import { useTranslation } from "react-i18next"
import ExtensionPage from "../components/ExtensionPage"
import ExportWalletForm from "auth/modules/manage/ExportWalletForm"
import { useParams } from "react-router-dom"

const ExportWalletPage = () => {
  const { t } = useTranslation()
  const { walletName } = useParams()
  if (!walletName) return null

  return (
    <ExtensionPage
      title={t("Export wallet")}
      subtitle={walletName}
      backButtonPath={`/manage-wallet/manage/${walletName}`}
      fullHeight
      modal
    >
      <ExportWalletForm walletName={walletName} />
    </ExtensionPage>
  )
}

export default ExportWalletPage
