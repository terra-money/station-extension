import { Banner } from "@terra-money/station-ui"
import { useSwap } from "../SwapContext"
import { useBalances } from "data/queries/bank"
import { toAmount } from "@terra-money/terra-utils"
import { useTranslation } from "react-i18next"

const Errors = ({ feeDenom }: { feeDenom: string }) => {
  const { t } = useTranslation()
  const { form } = useSwap()
  const { data: balances } = useBalances()
  const { route, offerAsset, offerInput } = form.watch()
  const ops = route?.operations.map((op) => Object.keys(op)[0])
  const hasTransfer = ops?.includes("transfer")
  const balance = balances?.find((b) => b.denom === offerAsset?.denom)?.amount
  const offerAmount = toAmount(offerInput, { decimals: offerAsset?.decimals })
  const swappingFeeDenom =
    offerAsset.denom === feeDenom && balance === offerAmount

  return (
    <>
      {hasTransfer && (
        <Banner
          title={t(
            "You are swapping between assets located on different chains - this action requires both a bridge and a swap, which can take longer and result in a higher total transaction cost"
          )}
          variant="warning"
        />
      )}
      {swappingFeeDenom && (
        <Banner
          title={t(
            "You are swapping your entire balance. If this is a fee token you may need it to complete the transaction"
          )}
          variant="warning"
        />
      )}
    </>
  )
}
export default Errors
