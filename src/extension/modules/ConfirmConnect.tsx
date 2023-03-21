import { useTranslation } from "react-i18next"
import { Grid } from "components/layout"
import { ConnectRequest } from "../utils"
import ConfirmButtons from "../components/ConfirmButtons"
import { useRequest } from "../RequestContainer"
import styles from "./ConfirmConnect.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import OriginCard from "extension/components/OriginCard"
import BottomCard from "extension/components/BottomCard"

const ConfirmConnect = ({ origin }: ConnectRequest) => {
  const { t } = useTranslation()
  const { actions } = useRequest()
  const { hostname } = new URL(origin)

  return (
    <ExtensionPage header={<OriginCard hostname={hostname} />}>
      <Grid gap={28}>
        <header className="center">
          <Grid gap={8}>
            <h1 className={styles.title}>{t("Connect to application")}</h1>
            <p className="muted">
              {t("Permission granted to this site")}: {t("View wallet address")}
            </p>
          </Grid>
        </header>
        <BottomCard>
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
        </BottomCard>
      </Grid>
    </ExtensionPage>
  )
}

export default ConfirmConnect
