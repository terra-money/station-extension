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
  Paste,
  SectionHeader,
  TokenSingleChainListItem,
  TokenSingleChainListItemProps,
  SendAmount,
  Button,
  Input,
  SendHeader,
  SummaryTable,
} from "station-ui"

import { useParsedAssetList } from "data/token"
import validate, { validateRecipient } from "txs/validate"
import OtherWallets from "./OtherWallets"
import { WalletList } from "./OtherWallets"
import { truncate } from "@terra-money/terra-utils"
import { SearchChains } from "../ReceivePage"
import { useWalletRoute, Page } from "../Wallet"
import { useNetwork, useNetworkName } from "data/wallet"
import { Read } from "components/token"
import WithSearchInput from "pages/custom/WithSearchInput"

interface TxValues {
  asset?: string
  originChain?: string
  destinationChain?: string
  recipient?: string // AccAddress | TNS
  address?: AccAddress // hidden input
  input?: number
  memo?: string
  decimals?: number
}

interface AssetType extends TokenSingleChainListItemProps {
  value: string
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
  const { route, setRoute } = useWalletRoute()
  const balances = useBankBalance()
  const networks = useNetwork()
  const assetList = useParsedAssetList()
  const { ibcDenoms } = useWhitelist()
  const networkName = useNetworkName()
  const { getIBCChannel, getICSContract } = useIBCChannels()
  const currency = useCurrency()
  const addresses = useInterchainAddresses()
  const [asset, setAsset] = useState<AssetType>()

  /* form */
  const form = useForm<TxValues>({ mode: "onChange" })
  const { register, watch, setValue, trigger, handleSubmit } = form
  const { formState } = form
  const { errors } = formState
  const { recipient, originChain, input, destinationChain } = watch()

  // View #1
  const Address = () => {
    const onClick = (recipient: AccAddress) => {
      setValue("recipient", recipient)
      setRoute({ page: Page.sendChain })
    }

    const onPaste = (recipient: string) => {
      setValue("recipient", recipient)
      trigger("recipient")
      if (validateRecipient(recipient)) {
        setValue("destinationChain", getChainIDFromAddress(recipient, networks))
        setRoute({ page: Page.sendToken })
      }
    }

    return (
      <>
        <InputWrapper
          label={t("Wallet Address")}
          error={errors.recipient?.message}
        >
          <InputInLine
            type="text"
            label="To"
            extra={<Paste onPaste={(recipient) => onPaste(recipient)} />}
            {...register("recipient", {
              validate: {
                ...validate.recipient(),
                ...validate.ibc(networks, originChain ?? "", "", getIBCChannel),
              },
            })}
          />
        </InputWrapper>
        <SectionHeader title="Recently Used" />
        {/* <WalletList items={} title={t("Recently Used")} onClick={onClick} /> */}
        <SectionHeader title="Other Wallets" />
        <OtherWallets onClick={onClick} />
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
        availableChains.map((chain) => ({
          name: getChainNamefromID(chain, networks) ?? chain,
          onClick: () => {
            setValue("destinationChain", chain)
            setRoute({ page: Page.sendToken })
          },
          id: chain,
          address: convertAddress(recipient!, networks[chain]?.prefix),
        })),
      [availableChains]
    )
    return <SearchChains data={chains} />
  }

  // View #3
  const Token = () => {
    const tokens = useMemo(() => {
      return assetList.reduce((acc, a) => {
        if (!destinationChain) return acc

        a.chains.forEach((tokenChain: string) => {
          const isNative = tokenChain === destinationChain
          const channel = getIBCChannel({
            from: tokenChain,
            to: destinationChain,
            tokenAddress: a.denom,
            icsChannel:
              ibcDenoms[networkName][`${destinationChain}:${a.denom}`]
                ?.icsChannel,
          })

          if (isNative || channel) {
            const balance = parseInt(
              balances.find(
                (b) => b.chain === tokenChain && b.denom === a.denom
              )?.amount ?? "0"
            )
            if (balance === 0) return acc
            const value = balance * a.price
            const amount = toAmount(input, { decimals: asset?.decimals })
            console.log("amount", amount)
            const senderAddress = addresses?.[tokenChain]

            const item = {
              ...a,
              denom: a.denom,
              tokenImg: a.icon,
              value,
              amount,
              senderAddress,
              balance,
              channel,
              tokenChain,
              amountNode: (
                <Read amount={balance} fixed={2} decimals={a.decimals} />
              ),
              priceNode: value ? (
                <>
                  <Read amount={value} fixed={2} decimals={a.decimals} />{" "}
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
            if (!acc.includes(item)) {
              acc.push(item)
            }
          }
        })
        return acc
      }, [] as AssetType[])
    }, [])
    console.log("tokens", tokens)

    return (
      <>
        <InputInLine
          disabled
          label={"To"}
          extra={truncate(recipient)}
          value={recipient}
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
                  parseInt(b.value) - parseInt(a.value)
              )
            return (
              <>
                {filtered.length === 0 && <p>No tokens found</p>}
                {filtered.map((asset: AssetType) => (
                  <TokenSingleChainListItem
                    key={`${asset.denom}*${asset.tokenChain}*${asset.balance}`}
                    {...asset}
                    onClick={() => {
                      setValue("asset", asset.denom)
                      setValue("originChain", asset.tokenChain)
                      setAsset(asset)
                      setRoute({ page: Page.sendSubmit })
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
  const Submit = ({ max }: { max: any }) => {
    if (!asset) return null
    return (
      <>
        <InputInLine
          disabled
          label={"To"}
          extra={truncate(recipient)}
          value={"🥹"}
        />
        <SendAmount
          displayType="token"
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
        <TokenSingleChainListItem {...asset} onClick={max?.render()} />
        <InputWrapper
          label={`${t("Memo")} (${t("optional")})`}
          error={errors.memo?.message}
        >
          <Input
            onFocus={max?.reset}
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
          variant="primary"
          onClick={() => setRoute({ page: Page.sendConfirm })}
          label={t("Continue")}
        />
      </>
    )
  }

  const Confirm = () => {
    const rows = useMemo(() => {
      return [
        { label: t("Total Value"), value: asset?.value },
        {
          label: t("Token Sent"),
          value: `${asset?.amount} ${asset?.symbol}`,
        },
        { label: t("From"), value: truncate(senderAddress) },
      ]
    }, [])
    return (
      <>
        <SendHeader
          heading={t("Sending")}
          label={`${asset?.amount} ${asset?.symbol}`}
          subLabel={currency.symbol + " " + asset?.value ?? "—"}
        />
        <SectionHeader withLine title={t("Send Path")} />
        <InputInLine
          disabled
          label={"To"}
          extra={truncate(recipient)}
          value={"🥹"}
        />
        <SummaryTable rows={rows} />
        <Button variant="primary" type="submit" label={t("Confirm")} />
      </>
    )
  }

  const { decimals, channel, denom, senderAddress } = asset ?? {}

  const createTx = useCallback(
    ({ address, input, memo }: TxValues) => {
      if (!senderAddress) return

      if (!(address && AccAddress.validate(address))) return

      const amount = toAmount(input, { decimals })
      const execute_msg = { transfer: { recipient: address, amount } }

      const destinationChain = getChainIDFromAddress(address, networks)

      if (!originChain || !destinationChain || !denom) return

      if (destinationChain === originChain) {
        const msgs = AccAddress.validate(denom)
          ? [new MsgExecuteContract(senderAddress, denom, execute_msg)]
          : [new MsgSend(senderAddress, address, amount + denom)]

        return { msgs, memo, chainID: originChain }
      } else {
        if (!channel) throw new Error("No IBC channel found")

        const msgs = AccAddress.validate(denom)
          ? [
              new MsgExecuteContract(senderAddress, denom, {
                send: {
                  contract: getICSContract({
                    from: originChain,
                    to: destinationChain,
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
                address,
                undefined,
                (Date.now() + 120 * 1000) * 1e6,
                undefined
              ),
            ]

        return { msgs, memo, chainID: originChain }
      }
    },
    [
      channel,
      denom,
      senderAddress,
      decimals,
      networks,
      originChain,
      getICSContract,
    ]
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
      address: addresses?.[originChain ?? "phoenix-1"],
      input: toInput(1, decimals),
    }
  }, [addresses, decimals, originChain])

  const tx = {
    token: denom,
    decimals: asset?.decimals,
    amount: asset?.amount,
    coins,
    chain: originChain ?? "",
    balance: asset?.balance,
    estimationTxValues,
    createTx,
    onChangeMax,
    onSuccess: () => setRoute({ page: Page.wallet }),
    queryKeys: [queryKey.bank.balances, queryKey.bank.balance],
    gasAdjustment: destinationChain !== originChain ? 2 : 1,
  }

  const render = (props: any) => {
    switch (route.page) {
      case Page.send:
        return <Address />
      case Page.sendChain:
        return <Chain />
      case Page.sendToken:
        return <Token />
      case Page.sendSubmit:
        return <Submit {...props} />
      case Page.sendConfirm:
        return <Confirm />
      default:
        return null
    }
  }

  return (
    <Tx {...tx}>
      {({ max, fee, submit }) => (
        <Form
          onSubmit={() => {
            console.log("SUBMIT")
            handleSubmit(submit.fn)
          }}
        >
          {render(max)}
        </Form>
      )}
    </Tx>
  )
}

export default SendPage
