import { useTranslation } from "react-i18next"
import ExtensionPage from "../components/ExtensionPage"
import DeleteWalletForm from "auth/modules/manage/DeleteWalletForm"

const DeleteWalletPage = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage title={t("Delete wallet")}>
      <DeleteWalletForm />
    </ExtensionPage>
  )
}

export default DeleteWalletPage
