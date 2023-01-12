import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded"
import AddIcon from "@mui/icons-material/Add"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import UsbIcon from "@mui/icons-material/Usb"
import BluetoothIcon from "@mui/icons-material/Bluetooth"
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
import { bech32 } from "bech32"
import is from "auth/scripts/is"

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
  const selectedWallet = wallets.find((w) => {
    if ("words" in w) {
      return w.words["330"] === wallet?.words["330"]
    } else {
      return (
        Buffer.from(bech32.decode(w.address).words).toString("hex") ===
        wallet?.words["330"]
      )
    }
  })
  const isLedger = is.ledger(wallet)

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
            <SwitchWallet manage={() => setPath(Path.manage)} />
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
      title={t("Manage Wallets")}
      renderButton={(open) => (
        <button
          onClick={() => {
            open()
            setPath(Path.select)
          }}
          className={styles.manage__wallets}
        >
          {isLedger ? (
            wallet.bluetooth ? (
              <BluetoothIcon style={{ fontSize: 18 }} />
            ) : (
              <UsbIcon style={{ fontSize: 18 }} />
            )
          ) : (
            <AccountBalanceWalletIcon style={{ fontSize: 18 }} />
          )}{" "}
          {isLedger ? "Ledger" : selectedWallet?.name}
          <ExpandMoreIcon style={{ fontSize: 18 }} />
        </button>
      )}
      maxHeight
    >
      {path !== Path.select && (
        <button
          onClick={() => setPath(Path.select)}
          style={{ position: "absolute", top: 16, left: 20 }}
        >
          <KeyboardBackspaceRoundedIcon style={{ fontSize: 24 }} />
        </button>
      )}

      {render()}
    </ModalButton>
  )
}
