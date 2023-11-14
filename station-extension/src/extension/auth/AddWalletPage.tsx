import ExtensionPage from "extension/components/ExtensionPage"
import { useTranslation } from "react-i18next"
import AddWallet from "./AddWallet"

export default function AddWalletPage() {
  const { t } = useTranslation()

  return (
    <ExtensionPage
      title={t("Add wallet")}
      fullHeight
      modal
      backButtonPath="/manage-wallet/select"
    >
      <AddWallet />
    </ExtensionPage>
  )
}
