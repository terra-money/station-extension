import { useManageWallet } from "auth/modules/manage/ManageWallets"
import ExtensionList from "../components/ExtensionList"

const ManageWallet = () => {
  const manageWallet = useManageWallet()
  if (!manageWallet) return null
  return <ExtensionList list={manageWallet} />
}

export default ManageWallet
