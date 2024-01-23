import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import ExportWalletForm from "auth/modules/manage/ExportWalletForm"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"

const ExportWalletPage = () => {
  const { t } = useTranslation()
  const { walletName } = useParams()
  if (!walletName) return null

  return (
    <ExtensionPageV2
      title={t("Export wallet")}
      subtitle={walletName}
      backButtonPath={`/manage-wallet/manage/${walletName}`}
      fullHeight
    >
      <ExportWalletForm walletName={walletName} />
    </ExtensionPageV2>
  )
}

export default ExportWalletPage
