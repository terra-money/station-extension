import { DropdownArrowIcon, WalletIcon } from "@terra-money/station-ui"
import BluetoothIcon from "@mui/icons-material/Bluetooth"
import styles from "./ManageWalletsButton.module.scss"
import { forwardRef, ForwardedRef } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import UsbIcon from "@mui/icons-material/Usb"
import is from "auth/scripts/is"
import { bech32 } from "bech32"
import { useAuth } from "auth"

const ManageWalletsButton = forwardRef(
  (_, ref: ForwardedRef<HTMLButtonElement>) => {
    const navigate = useNavigate()
    const { wallet, wallets } = useAuth()
    const { t } = useTranslation()

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

    if (!selectedWallet && !isLedger) {
      return (
        <button
          className={styles.manage__wallets}
          onClick={() => navigate("/")}
          ref={ref}
        >
          <WalletIcon width={18} height={18} /> {t("Connect wallet")}
        </button>
      )
    }

    return (
      <button
        className={styles.manage__wallets}
        style={{ margin: "24px 0px 16px 2px" }}
        data-testid="manage-wallets-button"
        onClick={() => navigate("/manage-wallet/select")}
        ref={ref}
      >
        {isLedger ? (
          wallet.bluetooth ? (
            <BluetoothIcon width={18} height={18} />
          ) : (
            <UsbIcon width={18} height={18} />
          )
        ) : (
          <WalletIcon fill={"var(--token-dark-900)"} width={18} height={18} />
        )}{" "}
        <div className={styles.selector}>
          <span>{wallet && "name" in wallet ? wallet.name : "Ledger"}</span>
          <DropdownArrowIcon
            style={{
              marginLeft: "8px",
            }}
            fill={"var(--token-dark-900)"}
            width={13}
            height={13}
          />
        </div>
      </button>
    )
  }
)

export default ManageWalletsButton
