import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { useManageWallet } from "auth/modules/manage/ManageWallets"
import ExtensionList from "extension/components/ExtensionList"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"
import { Grid } from "@terra-money/station-ui"
import WalletNameInput from "./WalletNameInput"

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
    <ExtensionPageV2
      title={t("Manage wallet")}
      fullHeight
      backButtonPath="/manage-wallet/select"
      subtitle={wallet}
    >
      <Grid gap={16}>
        <WalletNameInput />
        <ExtensionList list={manageWallet} />
      </Grid>
    </ExtensionPageV2>
  )
}
