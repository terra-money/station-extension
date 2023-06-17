import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { Card, Grid } from "components/layout"
import { Dl, ToNow } from "components/display"
import { SignBytesRequest } from "../utils"
import styles from "./SignBytesDetails.module.scss"
import { isJSON } from "utils/json"
import { capitalize } from "@mui/material"
import { FinderLink } from "components/general"
import { AccAddress } from "@terra-money/feather.js"

const SignBytesDetails = ({ origin, timestamp, bytes }: SignBytesRequest) => {
  const { t } = useTranslation()

  const contents = [
    { title: t("Origin"), content: origin },
    { title: t("Timestamp"), content: <ToNow update>{timestamp}</ToNow> },
  ]

  const content = bytes.toString("utf-8")

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
          <p className={styles.title}>Signature Request</p>
        </header>

        {isJSON(content) ? (
          <Dl>
            {Object.entries(JSON.parse(content)).map(([key, value]) => (
              <Fragment key={key}>
                <dt>{capitalize(key)}</dt>
                <dd>
                  {typeof value === "string" && AccAddress.validate(value) ? (
                    <FinderLink value={value}>{value}</FinderLink>
                  ) : typeof value === "object" ? (
                    JSON.stringify(value)
                  ) : (
                    (value as any).toString()
                  )}
                </dd>
              </Fragment>
            ))}
          </Dl>
        ) : (
          <p>{bytes.toString("utf-8")}</p>
        )}
      </Card>
    </Grid>
  )
}

export default SignBytesDetails
