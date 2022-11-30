import { useTranslation } from "react-i18next"
import AddIcon from "@mui/icons-material/Add"
import { ModalButton } from "components/feedback"
import AddWallet from "./AddWallet"
import styles from "./ConnectedWallet.module.scss"
import { Button } from "components/general"

const AddWalletButton = () => {
  const { t } = useTranslation()

  return (
    <ModalButton
      title={t("Add a wallet")}
      renderButton={(open) => (
        <Button className={styles.add__button} onClick={open}>
          <AddIcon style={{ fontSize: 18 }} />
          {t("Add a wallet")}
        </Button>
      )}
    >
      <AddWallet />
    </ModalButton>
  )
}

export default AddWalletButton
