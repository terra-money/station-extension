import {
  InputInLine,
  SendHeader,
  Timeline,
  Form,
  SectionHeader,
  ActivityListItem,
  Banner,
} from "@terra-money/station-ui"
import { useSend } from "./SendContext"
import { truncate } from "@terra-money/terra-utils"
import { useCurrency } from "data/settings/Currency"
import { toInput } from "txs/utils"
import { useTranslation } from "react-i18next"
import { toAmount } from "@terra-money/terra-utils"
import { TxValues } from "./types"
import {
  MsgExecuteContract,
  MsgTransfer,
  MsgSend,
} from "@terra-money/feather.js"
import { AccAddress } from "@terra-money/feather.js"
import { useRecentRecipients } from "utils/localStorage"
import Tx from "txs/Tx"
import { useCallback, useMemo, useEffect, useState, ReactNode } from "react"
import { Coin } from "@terra-money/feather.js"
import { queryKey } from "data/query"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { CoinInput } from "txs/utils"
import style from "./Send.module.scss"
import { useIsLedger } from "utils/ledger"

enum TxType {
  SEND = "Send",
  EXECUTE = "Execute Contract",
  TRANSFER = "Transfer",
}

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
  const { form, networks, getWalletName, getICSContract, goToStep } = useSend()
  const { t } = useTranslation()
  const currency = useCurrency()
  const { handleSubmit, setValue } = form
  const { addRecipient } = useRecentRecipients()
  const addresses = useInterchainAddresses()
  const [error, setError] = useState<string | null>(null)
  const { input, assetInfo, destination, recipient, chain, memo } = form.watch()
  const isLedger = useIsLedger()

  /* fee */
  const coins = useMemo(() => [{ input, denom: "" }] as CoinInput[], [input])
  const estimationTxValues = useMemo(() => {
    return {
      address: addresses?.[chain ?? "phoenix-1"],
      input: toInput(1, assetInfo?.decimals),
    }
  }, [addresses, assetInfo, chain])

  const amount = useMemo(() => {
    return toAmount(input, { decimals: assetInfo?.decimals })
  }, [input, assetInfo])

  const txType = useMemo(() => {
    if (!assetInfo?.denom) return null
    return AccAddress.validate(assetInfo.denom)
      ? TxType.EXECUTE
      : destination === chain
      ? TxType.SEND
      : TxType.TRANSFER
  }, [assetInfo, destination, chain])

  const createTx = useCallback(
    ({ address, memo }: TxValues) => {
      const amount = toAmount(input, { decimals: assetInfo?.decimals })
      const { senderAddress, denom, channel } = assetInfo ?? {}
      if (!(recipient && AccAddress.validate(recipient))) return
      if (!(chain && destination && denom && amount && senderAddress)) return

      const execute_msg = { transfer: { recipient: address, amount } }
      let msgs

      if (destination === chain) {
        msgs =
          txType === TxType.EXECUTE
            ? new MsgExecuteContract(senderAddress, denom, execute_msg)
            : new MsgSend(senderAddress, recipient, amount + denom)
      } else {
        if (!channel) throw new Error("No IBC channel found")
        msgs =
          txType === TxType.EXECUTE
            ? new MsgExecuteContract(senderAddress, denom, {
                send: {
                  contract: getICSContract({
                    from: chain,
                    to: destination,
                    tokenAddress: denom,
                  }),
                  amount: amount,
                  msg: Buffer.from(
                    JSON.stringify({
                      channel,
                      remote_address: address,
                    })
                  ).toString("base64"),
                },
              })
            : new MsgTransfer(
                "transfer",
                channel,
                new Coin(denom ?? "", amount),
                senderAddress,
                recipient,
                undefined,
                (Date.now() + 120 * 1000) * 1e6,
                undefined
              )
      }
      return { msgs: [msgs], memo, chainID: chain }
    },
    [assetInfo, recipient, chain, getICSContract, destination, input, txType]
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
      <>
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
      </>
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
        <Form onSubmit={handleSubmit(submit.fn)}>
          <TxInfo {...fee} />
          {submit.button}
          {error && <Banner variant="warning" title={t(error)} />}
        </Form>
      )}
    </Tx>
  )
}
export default Confirm
