import { useMemo } from "react"
import { MsgTransfer, Coin } from "@terra-money/feather.js"
import { Form, SectionHeader, SummaryTable } from "station-ui"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import SwapTimeline from "./components/SwapTimeline"
import { toInput } from "txs/utils"
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
  const { watch, handleSubmit, getValues } = form
  const { route, askAsset, offerAsset, msgs: formMsgs, offerInput } = watch()

  const amount = toAmount(offerInput, { decimals: offerAsset.decimals })

  const createTx = ({ offerAsset }: SwapState) => {
    const msg = JSON.parse(formMsgs[0][0]?.msg)

    const msgs = [
      new MsgTransfer(
        "transfer",
        msg.source_channel,
        new Coin(msg.token?.denom ?? "", msg.token?.amount),
        msg.sender,
        msg.receiver,
        undefined,
        (Date.now() + 120 * 1000) * 1e6,
        msg.memo
      ),
    ]

    return { msgs, chainID: offerAsset.chainId }
  }

  /* fee */
  const estimationTxValues = useMemo(() => getValues(), [getValues])
  const tx = {
    token: offerAsset.denom,
    decimals: offerAsset.decimals,
    amount,
    balance: offerAsset.balance,
    estimationTxValues,
    createTx,
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
        <Form onSubmit={handleSubmit(submit.fn)}>
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
