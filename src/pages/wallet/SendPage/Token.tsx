import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { truncate } from "@terra-money/terra-utils"
import {
  SectionHeader,
  InputInLine,
  TokenSingleChainListItem,
  FlexColumn,
  InputWrapper,
  Input,
  Dropdown,
} from "@terra-money/station-ui"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { useWhitelist } from "data/queries/chains"
import { useNetworkName } from "data/wallet"
import { Empty } from "components/feedback"
import { Read } from "components/token"
import { ChainID } from "types/network"
import { has } from "utils/num"
import { useSend } from "./SendContext"
import { AssetType } from "./types"
import { toInput } from "txs/utils"

type TokenChainData = {
  denom: string
  id: string
  balance: number
  decimals: number
  tokenPrice: number
  chainID: string
  chainName: string
  tokenIcon: string
  supported: boolean
}

const TokenSelection = () => {
  const { form, goToStep, getWalletName, assetList, getIBCChannel, networks } =
    useSend()
  const { setValue, watch, register } = form
  const networkName = useNetworkName()
  const addresses = useInterchainAddresses()
  const { ibcDenoms } = useWhitelist()
  const { t } = useTranslation()
  const { destination, recipient, asset } = watch()
  const [selectedChain, setSelectedChain] = useState<ChainID | "all">("all")

  const tokens: AssetType[] = useMemo(() => {
    return assetList.reduce((acc, a) => {
      a.tokenChainInfo.forEach((tokenChainData: TokenChainData) => {
        const {
          denom,
          id,
          balance,
          decimals,
          tokenPrice: price,
          chainID: chain,
          chainName: name,
          tokenIcon: icon,
          supported,
        } = tokenChainData

        if (
          acc.some((asset: AssetType) => asset.id === id) ||
          !has(tokenChainData.balance)
        ) {
          return acc
        }

        const isNative = chain === destination
        const channel = getIBCChannel({
          from: chain,
          to: destination ?? "",
          tokenAddress: denom,
          icsChannel: ibcDenoms[networkName][`${chain}:${denom}`]?.icsChannel,
        })

        if ((isNative || channel) && supported) {
          const value = balance * price
          const senderAddress = addresses?.[chain]
          const item: AssetType = {
            ...a,
            id,
            denom,
            tokenImg: icon,
            value: value / Math.pow(10, decimals),
            senderAddress,
            balance,
            channel,
            tokenChain: chain,
            amountNode: <Read amount={balance} fixed={2} decimals={decimals} />,
            priceNode: value ? (
              <Read amount={value} currency fixed={2} decimals={decimals} />
            ) : (
              <span>—</span>
            ),
            chain: {
              label: name ?? chain,
              icon: networks[chain]?.icon,
            },
          }

          acc.push(item)
        }
      })
      return acc
    }, [] as AssetType[])
  }, [
    addresses,
    assetList,
    destination,
    ibcDenoms,
    networks,
    networkName,
    getIBCChannel,
  ])

  const [filteredTokens, setFilteredTokens] = useState<AssetType[]>(tokens)

  const filterTokens = useMemo(() => {
    return (searchTerm: string, chain: ChainID | "all") => {
      if (searchTerm) {
        const filtered = tokens.filter((t: AssetType) => {
          if (chain === "all") {
            return (
              t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.chain.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
          }

          return (
            (t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.chain.label.toLowerCase().includes(searchTerm.toLowerCase())) &&
            t.tokenChain.toLowerCase() === chain.toLowerCase()
          )
        }) as AssetType[]

        return filtered
      } else if (chain !== "all") {
        const filtered = tokens.filter(
          (t: AssetType) => t.tokenChain.toLowerCase() === chain.toLowerCase()
        ) as AssetType[]

        return filtered
      } else {
        return tokens
      }
    }
  }, [tokens])

  useEffect(() => {
    const tokens = filterTokens(asset ?? "", selectedChain)
    setFilteredTokens(tokens)
    // eslint-disable-next-line
  }, [asset, selectedChain])

  const handleTokenClick = (asset: AssetType) => {
    setValue("asset", asset.denom)
    setValue("chain", asset.tokenChain)
    setValue("assetInfo", asset)
    goToStep(4)
  }

  const chainOptions = [
    { label: "All Chains", value: "all" },
    ...Object.values(networks).map((n) => ({
      label: n.name,
      value: n.chainID,
    })),
  ]

  if (!recipient) {
    goToStep(1)
    return null
  }

  const recipientName = getWalletName(recipient)

  return (
    <FlexColumn gap={24} justify="flex-start" align="stretch">
      <InputInLine
        label={t("To")}
        style={{ cursor: "pointer" }}
        onClick={() => goToStep(1)}
        extra={!recipientName.includes("...") && truncate(recipient)}
        value={recipientName}
      />
      <SectionHeader title={t("My Tokens")} withLine />
      <InputWrapper>
        <Input
          placeholder={t("Search tokens")}
          {...register("asset")}
          extra={
            <Dropdown
              options={chainOptions}
              value={selectedChain ?? "all"}
              onChange={(value) => setSelectedChain(value)}
              variant="textDisplay"
              optionsAlign="right"
            />
          }
        />
      </InputWrapper>
      <FlexColumn gap={24} align="stretch">
        {filteredTokens.length === 0 && <Empty />}
        {filteredTokens
          .sort((a, b) => b.value - a.value)
          .map((asset: AssetType) => (
            <TokenSingleChainListItem
              key={asset.id}
              {...asset}
              onClick={() => handleTokenClick(asset)}
            />
          ))}
      </FlexColumn>
    </FlexColumn>
  )
}

export default TokenSelection
