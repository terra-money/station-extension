import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { Card, Grid } from "components/layout"
import { Dl, ToNow } from "components/display"
import { SignBytesRequest } from "../utils"
import styles from "./SignBytesDetails.module.scss"

const SignBytesDetails = ({ origin, timestamp, bytes }: SignBytesRequest) => {
  const { t } = useTranslation()

  const contents = [
    { title: t("Origin"), content: origin },
    { title: t("Timestamp"), content: <ToNow update>{timestamp}</ToNow> },
  ]

  return (
    <Grid gap={12}>
      <Dl className={styles.dl}>
        {contents.map(({ title, content }) => {
          if (!content) return null
          return (
            <Fragment key={title}>
              <dt>{title}</dt>
              <dd>{content}</dd>
            </Fragment>
          )
        })}
      </Dl>

      <Card size="small" bordered className={styles.bytes__card}>
        <header className={styles.header}>
          <p className={styles.title}>SignBytes</p>
        </header>

        <p>{bytes.toString("utf-8")}</p>
      </Card>
    </Grid>
  )
}

export default SignBytesDetails
