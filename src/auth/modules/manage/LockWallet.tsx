import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import QrCodeIcon from "@mui/icons-material/QrCode"
import PasswordIcon from "@mui/icons-material/Password"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined"
import LogoutIcon from "@mui/icons-material/Logout"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { Col, Page } from "components/layout"
import is from "../../scripts/is"
import useAuth from "../../hooks/useAuth"
import AuthList from "../../components/AuthList"
import ConnectedWallet from "./ConnectedWallet"
import { useManageWallet } from "./ManageWallets"

const ManageWallets = () => {
  const { t } = useTranslation()
  const { wallet, disconnect, lock } = useAuth()

  const list = useManageWallet()
  console.log("list", list)

  return (
    <Page title={t("Manage wallets")}>
      <Col>{list && <AuthList list={list} />}</Col>
    </Page>
  )
}
export default ManageWallets
