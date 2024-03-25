import {
  InputInLine,
  SendHeader,
  Timeline,
  Form,
  SectionHeader,
  ActivityListItem,
  Banner,
  FlexColumn,
} from "@terra-money/station-ui"
import { useSend } from "./SendContext"
import { truncate } from "@terra-money/terra-utils"
import { useCurrency } from "data/settings/Currency"
import { toInput } from "txs/utils"
import { useTranslation } from "react-i18next"
import { toAmount } from "@terra-money/terra-utils"
import { useRecentRecipients } from "utils/localStorage"
import Tx from "txs/Tx"
import { useMemo, useEffect, useState, ReactNode } from "react"
import { queryKey } from "data/query"
import { CoinInput } from "txs/utils"
import style from "./Send.module.scss"
import { useIsLedger } from "utils/ledger"

interface InfoProps {
  render: (
    descriptions?: {
      label: ReactNode
      value: ReactNode
    }[]
  ) => ReactNode
  amount: string
  denom: string
  decimals: number | undefined
}

const Confirm = () => {
  const {
    form,
    networks,
    getWalletName,
    goToStep,
    txType,
    createTx,
    estimationTxValues,
  } = useSend()
  const { t } = useTranslation()
  const currency = useCurrency()
  const { handleSubmit, setValue } = form
  const { addRecipient } = useRecentRecipients()
  const [error, setError] = useState<string | null>(null)
  const { input, assetInfo, destination, recipient, chain, memo } = form.watch()
  const isLedger = useIsLedger()

  /* fee */
  const coins = useMemo(() => [{ input, denom: "" }] as CoinInput[], [input])
  const amount = useMemo(
    () => toAmount(input, { decimals: assetInfo?.decimals }),
    [input, assetInfo]
  )

  if (!(input && destination && chain && recipient)) {
    goToStep(1)
    return null
  }

  const TxInfo = (fee: InfoProps) => {
    useEffect(() => {
      // If is max and fee token === asset denom then subtract fee amount from input
      if (fee.denom !== assetInfo?.denom) return
      if (assetInfo.balance === amount) {
        const newAmount = Number(assetInfo.balance) - Number(fee.amount)
        setValue("input", toInput(newAmount, assetInfo.decimals))
        setError(
          "This transaction will use your whole balance. Consider leaving some to pay for subsequent fees."
        )
      }
    }, [fee])

    const msg = `${input} ${assetInfo?.symbol}`
    const currencyValue = `${currency.symbol} ${
      assetInfo?.price ? (input * assetInfo?.price).toFixed(2) : "—"
    }`

    const rows = [
      { label: t("Total Value"), value: currencyValue },
      {
        label: t("Token Sent"),
        value: msg,
      },
      { label: t("From"), value: truncate(assetInfo?.senderAddress) },
      ...(memo
        ? [
            {
              label: t("Memo"),
              value: memo,
            },
          ]
        : []),
    ]

    return (
      <FlexColumn gap={24} align="stretch" justify="space-between">
        <SendHeader
          heading={t("Sending")}
          label={`${input} ${assetInfo?.symbol}`}
          subLabel={currencyValue}
        />
        <SectionHeader withLine title={t("Send")} />
        <Timeline
          startOverride={
            <ActivityListItem
              variant={"success"}
              chain={{
                icon: networks[chain].icon,
                label: networks[chain].name,
              }}
              msg={
                <>
                  {t("Send")} <span>{msg}</span> {t("to")}{" "}
                  <span className={style.green}>
                    {getWalletName(recipient)}
                  </span>
                </>
              }
              type={txType as string}
            />
          }
        />
        <SectionHeader withLine title={t("Details")} />
        <InputInLine
          disabled
          label={t("To")}
          extra={truncate(recipient)}
          value={getWalletName(recipient)}
        />

        {fee.render(rows)}
      </FlexColumn>
    )
  }
  const tx = {
    token: assetInfo?.denom,
    decimals: assetInfo?.decimals,
    amount,
    memo,
    coins,
    chain: chain ?? "",
    balance: assetInfo?.balance,
    estimationTxValues,
    createTx,
    onSuccess: () => {
      addRecipient({ recipient, name: getWalletName(recipient ?? "") })
      isLedger && window.close()
    },
    queryKeys: [queryKey.bank.balances, queryKey.bank.balance],
    gasAdjustment: destination !== chain ? 2 : 1,
    isIbc: destination !== chain,
    hideLoader: destination === chain,
  }

  return (
    <Tx {...tx}>
      {({ submit, fee }) => (
        <Form onSubmit={handleSubmit(submit.fn)} spaceBetween fullHeight>
          <TxInfo {...fee} />
          <FlexColumn gap={24} align="stretch">
            {error && <Banner variant="warning" title={t(error)} />}
            {submit.button}
          </FlexColumn>
        </Form>
      )}
    </Tx>
  )
}
export default Confirm
