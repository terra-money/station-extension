import { ButtonItem, LinkItem } from "extension/components/ExtensionList"
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import QrCodeIcon from "@mui/icons-material/QrCode"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { openURL } from "extension/storage"
import useAuth from "../../hooks/useAuth"
import is from "../../scripts/is"

export const useManageWallet = (walletName: string) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { wallets, lock, connectedWallet } = useAuth()

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
      ? [toPostMultisig, toDelete]
      : is.ledger(wallet)
      ? [toSignMultisig, toDelete]
      : [toExport, toDelete, toSignMultisig]
  ).filter((opt) => !!opt) as (LinkItem | ButtonItem)[]
}
