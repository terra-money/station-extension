import { SectionHeader, Timeline } from "station-ui"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import { SwapState } from "data/queries/swap/types"

const SwapTimeline = ({
  offerAsset,
  askAsset,
  route,
  offerAmount,
}: SwapState) => {
  const { t } = useTranslation()
  if (!route) return null

  const startItem = {
    chain: {
      label: offerAsset.chain.name,
      icon: offerAsset.chain.icon,
    },
    coin: {
      icon: offerAsset.icon ?? "",
      label: offerAsset.symbol,
    },
    msg: toInput(offerAmount, offerAsset.decimals) + " " + offerAsset.symbol,
  }
  const endItem = {
    chain: {
      label: askAsset.chain.name,
      icon: askAsset.chain.icon,
    },
    coin: {
      icon: askAsset.icon ?? "",
      label: askAsset.symbol,
    },
    msg: toInput(route.amountOut, askAsset.decimals) + " " + askAsset.symbol,
  }

  return (
    <>
      <SectionHeader title={t("Swap Path")} withLine />
      <Timeline startItem={startItem} endItem={endItem} />
    </>
  )
}

export default SwapTimeline
