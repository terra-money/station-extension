import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { useNetwork } from "data/wallet"
import { Grid } from "components/layout"
import { Dl, ToNow } from "components/display"
import { ReadMultiple } from "components/token"
import { getIsNativeMsgFromExternal, TxRequest } from "../utils"
import Message from "./Message"
import styles from "./TxDetails.module.scss"

const TxDetails = ({ origin, timestamp, tx }: TxRequest) => {
  const { msgs, memo, fee, chainID } = tx

  const { t } = useTranslation()
  const network = useNetwork()

  const fees = fee?.amount.toData()
  const contents = [
    { title: t("Network"), content: `${network[chainID]?.name} (${chainID})` },
    { title: t("Origin"), content: origin },
    { title: t("Timestamp"), content: <ToNow update>{timestamp}</ToNow> },
    { title: t("Fee"), content: fees && <ReadMultiple list={fees} /> },
    { title: t("Memo"), content: memo },
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

      {msgs.map((msg, index) => {
        const isNative = getIsNativeMsgFromExternal(origin)
        return <Message msg={msg} warn={isNative(msg)} key={index} />
      })}
    </Grid>
  )
}

export default TxDetails
