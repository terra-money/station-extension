import {
  AccAddress,
  Coin,
  MsgExecuteContract,
  MsgSend,
  MsgTransfer,
} from "@terra-money/feather.js"
import { toAmount } from "@terra-money/terra-utils"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { SAMPLE_ADDRESS } from "config/constants"
import { getChainNamefromID } from "data/queries/chains"
import { convertAddress } from "utils/chain"

import { useBankBalance } from "data/queries/bank"
import { useExchangeRates } from "data/queries/coingecko"
import { useNativeDenoms } from "data/token"
import { useCallback, useEffect, useMemo } from "react"
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
  AddressSelectableListItem,
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

interface TxValues {
  asset?: string
  chain?: string
  recipient?: string // AccAddress | TNS
  address?: AccAddress // hidden input
  input?: number
  memo?: string
  decimals?: number
}

interface AssetType {
  denom: string
  balance: string
  icon: string
  symbol: string
  price: number
  chains: string[]
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

  /* form */
  const form = useForm<TxValues>({ mode: "onChange" })
  const { register, watch, setValue, trigger } = form
  const { formState } = form
  const { errors } = formState
  const { recipient, chain } = watch()

  // View #1
  const Address = () => {
    const onClick = (address: AccAddress) => {
      setValue("recipient", address)
      setRoute({ page: Page.sendChain })
    }

    const onPaste = (address: AccAddress) => {
      setValue("recipient", address)
      trigger("recipient")
      if (validateRecipient(address)) {
        setRoute({ page: Page.sendToken })
      }
    }

    return (
      <>
        <InputWrapper
          label={t("Wallet Address")}
          error={errors.recipient?.message}
          // extra={<Paste onPaste={(val) => onSubmit(val)} />}
        >
          <InputInLine
            type="text"
            label="To"
            extra={<Paste onPaste={(val) => onPaste(val)} />}
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
            setValue("chain", chain)
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
    const destinationChain = getChainIDFromAddress(recipient, networks)
    const tokens = useMemo(
      () =>
        assetList.filter((a) => {
          if (!chain || !destinationChain) return null
          const isNative = a.chains.includes(destinationChain)
          const isIBC = getIBCChannel({
            from: chain,
            to: destinationChain,
            tokenAddress: a.denom,
            icsChannel:
              ibcDenoms[networkName][`${chain}:${a.denom}`]?.icsChannel,
          })
          return isNative || isIBC
        }),
      [destinationChain]
    )

    return (
      <>
        <InputInLine
          disabled
          label={"To"}
          extra={truncate(recipient)}
          value={recipient}
        />
        <SectionHeader title={t("My Tokens")} />
        {tokens.map((a) => (
          <Asset
            {...a}
            key={a.id}
            onClick={() => setRoute({ page: Page.sendSubmit, denom: a.denom })}
          />
        ))}
      </>
    )
  }

  // View #4
  const Submit = () => {
    return <p>Submit</p>
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
