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
}

const SendPage = () => {
  const { t } = useTranslation()
  const { route, setRoute } = useWalletRoute()
  const balances = useBankBalance()
  const networks = useNetwork()
  const assetList = useParsedAssetList()
  const { ibcDenoms } = useWhitelist()
  const networkName = useNetworkName()
  const { getIBCChannel } = useIBCChannels()
  const currency = useCurrency()
  const [selected, setSelected] = useState<AssetType>()

  /* form */
  const form = useForm<TxValues>({ mode: "onChange" })
  const { register, watch, setValue, trigger } = form
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
              value: recipient ?? "",
              validate: { ...validate.recipient() },
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
          const isIBC = getIBCChannel({
            from: tokenChain,
            to: destinationChain,
            tokenAddress: a.denom,
            icsChannel:
              ibcDenoms[networkName][`${destinationChain}:${a.denom}`]
                ?.icsChannel,
          })

          if (isNative || isIBC) {
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
          value={recipient}
        />
        <SendAmount
          displayType="token"
          tokenIcon={selected.tokenImg}
          symbol={selected.symbol}
          amount={input ?? 0}
          secondaryAmount={input ?? 0}
          price={selected.price ?? 0}
          currencySymbol={currency.symbol}
          amountInputAttrs={{
            ...register("input", { required: true, valueAsNumber: true }),
          }}
        />
        <TokenSingleChainListItem {...selected} />
      </>
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
