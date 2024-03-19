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

const Token = () => {
  const { form, goToStep, getWalletName, assetList, getIBCChannel, networks } =
    useSend()
  const { setValue, watch, register } = form
  const networkName = useNetworkName()
  const addresses = useInterchainAddresses()
  const { ibcDenoms } = useWhitelist()
  const { t } = useTranslation()
  const { destination, recipient, asset } = watch()
  const [selectedChain, setSelectedChain] = useState<ChainID | "all">("all")

  const tokens = useMemo(() => {
    return assetList.reduce((acc, a) => {
      a.tokenChainInfo.forEach((tokenChainData: any) => {
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

        if (acc.some((asset: AssetType) => asset.id === id)) {
          return acc
        }
        if (!has(tokenChainData.balance)) {
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
          const balVal = balance * price
          const senderAddress = addresses?.[chain]
          const item = {
            ...a,
            id,
            denom,
            tokenImg: icon,
            balVal,
            senderAddress,
            balance,
            channel,
            tokenChain: chain,
            amountNode: <Read amount={balance} fixed={2} decimals={decimals} />,
            priceNode: balVal ? (
              <>
                <Read amount={balVal} currency fixed={2} decimals={decimals} />
              </>
            ) : (
              <span>—</span>
            ),
            chain: {
              label: name ?? chain,
              icon: networks[chain]?.icon,
            },
          } as AssetType

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

  const [filtered, setFiltered] = useState(tokens)

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ asset:", asset)
    if (asset) {
      const filtered = tokens
        .filter((t: AssetType) => {
          if (selectedChain === "all") {
            return (
              t.symbol.toLowerCase().includes(asset.toLowerCase()) ||
              t.chain.label.toLowerCase().includes(asset.toLowerCase())
            )
          }

          return (
            (t.symbol.toLowerCase().includes(asset.toLowerCase()) ||
              t.chain.label.toLowerCase().includes(asset.toLowerCase())) &&
            t.tokenChain.toLowerCase() === selectedChain.toLowerCase()
          )
        })
        .sort(
          (a: AssetType, b: AssetType) =>
            parseInt(b.balVal) - parseInt(a.balVal)
        )
      setFiltered(filtered)
    } else if (selectedChain !== "all" && (asset === "" || !asset)) {
      const filtered = tokens
        .filter((t: AssetType) => {
          return t.tokenChain.toLowerCase() === selectedChain.toLowerCase()
        })
        .sort(
          (a: AssetType, b: AssetType) =>
            parseInt(b.balVal) - parseInt(a.balVal)
        )
      setFiltered(filtered)
    } else {
      setFiltered(tokens)
    }
  }, [asset, selectedChain])

  const onClick = (asset: AssetType) => {
    setValue("asset", asset.denom)
    setValue("chain", asset.tokenChain)
    setValue("assetInfo", asset)
    goToStep(4)
  }

  const options = [
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
  const recipientName = getWalletName(recipient) // wallet name or address if none found

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
              options={options}
              value={selectedChain ?? "all"}
              onChange={(value) => setSelectedChain(value)}
              variant="textDisplay"
              optionsAlign="right"
            />
          }
        />
      </InputWrapper>
      <FlexColumn gap={24} align="stretch">
        {filtered.length === 0 && <Empty />}
        {filtered.map((asset: AssetType, i: number) => (
          <TokenSingleChainListItem
            key={`asset-${i}-${asset.denom}`}
            {...asset}
            onClick={() => onClick(asset)}
          />
        ))}
      </FlexColumn>
    </FlexColumn>
  )
}

export default Token
