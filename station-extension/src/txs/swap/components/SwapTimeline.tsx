import { SectionHeader, Timeline, ActivityListItem } from "station-ui"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import { SwapState } from "data/queries/swap/types"
import { swapVenueToName } from "data/queries/swap/types"
import { capitalize } from "@mui/material"
import style from "../Swap.module.scss"

const SwapTimeline = ({
  offerAsset,
  askAsset,
  route,
  offerInput,
}: SwapState) => {
  const { t } = useTranslation()
  if (!route) return null

  const startOverride = (
    <ActivityListItem
      variant={"success"}
      chain={{
        label: offerAsset.chain.name,
        icon: offerAsset.chain.icon,
      }}
      msg={
        <>
          Swap{" "}
          <span className={style.text}>
            {" "}
            {offerInput} {offerAsset.symbol}
          </span>{" "}
          for{" "}
          <span className={style.green}>
            {" "}
            {toInput(route.amountOut, askAsset.decimals)} {askAsset.symbol}
          </span>{" "}
          on <span className={style.text}> {askAsset.chain.name}</span> via{" "}
          <span className={style.text}>
            {" "}
            {swapVenueToName[route.swapVenue]}
          </span>
        </>
      }
      type={"Execute Contract"}
      msgCount={route.operations.length}
      hasTimeline
    />
  )

  // eslint-disable-next-line array-callback-return
  const middleItems = route.timelineMsgs.map((msg) => {
    if (msg.type === "transfer")
      return {
        msg: (
          <>
            {capitalize(msg.type)} <span>{msg.symbol}</span> from{" "}
            <span>{msg.from}</span> to <span>{msg.to}</span>
          </>
        ),
        variant: "success",
      }
    if (msg.type === "swap")
      return {
        msg: (
          <>
            {capitalize(msg.type)}{" "}
            <span className={style.text}> {msg.offerAssetSymbol}</span> for{" "}
            <span className={style.text}> {msg.askAssetSymbol}</span> on{" "}
            <span className={style.text}> {swapVenueToName[msg.venue]}</span>
          </>
        ),
        variant: "success",
      }
  })

  return (
    <>
      <SectionHeader title={t("Swap Path")} withLine />
      {/* @ts-ignore */}
      <Timeline startOverride={startOverride} middleItems={middleItems} />
    </>
  )
}

export default SwapTimeline