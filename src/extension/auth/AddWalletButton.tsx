import { useTranslation } from "react-i18next"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import { ModalButton } from "components/feedback"
import AddWallet from "./AddWallet"
import styles from "./ConnectedWallet.module.scss"

const AddWalletButton = () => {
  const { t } = useTranslation()

  return (
    <ModalButton
      title={t("Add a wallet")}
      renderButton={(open) => (
        <button className={styles.button} onClick={open}>
          <AddCircleIcon style={{ fontSize: 16 }} />
          {t("Add a wallet")}
        </button>
      )}
    >
      <AddWallet />
    </ModalButton>
  )
}

export default AddWalletButton
