import { useTranslation } from "react-i18next"
import NewMultisigWalletForm from "auth/modules/create/NewMultisigWalletForm"
import ExtensionPage from "../components/ExtensionPage"

const NewMultisigWalletPage = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage title={t("New multisig wallet")}>
      <NewMultisigWalletForm />
    </ExtensionPage>
  )
}

export default NewMultisigWalletPage
