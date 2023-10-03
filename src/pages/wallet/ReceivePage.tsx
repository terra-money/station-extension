import { useTranslation } from "react-i18next"
import styles from "./ReceivePage.module.scss"
import { capitalize } from "@mui/material"
import Addresses from "./Addresses"

const ReceivePage = () => {
  const { t } = useTranslation()
  return (
    <section className={styles.receive}>
      <h1>{capitalize(t("receive"))}</h1>
      {/* <Addresses /> */}
    </section>
  )
}

export default ReceivePage
