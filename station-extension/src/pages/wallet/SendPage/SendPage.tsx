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
import { useNetwork } from "data/wallet"

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

  /* form */
  const form = useForm<TxValues>({ mode: "onChange" })
  const { register, watch, setValue, trigger } = form
  const { formState } = form
  const { errors } = formState
  const { recipient } = watch()

  const Address = () => {
    const onSubmit = (address: string) => {
      setValue("recipient", address)
      trigger("recipient")
      if (validateRecipient(address)) {
        setRoute({ page: Page.sendChain })
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
            extra={<Paste onPaste={(val) => onSubmit(val)} />}
            {...register("recipient", {
              value: recipient ?? "",
              validate: { ...validate.recipient() },
            })}
          />
        </InputWrapper>
        <SectionHeader title="Recently Used" />
        {/* <WalletList items={} title={t("Recently Used")} onClick={onClick} /> */}
        <SectionHeader title="Other Wallets" />
        <OtherWallets onClick={onSubmit} />
      </>
    )
  }

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

  const Token = () => {
    console.log("assetList", assetList)
    return (
      <>
        <InputInLine
          disabled
          label={"To"}
          extra={truncate(recipient)}
          value={recipient}
        />
        <SectionHeader title={t("My Tokens")} />
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
