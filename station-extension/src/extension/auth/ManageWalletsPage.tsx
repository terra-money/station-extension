import { useManageWallet } from "auth/modules/manage/ManageWallets"
import ExtensionList from "extension/components/ExtensionList"
import ExtensionPage from "extension/components/ExtensionPage"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"

export default function ManageWalletsPage() {
  const { t } = useTranslation()
  const { wallet } = useParams()
  const manageWallet = useManageWallet(wallet ?? "")
  const navigate = useNavigate()

  if (!manageWallet || !wallet) {
    navigate("/manage-wallet/select")
    return null
  }

  return (
    <ExtensionPage
      title={t("Manage wallet")}
      fullHeight
      modal
      backButtonPath="/manage-wallet/select"
      subtitle={wallet}
    >
      <ExtensionList list={manageWallet} />
    </ExtensionPage>
  )
}
