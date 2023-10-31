import {
  AccAddress,
  Coin,
  MsgExecuteContract,
  MsgSend,
  MsgTransfer,
} from "@terra-money/feather.js"
import { useState } from "react"
import { toAmount } from "@terra-money/terra-utils"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { getChainNamefromID } from "data/queries/chains"
import { convertAddress } from "utils/chain"
import { useCurrency } from "data/settings/Currency"
import { useBankBalance } from "data/queries/bank"
import { useCallback, useMemo } from "react"
import { capitalize } from "@mui/material"
import { useForm } from "react-hook-form"
import { getChainIDFromAddress } from "utils/bech32"
import { useIBCChannels, useWhitelist } from "data/queries/chains"
import { useTranslation } from "react-i18next"
import Tx from "txs/Tx"
import { toInput, CoinInput } from "txs/utils"
import { queryKey } from "data/query"
import {
  InputWrapper,
  Form,
  InputInLine,
  TimelineProps,
  Paste,
  SectionHeader,
  TokenSingleChainListItem,
  TokenSingleChainListItemProps,
  SendAmount,
  Button,
  Input,
  SendHeader,
  SummaryTable,
  Timeline,
  Tabs,
} from "station-ui"

import { useParsedAssetList } from "data/token"
import validate, { validateRecipient } from "txs/validate"
import OtherWallets, { WalletButtonList } from "./OtherWallets"
import { truncate } from "@terra-money/terra-utils"
import { SearchChains } from "./ReceivePage"
import { useNetwork, useNetworkName } from "data/wallet"
import { Read } from "components/token"
import WithSearchInput from "pages/custom/WithSearchInput"
import { Empty } from "components/feedback"
import { Routes, Route, useNavigate } from "react-router-dom"
import { useRecentRecipients } from "utils/localStorage"
import { useGetWalletName } from "auth/hooks/useAddress"

interface TxValues {
  asset?: string
  chain?: string
  destination?: string
  recipient?: string // AccAddress | TNS
  address?: AccAddress // hidden input
  input?: number
  memo?: string
  decimals?: number
}

interface AssetType extends TokenSingleChainListItemProps {
  balVal: string
  balance: string
  decimals: number
  amount: string
  denom: string
  tokenChain: string
  price?: number
  channel?: string
  senderAddress: AccAddress
}

const SendPage = () => {
  const { t } = useTranslation()
  const balances = useBankBalance()
  const networks = useNetwork()
  const assetList = useParsedAssetList()
  const { ibcDenoms } = useWhitelist()
  const networkName = useNetworkName()
  const { getIBCChannel, getICSContract } = useIBCChannels()
  const currency = useCurrency()
  const { recipients, addRecipient } = useRecentRecipients()
  const addresses = useInterchainAddresses()
  const [asset, setAsset] = useState<AssetType>()
  const [tab, setTab] = useState("wallets")
  const navigate = useNavigate()
  const goToStep = (step: number) => navigate(`/send/${step}`)
  const getWalletName = useGetWalletName()

  /* form */
  const form = useForm<TxValues>({ mode: "onChange" })
  const { register, watch, setValue, trigger, handleSubmit } = form
  const { formState } = form
  const { errors } = formState
  const { recipient, chain, input, destination, memo } = watch()

  const amount = useMemo(() => {
    return toAmount(input, { decimals: asset?.decimals })
  }, [input, asset])

  // View #1
  const Address = () => {
    const tabs = [
      {
        key: "wallets",
        label: "My Wallets",
        onClick: () => setTab("wallets"),
      },
      {
        key: "address",
        label: "Address Book",
        onClick: () => setTab("address"),
      },
    ]

    const onClick = (recipient: AccAddress) => {
      setValue("recipient", recipient)
      goToStep(2)
    }

    const handleKnownChain = (recipient: AccAddress) => {
      setValue("recipient", recipient)
      trigger("recipient")
      if (validateRecipient(recipient)) {
        setValue("destination", getChainIDFromAddress(recipient, networks))
        goToStep(3)
      }
    }

    return (
      <>
        <InputWrapper error={errors.recipient?.message}>
          <InputInLine
            type="text"
            label="To"
            placeholder="Wallet Address"
            extra={
              <Paste onPaste={(recipient) => handleKnownChain(recipient)} />
            }
            {...register("recipient", {
              validate: { ...validate.recipient() },
            })}
          />
        </InputWrapper>
        {recipients.length > 0 && (
          <>
            <SectionHeader title="Recently Used" withLine />
            <WalletButtonList
              items={recipients.map((r) => ({
                ...r,
                name: getWalletName(r.recipient),
              }))}
              onClick={(recipient) => handleKnownChain(recipient)}
            />
          </>
        )}
        <SectionHeader title="Other Wallets" withLine />
        <Tabs activeTabKey={tab} tabs={tabs} />
        <OtherWallets tab={tab} onClick={onClick} />
      </>
    )
  }

  // View #2 (only shown if they select from OtherWallets, not paste)
  const Chain = () => {
    const availableChains = useMemo(() => {
      const chainsSet = new Set()
      balances.map((b) => chainsSet.add(b.chain))
      return Array.from(chainsSet) as string[]
    }, [])

    const chains = useMemo(
      () =>
        availableChains.map((chain) => {
          const address = convertAddress(
            recipient ?? "",
            networks[chain]?.prefix
          )
          const name = getChainNamefromID(chain, networks) ?? chain
          return {
            name,
            onClick: () => {
              setValue("destination", chain)
              setValue("recipient", address)
              goToStep(3)
            },
            id: chain,
            address,
          }
        }),
      [availableChains]
    )
    return <SearchChains data={chains} />
  }

  // View #3
  const Token = () => {
    const tokens = useMemo(() => {
      return assetList.reduce((acc, a) => {
        if (!destination) return acc

        a.chains.forEach((tokenChain: string) => {
          const balance = parseInt(
            balances.find((b) => b.chain === tokenChain && b.denom === a.denom)
              ?.amount ?? "0"
          )
          if (balance === 0) return acc

          const isNative = tokenChain === destination
          const channel = getIBCChannel({
            from: tokenChain,
            to: destination,
            tokenAddress: a.denom,
            icsChannel:
              ibcDenoms[networkName][`${destination}:${a.denom}`]?.icsChannel,
          })

          if (isNative || channel) {
            const balVal = balance * a.price
            const senderAddress = addresses?.[tokenChain]
            const item = {
              ...a,
              denom: a.denom,
              tokenImg: a.icon,
              balVal,
              senderAddress,
              balance,
              channel,
              tokenChain,
              amountNode: (
                <Read amount={balance} fixed={2} decimals={a.decimals} />
              ),
              priceNode: balVal ? (
                <>
                  <Read amount={balVal} fixed={2} decimals={a.decimals} />{" "}
                  {currency.symbol}
                </>
              ) : (
                <span>—</span>
              ),
              chain: {
                label: capitalize(
                  getChainNamefromID(tokenChain, networks) ?? tokenChain
                ),
                icon: networks[tokenChain]?.icon,
              },
            } as AssetType

            acc.push(item)
          }
        })
        return acc
      }, [] as AssetType[])
    }, [])

    const onClick = (asset: AssetType) => {
      setValue("asset", asset.denom)
      setValue("chain", asset.tokenChain)
      setAsset(asset)
      goToStep(4)
    }

    if (!recipient) return null
    return (
      <>
        <InputInLine
          disabled
          label={"To"}
          extra={truncate(recipient)}
          value={getWalletName(recipient)}
        />
        <SectionHeader title={t("My Tokens")} withLine />
        <WithSearchInput
          label="Search Tokens"
          placeholder="Token symbol or chain"
        >
          {(search: string) => {
            const filtered = tokens
              .filter(
                (t: AssetType) =>
                  t.symbol.toLowerCase().includes(search.toLowerCase()) ||
                  t.chain.label.toLowerCase().includes(search.toLowerCase())
              )
              .sort(
                (a: AssetType, b: AssetType) =>
                  parseInt(b.balVal) - parseInt(a.balVal)
              )
            return (
              <>
                {filtered.length === 0 && <Empty />}
                {filtered.map((asset: AssetType) => (
                  <TokenSingleChainListItem
                    key={`${asset.denom}*${asset.tokenChain}`}
                    {...asset}
                    onClick={() => {
                      onClick(asset)
                    }}
                  />
                ))}
              </>
            )
          }}
        </WithSearchInput>
      </>
    )
  }

  // View #4
  const Submit = () => {
    if (!asset || !recipient) return null
    console.log("render")
    return (
      <>
        <InputInLine
          disabled
          label={"To"}
          extra={truncate(recipient)}
          value={getWalletName(recipient)}
        />
        <SendAmount
          tokenIcon={asset.tokenImg}
          symbol={asset.symbol}
          amount={input ?? 0}
          secondaryAmount={input ?? 0}
          price={asset.price ?? 0}
          currencySymbol={currency.symbol}
          amountInputAttrs={{
            ...register("input", {
              required: true,
              valueAsNumber: true,
              validate: validate.input(
                toInput(asset.balance, asset.decimals),
                asset.decimals
              ),
            }),
          }}
        />
        <TokenSingleChainListItem {...asset} />
        <InputWrapper
          label={`${t("Memo")} (${t("optional")})`}
          error={errors.memo?.message}
        >
          <Input
            // onFocus={() => max?.reset()}
            {...register("memo", {
              validate: {
                size: validate.size(256, "Memo"),
                brackets: validate.memo(),
                mnemonic: validate.isNotMnemonic(),
              },
            })}
          />
        </InputWrapper>
        <Button
          disabled={input !== undefined && !formState.isValid}
          variant="primary"
          onClick={() => goToStep(5)}
          label={t("Continue")}
        />
      </>
    )
  }

  const Confirm = () => {
    if (!input || !asset?.price || !destination || !recipient) return null
    const value = input * asset?.price
    const rows = [
      { label: t("Total Value"), value: value.toFixed(2) },
      {
        label: t("Token Sent"),
        value: `${input} ${asset?.symbol}`,
      },
      { label: t("From"), value: truncate(asset?.senderAddress) },
    ]
    const msg = `${input} ${asset?.symbol}`
    const coin = {
      icon: asset?.tokenImg,
      label: asset?.symbol,
    }
    const endItem = {
      chain: {
        label: capitalize(
          getChainNamefromID(destination, networks) ?? destination
        ),
        icon: networks[destination]?.icon,
      },
      coin,
      msg,
    }
    const startItem = {
      chain: asset?.chain,
      coin,
      msg,
    }

    const middleItems = [
      {
        variant: "success",
        msg: (
          <div>
            Transfer <span>{asset.symbol}</span> from{" "}
            <span>{asset.chain.label}</span> to{" "}
            <span>{endItem.chain.label}</span>
          </div>
        ),
      },
    ]

    const timelineProps = {
      startItem,
      ...(destination !== asset?.tokenChain ? { middleItems } : {}),
      endItem,
    } as TimelineProps

    return (
      <>
        <SendHeader
          heading={t("Sending")}
          label={`${input} ${asset?.symbol}`}
          subLabel={currency.symbol + " " + value.toFixed(2) ?? "—"}
        />
        <SectionHeader withLine title={t("Send Path")} />
        <Timeline {...timelineProps} />
        <InputInLine
          disabled
          label={"To"}
          extra={truncate(recipient)}
          value={getWalletName(recipient)}
        />
        <SummaryTable rows={rows} />
      </>
    )
  }

  const createTx = useCallback(
    ({ address, memo }: TxValues) => {
      const amount = toAmount(input, { decimals: asset?.decimals })
      const { senderAddress, denom, channel } = asset ?? {}
      if (!senderAddress) return

      if (!(recipient && AccAddress.validate(recipient))) return

      const execute_msg = { transfer: { recipient: address, amount } }

      const destination = getChainIDFromAddress(recipient, networks)

      if (!chain || !destination || !denom || !amount) return

      if (destination === chain) {
        const msgs = AccAddress.validate(denom)
          ? [new MsgExecuteContract(senderAddress, denom, execute_msg)]
          : [new MsgSend(senderAddress, recipient, amount + denom)]

        return { msgs, memo, chainID: chain }
      } else {
        if (!channel) throw new Error("No IBC channel found")

        const msgs = AccAddress.validate(denom)
          ? [
              new MsgExecuteContract(senderAddress, denom, {
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
              }),
            ]
          : [
              new MsgTransfer(
                "transfer",
                channel,
                new Coin(denom ?? "", amount),
                senderAddress,
                recipient,
                undefined,
                (Date.now() + 120 * 1000) * 1e6,
                undefined
              ),
            ]
        return { msgs, memo, chainID: chain }
      }
    },
    [asset, recipient, networks, chain, getICSContract, input]
  )

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
      input: toInput(1, asset?.decimals),
    }
  }, [addresses, asset, chain])

  const tx = {
    token: asset?.denom,
    decimals: asset?.decimals,
    amount,
    memo,
    coins,
    chain: chain ?? "",
    balance: asset?.balance,
    estimationTxValues,
    createTx,
    onChangeMax,
    onSuccess: () => {
      if (!recipient) return
      addRecipient({ recipient, name: "wallet" })
      navigate("/")
    },
    queryKeys: [queryKey.bank.balances, queryKey.bank.balance],
    gasAdjustment: destination !== chain ? 2 : 1,
  }

  return (
    <Tx {...tx}>
      {({ max, fee, submit }) => (
        <Form onSubmit={handleSubmit(submit.fn)}>
          <Routes>
            <Route element={<Address />} path="1" />
            <Route element={<Chain />} path="2" />
            <Route element={<Token />} path="3" />
            <Route element={<Submit />} path="4" />
            <Route
              element={
                <>
                  <Confirm />
                  {submit.button}
                </>
              }
              path="5"
            />
          </Routes>
        </Form>
      )}
    </Tx>
  )
}

export default SendPage
