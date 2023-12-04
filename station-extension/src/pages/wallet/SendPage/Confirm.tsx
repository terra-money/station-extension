import {
  InputInLine,
  SendHeader,
  Timeline,
  Form,
  SummaryTable,
  SectionHeader,
  ActivityListItem,
} from "station-ui"
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
import { useCallback, useMemo } from "react"
import { Coin } from "@terra-money/feather.js"
import { queryKey } from "data/query"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { CoinInput } from "txs/utils"
import { useNavigate } from "react-router-dom"
import style from "./Send.module.scss"

enum TxType {
  SEND = "Send",
  EXECUTE = "Execute Contract",
  TRANSFER = "Transfer",
}

const Confirm = () => {
  const { form, networks, getWalletName, getICSContract } = useSend()
  const { t } = useTranslation()
  const currency = useCurrency()
  const { handleSubmit, setValue, trigger } = form
  const { addRecipient } = useRecentRecipients()
  const navigate = useNavigate()
  const addresses = useInterchainAddresses()
  const { input, assetInfo, destination, recipient, chain, memo } = form.watch()

  const onChangeMax = useCallback(
    async (input: number) => {
      setValue("input", input)
      await trigger("input")
    },
    [setValue, trigger]
  )

  /* fee */
  const coins = [{ input, denom: "" }] as CoinInput[]
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

      const execute_msg = { transfer: { recipient: address, amount } }

      if (!chain || !destination || !denom || !amount || !senderAddress) return
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

  if (!input || !assetInfo?.price || !destination || !chain || !recipient)
    return null
  const msg = `${input} ${assetInfo?.symbol}`
  const value = input * assetInfo?.price

  const rows = [
    { label: t("Total Value"), value: value.toFixed(2) },
    {
      label: t("Token Sent"),
      value: msg,
    },
    { label: t("From"), value: truncate(assetInfo?.senderAddress) },
  ]

  const Info = () => (
    <>
      <SendHeader
        heading={t("Sending")}
        label={`${input} ${assetInfo?.symbol}`}
        subLabel={currency.symbol + " " + value.toFixed(2) ?? "—"}
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
                Send <span>{msg}</span> to{" "}
                <span className={style.green}>{getWalletName(recipient)}</span>
              </>
            }
            type={txType as string}
          />
        }
      />
      <SectionHeader withLine title={t("Details")} />
      <InputInLine
        disabled
        label={"To"}
        extra={truncate(recipient)}
        value={getWalletName(recipient)}
      />
      <SummaryTable rows={rows} />
    </>
  )

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
    onChangeMax,
    onSuccess: () => {
      addRecipient({ recipient, name: getWalletName(recipient ?? "") })
      navigate("/")
    },
    queryKeys: [queryKey.bank.balances, queryKey.bank.balance],
    gasAdjustment: destination !== chain ? 2 : 1,
  }

  return (
    <Tx {...tx}>
      {({ submit }) => (
        <Form onSubmit={handleSubmit(submit.fn)}>
          <Info />
          {submit.button}
        </Form>
      )}
    </Tx>
  )
}
export default Confirm