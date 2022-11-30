import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import AddIcon from "@mui/icons-material/Add"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useAuth } from "auth"
import { ModalButton } from "components/feedback"
import { Button } from "components/general"
import { useAddress } from "data/wallet"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import AddWallet from "./AddWallet"
import ManageWallet from "./ManageWallet"
import styles from "./SelectWallets.module.scss"
import SwitchWallet from "./SwitchWallet"

enum Path {
  select = "select",
  manage = "manage",
  add = "add",
}

export default function ManageWallets() {
  const { wallet, wallets } = useAuth()
  const address = useAddress()
  const { t } = useTranslation()
  const [path, setPath] = useState(Path.select)
  const selectedWallet = wallets.find((w) => w.address === wallet?.address)
  const isLedger = (wallet as LedgerWallet)?.ledger

  if (!selectedWallet && !isLedger)
    return (
      <button className={styles.manage__wallets}>
        <AccountBalanceWalletIcon style={{ fontSize: 18 }} /> Connect wallet
      </button>
    )

  function render() {
    switch (path) {
      case Path.select:
        return (
          <>
            <SwitchWallet />
            <Button
              className={styles.add__button}
              onClick={() => setPath(Path.add)}
            >
              <AddIcon style={{ fontSize: 18 }} />
              {t("Add a wallet")}
            </Button>
          </>
        )

      case Path.add:
        return (
          <>
            <AddWallet />
          </>
        )

      case Path.manage:
        return (
          <>
            <ManageWallet />
          </>
        )
    }
  }

  return (
    <ModalButton
      title={t("Switch wallet")}
      renderButton={(open) => (
        <button
          onClick={() => {
            open()
            setPath(Path.select)
          }}
          className={styles.manage__wallets}
        >
          <AccountBalanceWalletIcon style={{ fontSize: 18 }} />{" "}
          {isLedger ? "Ledger" : selectedWallet?.name}
          <ExpandMoreIcon style={{ fontSize: 18 }} />
        </button>
      )}
      modalKey={address}
      maxHeight
    >
      {render()}
    </ModalButton>
  )
}
