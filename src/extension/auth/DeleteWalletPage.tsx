import { useTranslation } from "react-i18next"
import ExtensionPage from "../components/ExtensionPage"
import DeleteWalletForm from "auth/modules/manage/DeleteWalletForm"
import { useParams } from "react-router-dom"

const DeleteWalletPage = () => {
  const { t } = useTranslation()
  const { walletName } = useParams()
  if (!walletName) return null

  return (
    <ExtensionPage
      title={t("Delete wallet")}
      subtitle={walletName}
      backButtonPath={`/manage-wallet/manage/${walletName}`}
      fullHeight
      modal
    >
      <DeleteWalletForm walletName={walletName} />
    </ExtensionPage>
  )
}

export default DeleteWalletPage
