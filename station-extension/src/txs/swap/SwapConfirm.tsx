import { useMemo } from "react"
import { MsgTransfer, Coin } from "@terra-money/feather.js"
import { Form, SectionHeader, SummaryTable } from "station-ui"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import SwapTimeline from "./components/SwapTimeline"
import { SwapState } from "data/queries/swap/types"
import { toAmount } from "@terra-money/terra-utils"
import Tx from "txs/Tx"
import { useSwap } from "./SwapContext"
import { AccAddress } from "@terra-money/feather.js"
import { queryKey } from "data/query"
import { useAllInterchainAddresses } from "auth/hooks/useAddress"
import { Read } from "components/token"
import Errors from "./components/ConfirmErrors"

export const validateAssets = (
  assets: Partial<SwapState>
): assets is Required<SwapState> => {
  const { offerAsset, askAsset } = assets
  return (
    !!offerAsset &&
    !!askAsset &&
    JSON.stringify(offerAsset) !== JSON.stringify(askAsset)
  )
}

const Confirm = () => {
  const { t } = useTranslation()
  const { form } = useSwap()
  const navigate = useNavigate()
  const addresses = useAllInterchainAddresses()
  const { watch, handleSubmit, getValues } = form
  const { route, askAsset, offerAsset, offerInput, msgs: swapMsgs } = watch()
  const amount = toAmount(offerInput, { decimals: offerAsset.decimals })

  const createTx = ({ offerAsset }: SwapState) => {
    const msg = JSON.parse(swapMsgs[0].msg)

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

  const estimationTxValues = useMemo(() => getValues(), [getValues])

  const tx = {
    token: offerAsset.denom,
    decimals: offerAsset.decimals,
    amount,
    balance: offerAsset.balance,
    estimationTxValues,
    createTx,
    onSuccess: () => navigate("/"),
    queryKeys: [offerAsset, askAsset]
      .filter((asset) => asset && AccAddress.validate(asset.denom))
      .map((token) => [
        queryKey.wasm.contractQuery,
        token.denom,
        { balance: addresses?.[token.chainId] ?? "" },
      ]),
    chain: offerAsset.chainId,
  }

  return (
    <Tx {...tx}>
      {({ fee, submit }) => (
        <Form onSubmit={handleSubmit(submit.fn)}>
          <SwapTimeline {...{ swapMsgs, ...getValues() }} />
          <SectionHeader title={t("Details")} withLine />
          <SummaryTable
            rows={[
              {
                label: t("Min Received"),
                value: (
                  <>
                    <Read
                      amount={route?.amountOut}
                      fixed={4}
                      decimals={askAsset.decimals}
                    />{" "}
                    {askAsset.symbol}
                  </>
                ),
              },
              {
                label: t("Transaction Fee"),
                value: <Read {...fee} />,
              },
              // {
              //   label: t("Price Impact"),
              //   value: "N/A",
              // },
            ]}
          />
          <Errors />
          {submit.button}
        </Form>
      )}
    </Tx>
  )
}

export default Confirm
