import { SectionHeader, Timeline, ActivityListItem } from "station-ui"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import { SwapState } from "data/queries/swap/types"
import { swapVenueToName } from "data/queries/swap/types"
import React from "react"
import { capitalize } from "@mui/material"

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
      msg={`Swap ${offerInput} ${offerAsset.symbol} for ${toInput(
        route.amountOut,
        askAsset.decimals
      )} ${askAsset.symbol} on ${askAsset.chain.name} via ${
        swapVenueToName[route.swapVenue]
      }`}
      type={"Execute Contract"}
      msgCount={route.operations.length}
      hasTimeline
    />
  )

  const middleItems = route.timelineMsgs.map((msg) => {
    let msgText
    if (msg.type === "transfer")
      msgText = `${capitalize(msg.type)} ${msg.symbol} from ${msg.from} to ${
        msg.to
      }`
    if (msg.type === "swap")
      msgText = `${capitalize(msg.type)} ${msg.offerAssetSymbol} for ${
        msg.askAssetSymbol
      } on ${swapVenueToName[msg.venue]}`
    return {
      variant: "success",
      msg: <span>{msgText}</span> ?? ((<></>) as React.ReactNode),
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
