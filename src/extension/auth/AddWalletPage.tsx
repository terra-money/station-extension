import { useTranslation } from "react-i18next"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"
import AddWallet from "./AddWallet"

export default function AddWalletPage() {
  const { t } = useTranslation()

  return (
    <ExtensionPageV2
      title={t("Add wallet")}
      fullHeight
      backButtonPath="/manage-wallet/select"
    >
      <AddWallet />
    </ExtensionPageV2>
  )
}
