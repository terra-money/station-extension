import { useManageWallet } from "auth/modules/manage/ManageWallets"
import ExtensionList from "../components/ExtensionList"

interface Props {
  wallet: string
}

const ManageWallet = ({ wallet }: Props) => {
  const manageWallet = useManageWallet(wallet)
  if (!manageWallet) return null
  return <ExtensionList list={manageWallet} />
}

export default ManageWallet
