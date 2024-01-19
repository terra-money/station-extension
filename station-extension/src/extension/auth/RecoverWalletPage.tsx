import { useTranslation } from "react-i18next"
import RecoverWalletForm from "auth/modules/create/RecoverWalletForm"
import ExtensionPage from "../components/ExtensionPage"
import { useLocation } from "react-router-dom"

const RecoverWallet = () => {
  const { t } = useTranslation()
  const { hash } = useLocation()
  const step = Number(hash.replace("#", "")) || 1

  const steps = [
    {
      title: "Import Wallet",
      subtitle:
        "Enter your preferred wallet name and the wallet's recovery phrase or seed key.",
    },
    {
      title: "Select wallet",
      subtitle: "Select the wallet derivation path you would like to use.",
    },
    {
      title: "",
      subtitle: "",
    },
    {
      title: "Import Wallet Success.",
      subtitle: "",
    },
  ]

  const { title, subtitle } = steps[step - 1] || { title: "", subtitle: "" }

  return (
    <ExtensionPage title={t(title)} subtitle={t(subtitle)} fullHeight>
      <RecoverWalletForm />
    </ExtensionPage>
  )
}

export default RecoverWallet
