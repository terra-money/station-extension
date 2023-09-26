import { useTranslation } from "react-i18next"
import RecoverWalletForm from "auth/modules/create/RecoverWalletForm"
import ExtensionPage from "../components/ExtensionPage"

const RecoverWallet = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage title={t("Import Wallet")} backButtonPath="/" fullHeight>
      <RecoverWalletForm />
    </ExtensionPage>
  )
}

export default RecoverWallet
