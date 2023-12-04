import { useTranslation } from "react-i18next"
import { useNetwork } from "data/wallet"
import { Grid } from "components/layout"
import { ToNow } from "components/display"
import { Read } from "components/token"
import { getIsNativeMsgFromExternal, TxRequest } from "../utils"
import Message from "./Message"
import { useNativeDenoms, DEFAULT_NATIVE_DECIMALS } from "data/token"
import { SummaryTable } from "@terra-money/station-ui"

const TxDetails = ({ origin, timestamp, tx }: TxRequest) => {
  const { msgs, memo, fee, chainID } = tx

  const { t } = useTranslation()
  const network = useNetwork()
  const readNativeDenom = useNativeDenoms()

  const fees = fee?.amount.toData()
  const contents = [
    { label: t("Network"), value: `${network[chainID]?.name} (${chainID})` },
    { label: t("Timestamp"), value: <ToNow update>{timestamp}</ToNow> },
    {
      label: t("Fee"),
      value:
        fees &&
        fees.map((fee) => (
          <Read
            {...fee}
            decimals={
              readNativeDenom(fee.denom).decimals ?? DEFAULT_NATIVE_DECIMALS
            }
          />
        )),
    },
    { label: t("Memo"), value: memo },
  ]

  return (
    <Grid gap={12}>
      {msgs.map((msg, index) => {
        const isNative = getIsNativeMsgFromExternal(origin)
        return <Message msg={msg} warn={isNative(msg)} key={index} />
      })}

      <SummaryTable rows={contents.filter(({ value }) => !!value)} />
    </Grid>
  )
}

export default TxDetails
