import { useTranslation } from "react-i18next"
import NewWalletForm from "auth/modules/create/NewWalletForm"
import ExtensionPage from "../components/ExtensionPage"

const NewWallet = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage
      title={t("New wallet")}
      subtitle={t(
        "Choose your wallet name, icon and then write down your new seed phrase"
      )}
      fullHeight
    >
      <NewWalletForm />
    </ExtensionPage>
  )
}

export default NewWallet
