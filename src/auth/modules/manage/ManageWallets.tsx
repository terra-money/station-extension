import { ButtonItem, LinkItem } from "extension/components/ExtensionList"
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import PasswordIcon from "@mui/icons-material/Password"
import LogoutIcon from "@mui/icons-material/Logout"
import QrCodeIcon from "@mui/icons-material/QrCode"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import is from "../../scripts/is"

export const useManageWallet = (walletName: string) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { wallets, disconnect, lock, connectedWallet } = useAuth()

  const wallet = wallets.find((w) => w.name === walletName)

  const toExport = {
    to: `/auth/export/${walletName}`,
    children: t("Export wallet"),
    icon: <QrCodeIcon />,
  }

  // TODO: move into extension settings
  // eslint-disable-next-line
  const toPassword = {
    to: "/auth/password",
    children: t("Change password"),
    icon: <PasswordIcon />,
  }

  const toDelete = {
    to: `/auth/delete/${walletName}`,
    children: t("Delete wallet"),
    icon: <DeleteOutlineIcon />,
  }

  const toSignMultisig = connectedWallet?.name === walletName && {
    to: "/multisig/sign",
    children: t("Sign Multisig Tx"),
    icon: <FactCheckOutlinedIcon />,
  }

  const toPostMultisig = connectedWallet?.name === walletName && {
    to: "/multisig/post",
    children: t("Post a multisig tx"),
    icon: <FactCheckOutlinedIcon />,
  }

  const disconnectWallet = connectedWallet?.name === walletName && {
    onClick: () => {
      disconnect()
      navigate("/", { replace: true })
    },
    children: t("Disconnect"),
    icon: <LogoutIcon />,
  }

  // TODO: move into extension settings
  // eslint-disable-next-line
  const lockWallet = {
    onClick: () => {
      lock()
      navigate("/", { replace: true })
    },
    id: "lock",
    children: t("Lock"),
    icon: <LockOutlinedIcon />,
  }

  if (!wallet) return

  return (
    is.multisig(wallet)
      ? [toPostMultisig, toDelete, disconnectWallet]
      : is.ledger(wallet)
      ? [toSignMultisig, toDelete, disconnectWallet]
      : [toExport, toDelete, toSignMultisig, disconnectWallet]
  ).filter((opt) => !!opt) as (LinkItem | ButtonItem)[]
}
