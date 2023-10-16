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
import { SAMPLE_ADDRESS } from "config/constants"
import { getChainNamefromID } from "data/queries/chains"
import { convertAddress } from "utils/chain"
import { useCurrency } from "data/settings/Currency"
import { useBankBalance } from "data/queries/bank"
import { useExchangeRates } from "data/queries/coingecko"
import { useNativeDenoms } from "data/token"
import { useCallback, useEffect, useMemo } from "react"
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
  Grid,
  SectionHeader,
  TokenSingleChainListItem,
  TokenSingleChainListItemProps,
  SendAmount,
  Button,
} from "station-ui"

import { useParsedAssetList } from "data/token"
import validate, { validateRecipient } from "txs/validate"
import OtherWallets from "./OtherWallets"
import { WalletList } from "./OtherWallets"
import { truncate } from "@terra-money/terra-utils"
import { SearchChains } from "../ReceivePage"
import { useWalletRoute, Page } from "../Wallet"
import { useNetwork, useNetworkName } from "data/wallet"
import Asset from "../Asset"
import { Read } from "components/token"
import WithSearchInput from "pages/custom/WithSearchInput"
import { or } from "ramda"

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
  denom: string
  tokenChain: string
  price?: number
  channel?: string
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
  const [selected, setSelected] = useState<AssetType>()

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
        if (!destinationChain || !destinationChain) return acc
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
            const value = balance * a.price

            const item = {
              ...a,
              denom: a.denom,
              tokenImg: a.icon,
              value,
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

            acc.push(item)
          }
        })
        return acc
      }, [] as AssetType[])
    }, [])

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
                {filtered.map((t: AssetType) => (
                  <TokenSingleChainListItem
                    key={t.denom}
                    {...t}
                    onClick={() => {
                      setValue("asset", t.denom)
                      setValue("originChain", t.tokenChain)
                      setSelected(t)
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
  const Submit = () => {
    if (!selected) return null
    return (
      <>
        <InputInLine
          disabled
          label={"To"}
          extra={truncate(recipient)}
          value={"🥹"}
        />
        <SendAmount
          displayType="currency"
          tokenIcon={selected.tokenImg}
          symbol={selected.symbol}
          amount={input ?? 0}
          secondaryAmount={input ?? 0}
          price={selected.price ?? 0}
          currencySymbol={currency.symbol}
          amountInputAttrs={{
            ...register("input", {
              required: true,
              valueAsNumber: true,
              validate: validate.input(
                toInput(selected.balance, selected.decimals),
                selected.decimals
              ),
            }),
          }}
        />
        <TokenSingleChainListItem {...selected} />
        <Button
          variant="primary"
          onClick={() => setRoute({ page: Page.sendConfirm })}
          label={t("Continue")}
        />
      </>
    )
  }

  const Confirm = () => {
    const { decimals, channel, denom } = selected ?? {}
    const addresses = useInterchainAddresses()
    // return <p>Confirm</p>
    const createTx = useCallback(
      ({ address, input, memo }: TxValues) => {
        if (!addresses) return
        if (!(address && AccAddress.validate(address))) return
        const amount = toAmount(input, { decimals })
        const execute_msg = { transfer: { recipient: address, amount } }

        const destinationChain = getChainIDFromAddress(address, networks)

        if (!originChain || !destinationChain || !denom) return

        if (destinationChain === originChain) {
          const msgs = AccAddress.validate(denom)
            ? [
                new MsgExecuteContract(
                  addresses[originChain ?? ""],
                  denom,
                  execute_msg
                ),
              ]
            : [
                new MsgSend(
                  addresses[originChain ?? ""],
                  address,
                  amount + denom
                ),
              ]

          return { msgs, memo, chainID: originChain }
        } else {
          if (!channel) throw new Error("No IBC channel found")

          const msgs = AccAddress.validate(denom ?? "")
            ? [
                new MsgExecuteContract(addresses[originChain ?? ""], denom, {
                  send: {
                    contract: getICSContract({
                      from: originChain,
                      to: destinationChain,
                    }),
                    amount: amount,
                    msg: Buffer.from(
                      JSON.stringify({
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
                  addresses[originChain ?? ""],
                  address,
                  undefined,
                  (Date.now() + 120 * 1000) * 1e6,
                  undefined
                ),
              ]

          return { msgs, memo, chainID: originChain }
        }
      },
      [addresses, decimals, channel, denom]
    )

    const onChangeMax = useCallback(async (input: number) => {
      setValue("input", input)
      await trigger("input")
    }, [])

    /* fee */
    const coins = [{ input, denom: "" }] as CoinInput[]
    const estimationTxValues = useMemo(() => {
      return {
        address: addresses?.[originChain ?? "phoenix-1"],
        input: toInput(1, decimals),
      }
    }, [addresses, decimals])

    const tx = {
      token: denom,
      decimals: selected?.decimals,
      amount: toAmount(input, { decimals: selected?.decimals }),
      coins,
      chain: originChain ?? "",
      balance: selected?.balance,
      estimationTxValues,
      createTx,
      onChangeMax,
      onSuccess: () => setRoute({ page: Page.wallet }),
      taxRequired: true,
      queryKeys: [queryKey.bank.balances, queryKey.bank.balance],
      gasAdjustment: destinationChain !== originChain ? 2 : 1,
    }
    return (
      <Tx {...tx}>
        {({ max, fee, submit }) => (
          <Form onSubmit={handleSubmit(submit.fn)}>
            <Button variant="primary" type="submit" />
          </Form>
        )}
      </Tx>
    )
  }

  const render = () => {
    switch (route.page) {
      case Page.send:
        return <Address />
      case Page.sendChain:
        return <Chain />
      case Page.sendToken:
        return <Token />
      case Page.sendSubmit:
        return <Submit />
      case Page.sendConfirm:
        return <Confirm />
      default:
        return null
    }
  }

  return (
    <Form>
      <Grid gap={20}>{render()}</Grid>
    </Form>
  )
}

export default SendPage
