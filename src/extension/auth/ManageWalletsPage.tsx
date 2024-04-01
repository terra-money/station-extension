import { useNavigate, useParams } from "react-router-dom"
import { useManageWallet } from "auth/modules/manage/ManageWallets"
import ExtensionList from "extension/components/ExtensionList"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"
import { Grid } from "@terra-money/station-ui"
import WalletNameInput from "./WalletNameInput"
import useAddress from "auth/hooks/useAddress"
import { truncate } from "@terra-money/terra-utils"

export default function ManageWalletsPage() {
  const { wallet } = useParams()
  const manageWallet = useManageWallet(wallet ?? "")
  const navigate = useNavigate()
  const address = useAddress()

  if (!manageWallet || !wallet) {
    navigate("/manage-wallet/select")
    return null
  }

  return (
    <ExtensionPageV2
      title={wallet}
      fullHeight
      backButtonPath="/manage-wallet/select"
      subtitle={truncate(address, [11, 6])}
    >
      <Grid gap={16}>
        <WalletNameInput />
        <ExtensionList list={manageWallet} />
      </Grid>
    </ExtensionPageV2>
  )
}
