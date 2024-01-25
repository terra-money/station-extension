import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import DeleteWalletForm from "auth/modules/manage/DeleteWalletForm"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"

const DeleteWalletPage = () => {
  const { t } = useTranslation()
  const { walletName } = useParams()
  if (!walletName) return null

  return (
    <ExtensionPageV2
      title={t("Delete wallet")}
      subtitle={walletName}
      backButtonPath={`/manage-wallet/manage/${walletName}`}
      fullHeight
    >
      <DeleteWalletForm walletName={walletName} />
    </ExtensionPageV2>
  )
}

export default DeleteWalletPage
