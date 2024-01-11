import { useTranslation } from "react-i18next"
import NewWalletForm from "auth/modules/create/NewWalletForm"
import ExtensionPage from "../components/ExtensionPage"
import { useLocation } from "react-router-dom"

const NewWallet = () => {
  const { t } = useTranslation()
  const { hash } = useLocation()
  const step = Number(hash.replace("#", "")) || 1

  const steps = [
    {
      title: "New Wallet",
      subtitle:
        "Enter your preferred wallet name and then write down your new recovery phrase",
    },
    {
      title: "Verify recovery phrase",
      subtitle:
        "Match the words below with your recovery phrase to confirm wallet creation",
    },
    {
      title: "Set Password",
      subtitle:
        "Set a global password for your wallet on this device. Choose a strong password with more than 10 characters.",
    },
    {
      title: "Wallet Creation Success",
      subtitle: "",
    },
  ]

  const { title, subtitle } = steps[step - 1] || { title: "", subtitle: "" }

  return (
    <ExtensionPage title={t(title)} subtitle={t(subtitle)} fullHeight>
      <NewWalletForm />
    </ExtensionPage>
  )
}

export default NewWallet
