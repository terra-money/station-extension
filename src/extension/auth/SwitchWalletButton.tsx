import { useTranslation } from "react-i18next"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import { useAddress } from "data/wallet"
import { ModalButton } from "components/feedback"
import { useAuth } from "auth"
import { useNetworkState } from "../../data/wallet"
import SwitchWallet from "./SwitchWallet"
import styles from "./ConnectedWallet.module.scss"

const SwitchWalletButton = () => {
  const { t } = useTranslation()
  const address = useAddress()
  const { wallets } = useAuth()
  const [network] = useNetworkState()

  const switchable = wallets.length > 1 || network === "localterra"
  if (!switchable) return null

  return (
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
