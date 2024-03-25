import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { toAmount } from "@terra-money/terra-utils"
import { SectionHeader, Grid, Form } from "@terra-money/station-ui"
import SwapTimeline from "./components/SwapTimeline"
import Errors from "./components/ConfirmErrors"
import { SwapState } from "data/queries/swap/types"
import { queryKey } from "data/query"
import { useSwap } from "./SwapContext"
import { useIsLedger } from "utils/ledger"
import Tx from "txs/Tx"

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
  const { form, createTx, estimationTxValues } = useSwap()
  const navigate = useNavigate()
  const { watch, handleSubmit, getValues } = form
  const { offerAsset, offerInput, msgs: swapMsgs } = watch()
  const amount = toAmount(offerInput, { decimals: offerAsset.decimals })
  const isLedger = useIsLedger()

  if (!swapMsgs) {
    navigate("/swap")
    return null
  }

  const tx = {
    token: offerAsset.denom,
    decimals: offerAsset.decimals,
    amount,
    balance: offerAsset.balance,
    estimationTxValues,
    createTx,
    onSuccess: () => {
      isLedger && window.close()
      navigate("/#1")
    },
    queryKeys: [queryKey.bank.balances, queryKey.bank.balance],
    chain: offerAsset.chainId,
    memo: "Swapped via Station Extension",
    isIbc: true,
  }

  return (
    <Tx {...tx}>
      {({ fee, submit }) => (
        <Form onSubmit={handleSubmit(submit.fn)} spaceBetween fullHeight>
          <Grid gap={16}>
            <SwapTimeline {...{ swapMsgs, ...getValues() }} />
            <SectionHeader title={t("Details")} withLine />
            {fee.render()}
            <Errors feeDenom={fee.denom} />
          </Grid>
          {submit.button}
        </Form>
      )}
    </Tx>
  )
}

export default Confirm
