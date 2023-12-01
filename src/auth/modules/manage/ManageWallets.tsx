import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import QrCodeIcon from "@mui/icons-material/QrCode"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined"
import LogoutIcon from "@mui/icons-material/Logout"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import is from "../../scripts/is"
import useAuth from "../../hooks/useAuth"
import { ButtonItem, LinkItem } from "extension/components/ExtensionList"
import { openURL } from "extension/storage"

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

  const toDelete = {
    to: `/auth/delete/${walletName}`,
    children: t("Delete wallet"),
    icon: <DeleteOutlineIcon />,
  }

  const toSignMultisig = connectedWallet?.name === walletName && {
    onClick: () => openURL("/multisig/sign"),
    children: t("Sign Multisig Tx"),
    icon: <FactCheckOutlinedIcon />,
  }

  const toPostMultisig = connectedWallet?.name === walletName && {
    onClick: () => openURL("/multisig/post"),
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
