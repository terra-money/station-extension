import { ButtonItem, LinkItem } from "extension/components/ExtensionList"
import { useTranslation } from "react-i18next"
import { openURL } from "extension/storage"
import useAuth from "../../hooks/useAuth"
import is from "../../scripts/is"
import {
  AlertIcon,
  MultisigIcon,
  QRCodeIcon,
  TrashIcon,
} from "@terra-money/station-ui"

export const useManageWallet = (walletName: string) => {
  const { t } = useTranslation()
  const { wallets, connectedWallet } = useAuth()

  const wallet = wallets.find((w) => w.name === walletName)

  const toExport = {
    to: `/auth/export/${walletName}`,
    children: t("Export wallet"),
    icon: <QRCodeIcon fill="var(--token-light-white)" width={14} height={14} />,
  }

  const toDelete = {
    to: `/auth/delete/${walletName}`,
    children: t("Delete wallet"),
    icon: <TrashIcon fill="var(--token-light-white)" width={14} height={14} />,
  }

  const toSignMultisig = connectedWallet?.name === walletName && {
    onClick: () => openURL("/multisig/sign"),
    children: t("Sign Multisig Tx"),
    icon: (
      <MultisigIcon fill="var(--token-light-white)" width={14} height={14} />
    ),
  }

  const toPostMultisig = connectedWallet?.name === walletName && {
    onClick: () => openURL("/multisig/post"),
    children: t("Post a multisig tx"),
    icon: (
      <MultisigIcon fill="var(--token-light-white)" width={14} height={14} />
    ),
  }

  const toUpgradeWallet = !(wallet as any)?.words?.["60"] && {
    to: `/manage-wallet/upgrade/${walletName}`,
    children: t("Upgrade Wallet"),
    icon: <AlertIcon fill="var(--token-primary-500)" width={14} height={14} />,
  }

  if (!wallet) return

  return (
    is.multisig(wallet)
      ? [toPostMultisig, toDelete]
      : is.ledger(wallet)
      ? [toSignMultisig, toDelete]
      : [toExport, toDelete, toSignMultisig, toUpgradeWallet]
  ).filter((opt) => !!opt) as (LinkItem | ButtonItem)[]
}
