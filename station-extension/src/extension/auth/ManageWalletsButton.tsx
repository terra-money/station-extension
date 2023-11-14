import { useAuth } from "auth"
import { bech32 } from "bech32"
import is from "auth/scripts/is"
import styles from "./ManageWalletsButton.module.scss"
// icons
import { ReactComponent as WalletIcon } from "styles/images/icons/Wallet.svg"
import UsbIcon from "@mui/icons-material/Usb"
import BluetoothIcon from "@mui/icons-material/Bluetooth"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { useNavigate } from "react-router-dom"

export default function ManageWalletsButton() {
  const navigate = useNavigate()

  const { wallet, wallets } = useAuth()

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
      <button className={styles.manage__wallets} onClick={() => navigate("/")}>
        <WalletIcon style={{ fontSize: 20 }} /> Connect wallet
      </button>
    )

  return (
    <button
      className={styles.manage__wallets}
      data-testid="manage-wallets-button"
      onClick={() => navigate("/manage-wallet/select")}
    >
      {isLedger ? (
        wallet.bluetooth ? (
          <BluetoothIcon style={{ fontSize: 18 }} />
        ) : (
          <UsbIcon style={{ fontSize: 18 }} />
        )
      ) : (
        <WalletIcon style={{ fontSize: 18 }} />
      )}{" "}
      {wallet && "name" in wallet ? wallet.name : "Ledger"}
      <ArrowDropDownIcon style={{ marginLeft: "-6px", fontSize: "1.25rem" }} />
    </button>
  )
}
