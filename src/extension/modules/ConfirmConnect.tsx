import { useTranslation } from "react-i18next"
import { Grid } from "components/layout"
import { ConnectRequest } from "../utils"
import ConfirmButtons from "../components/ConfirmButtons"
import { useRequest } from "../RequestContainer"
import styles from "./ConfirmConnect.module.scss"

const ConfirmConnect = ({ origin }: ConnectRequest) => {
  const { t } = useTranslation()
  const { actions } = useRequest()
  const { hostname } = new URL(origin)

  return (
    <div className={styles.overlay}>
      <Grid gap={28}>
        <header className="center">
          <Grid gap={8}>
            <h1 className={styles.title}>{t("Connect to application")}</h1>
            <p>{hostname}</p>
            <p className="muted">
              {t("Permission granted to this site")}: {t("View wallet address")}
            </p>
          </Grid>
        </header>

        <ConfirmButtons
          buttons={[
            {
              onClick: () => actions.connect(origin, false),
              children: t("Deny"),
            },
            {
              onClick: () => actions.connect(origin, true),
              children: t("Connect"),
            },
          ]}
        />
      </Grid>
    </div>
  )
}

export default ConfirmConnect
