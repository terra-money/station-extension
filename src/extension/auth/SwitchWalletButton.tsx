import { useTranslation } from "react-i18next"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import { useAddress } from "data/wallet"
import { ModalButton } from "components/feedback"
import { useAuth } from "auth"
import SwitchWallet from "./SwitchWallet"
import styles from "./ConnectedWallet.module.scss"
import { useNetworkState } from "../../data/wallet"

const SwitchWalletButton = () => {
  const { t } = useTranslation()
  const address = useAddress()
  const { wallets } = useAuth()
  const [network] = useNetworkState()

  return (wallets.length < 2 && network !== "localterra") ||
    wallets.length === 0 ? null : (
    <ModalButton
      title={t("Switch wallet")}
      renderButton={(open) => (
        <button className={styles.button} onClick={open}>
          <AccountBalanceWalletIcon style={{ fontSize: 16 }} />
          {t("Switch wallet")}
        </button>
      )}
      modalKey={address}
      maxHeight
    >
      <SwitchWallet />
    </ModalButton>
  )
}

export default SwitchWalletButton
