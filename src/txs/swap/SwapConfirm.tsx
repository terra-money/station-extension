import { useMemo } from "react"
import { MsgTransfer, Coin, MsgExecuteContract } from "@terra-money/feather.js"
import { SectionHeader, Grid } from "@terra-money/station-ui"
import { useNavigate } from "react-router-dom"
import SwapTimeline from "./components/SwapTimeline"
import { SwapState } from "data/queries/swap/types"
import { toAmount } from "@terra-money/terra-utils"
import Tx from "txs/Tx"
import { useSwap } from "./SwapContext"
import { queryKey } from "data/query"
import Errors from "./components/ConfirmErrors"
import { Coins } from "@terra-money/feather.js"
import { useIsLedger } from "utils/ledger"
import styles from "./Swap.module.scss"
import { useTranslation } from 'react-i18next'

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
  const { watch, handleSubmit, getValues } = form
  const { offerAsset, offerInput, msgs: swapMsgs } = watch()
  const amount = toAmount(offerInput, { decimals: offerAsset.decimals })
  const estimationTxValues = useMemo(() => getValues(), [getValues])
  const isLedger = useIsLedger()

  if (!swapMsgs) {
    navigate("/swap")
    return null
  }

  const createTx = ({ offerAsset }: SwapState) => {
    const msg = JSON.parse(swapMsgs?.[0]?.msg)
    let msgs

    if (msg.source_channel) {
      msgs = new MsgTransfer(
        "transfer",
        msg.source_channel,
        new Coin(msg.token?.denom ?? "", msg.token?.amount),
        msg.sender,
        msg.receiver,
        undefined,
        (Date.now() + 120 * 1000) * 1e6,
        msg.memo
      )
    } else {
      // for native swaps (osmo to osmo)
      msgs = new MsgExecuteContract(
        msg.sender,
        msg.contract,
        msg.msg,
        Coins.fromAmino(msg.funds)
      )
    }
    return { msgs: [msgs] ?? [], chainID: offerAsset.chainId }
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
      {/* @ts-ignore */}
      {({ fee, submit }) => (
        <form
          className={styles.form__container}
          onSubmit={handleSubmit(submit.fn)}
        >
          <Grid gap={16}>
            <SwapTimeline {...{ swapMsgs, ...getValues() }} />
            <SectionHeader title={t("Details")} withLine />
            {fee.render()}
            <Errors feeDenom={fee.denom} />
          </Grid>
          {submit.button}
        </form>
      )}
    </Tx>
  )
}

export default Confirm
