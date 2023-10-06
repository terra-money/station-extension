import { useTranslation } from "react-i18next"
import NewWalletForm from "auth/modules/create/NewWalletForm"
import ExtensionPage from "../components/ExtensionPage"

const NewWallet = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage title={t("New wallet")} backButtonPath="/" fullHeight>
      <NewWalletForm />
    </ExtensionPage>
  )
}

export default NewWallet
