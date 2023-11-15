import { Form, SectionHeader, SummaryTable } from "station-ui"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import SwapTimeline from "./components/SwapTimeline"
import { toInput } from "txs/utils"
import { useQuery } from "react-query"
import { SwapState } from "data/queries/swap/types"
import { toAmount } from "@terra-money/terra-utils"
import Tx from "txs/Tx"
import { useSwap } from "./SwapContext"

export const validateAssets = (
  assets: Partial<SwapState>
): assets is Required<SwapState> => {
  const { offerAsset, askAsset } = assets
  return !!offerAsset && !!askAsset && offerAsset !== askAsset
}

const Confirm = () => {
  const { state: swapState } = useLocation()
  const { t } = useTranslation()
  const { form } = useSwap()
  const { watch, handleSubmit } = form
  const { route, askAsset, offerAsset, msgs, offerInput } = watch()

  const amount = toAmount(offerInput, { decimals: offerAsset.decimals })

  const tx = {
    token: offerAsset.denom,
    decimals: offerAsset.decimals,
    amount,
    balance: offerAsset.balance,
    createTx: () => {
      return {
        msgs,
        chainID: offerAsset.chainId,
      }
    },
    // queryKeys: [offerAsset, askAsset]
    //   .filter((asset) => asset && AccAddress.validate(asset))
    //   .map((token) => [
    //     queryKey.wasm.contractQuery,
    //     token,
    //     { balance: address },
    //   ]),
    chain: offerAsset.chainId,
  }
  console.log("tx", tx)

  return (
    <Tx {...tx}>
      {({ fee, submit }) => (
        <Form onSubmit={handleSubmit(() => {})}>
          <SwapTimeline {...swapState} />
          <SectionHeader title={t("Details")} withLine />
          <SummaryTable
            rows={[
              {
                label: t("Min Received"),
                value: toInput(route?.amountOut ?? 0, askAsset.decimals),
              },
              {
                label: t("Transaction Fee"),
                value: fee.render(),
              },
              {
                label: t("Price Impact"),
                value: "tbd",
              },
            ]}
          />
          {submit.button}
        </Form>
      )}
    </Tx>
  )
}

export default Confirm
