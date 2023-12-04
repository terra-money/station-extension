import { useTranslation } from "react-i18next"
import { ConnectRequest } from "../utils"
import { useRequest } from "../RequestContainer"
import styles from "./ConfirmConnect.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import OriginCard from "extension/components/OriginCard"
import {
  Button,
  ButtonInlineWrapper,
  SummaryColumn,
} from "@terra-money/station-ui"

const ConfirmConnect = ({ origin }: ConnectRequest) => {
  const { t } = useTranslation()
  const { actions } = useRequest()
  const { hostname } = new URL(origin)

  return (
    <ExtensionPage>
      <article className={styles.container}>
        <div>
          <OriginCard hostname={hostname} />
          <SummaryColumn
            title={t("App Connect")}
            noWordBreak
            description={t(
              "{{website}} is requesting to connect to your wallet",
              {
                website: hostname,
              }
            )}
          />
        </div>
        <section className={styles.buttons__container}>
          <ButtonInlineWrapper>
            <Button
              variant="secondary"
              onClick={() => actions.connect(origin, false)}
              label={t("Reject")}
            />
            <Button
              variant="primary"
              onClick={() => actions.connect(origin, true)}
              label={t("Connect")}
            />
          </ButtonInlineWrapper>
        </section>
      </article>
    </ExtensionPage>
  )
}

export default ConfirmConnect
