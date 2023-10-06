import { useManageWallet } from "auth/modules/manage/ManageWallets"
import ExtensionList from "../components/ExtensionList"

interface Props {
  wallet: string
}

const ManageWallet = ({ wallet }: Props) => {
  // TODO: actions for specific wallets
  const manageWallet = useManageWallet()
  if (!manageWallet) return null
  return <ExtensionList list={manageWallet} />
}

export default ManageWallet
