import { useTranslation } from "react-i18next"
import { useThemeFavicon } from "data/settings/Theme"
import { FlexColumn } from "components/layout"
import styles from "./Welcome.module.scss"

const Welcome = () => {
  const { t } = useTranslation()
  const favicon = useThemeFavicon()

  return (
    <FlexColumn gap={24} className={styles.component}>
      <img src={favicon} alt="Terra Station" width={80} height={80} />
      <p className={styles.content}>{t("Connect to Terra blockchain")}</p>
    </FlexColumn>
  )
}

export default Welcome
