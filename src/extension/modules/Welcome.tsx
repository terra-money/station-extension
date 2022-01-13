import { useTranslation } from "react-i18next"
import { useThemeFront } from "data/settings/Theme"
import { FlexColumn } from "components/layout"
import styles from "./Welcome.module.scss"

const Welcome = () => {
  const { t } = useTranslation()
  const front = useThemeFront()

  return (
    <FlexColumn gap={8} className={styles.component}>
      <img src={front} alt="Terra Station" width={120} height={145} />
      <p className={styles.content}>{t("Connect to Terra blockchain")}</p>
    </FlexColumn>
  )
}

export default Welcome
