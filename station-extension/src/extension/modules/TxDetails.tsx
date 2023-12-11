import { useTranslation } from "react-i18next"
import { useNetwork } from "data/wallet"
import { Grid } from "components/layout"
import { ToNow } from "components/display"
import { getIsNativeMsgFromExternal, TxRequest } from "../utils"
import Message from "./Message"
import DisplayFees from "txs/feeAbstraction/DisplayFees"

const TxDetails = ({
  origin,
  timestamp,
  tx,
  onFeesReady,
}: TxRequest & { onFeesReady: () => void }) => {
  const { msgs, memo, fee, chainID } = tx

  const { t } = useTranslation()
  const network = useNetwork()

  const contents = [
    { label: t("Network"), value: `${network[chainID]?.name} (${chainID})` },
    { label: t("Timestamp"), value: <ToNow update>{timestamp}</ToNow> },
    { label: t("Memo"), value: memo },
  ]

  return (
    <Grid gap={12}>
      {msgs.map((msg, index) => {
        const isNative = getIsNativeMsgFromExternal(origin)
        return <Message msg={msg} warn={isNative(msg)} key={index} />
      })}

      <DisplayFees
        chainID={chainID}
        gas={fee?.gas_limit}
        gasDenom={fee?.amount.denoms()[0]}
        descriptions={contents.filter(({ value }) => !!value)}
        setGasDenom={() => {}}
        onReady={() => onFeesReady()}
      />
    </Grid>
  )
}

export default TxDetails
