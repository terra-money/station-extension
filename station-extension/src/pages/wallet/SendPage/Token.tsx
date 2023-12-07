import { useMemo } from "react"
import { useSend } from "./SendContext"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { useNetworkName } from "data/wallet"
import { useWhitelist } from "data/queries/chains"
import { AssetType } from "./types"
import { Read } from "components/token"
import { capitalize } from "@mui/material"
import { getChainNamefromID } from "data/queries/chains"
import { truncate } from "@terra-money/terra-utils"
import {
  SectionHeader,
  InputInLine,
  TokenSingleChainListItem,
} from "@terra-money/station-ui"
import { useTranslation } from "react-i18next"
import WithSearchInput from "pages/custom/WithSearchInput"
import { Empty } from "components/feedback"
import { has } from "utils/num"

const Token = () => {
  const { form, goToStep, getWalletName, assetList, getIBCChannel, networks } =
    useSend()
  const { setValue, watch } = form
  const networkName = useNetworkName()
  const addresses = useInterchainAddresses()
  const { ibcDenoms } = useWhitelist()
  const { t } = useTranslation()
  const { destination, recipient } = watch()

  const tokens = useMemo(() => {
    return assetList.reduce((acc, a) => {
      a.tokenChainInfo.forEach((tokenChainData: any) => {
        const { balance, denom, chain, name, id, icon, price, decimals } =
          tokenChainData

        if (acc.some((asset: AssetType) => asset.id === id)) {
          return acc
        }
        if (!has(a.balance)) {
          return acc
        }
        const isNative = chain === destination
        const channel = getIBCChannel({
          from: chain,
          to: destination,
          tokenAddress: denom,
          icsChannel:
            ibcDenoms[networkName][`${destination}:${denom}`]?.icsChannel,
        })

        if (isNative || channel) {
          const balVal = balance * price
          const senderAddress = addresses?.[chain]
          const item = {
            ...a,
            id,
            denom: denom,
            tokenImg: icon,
            balVal,
            senderAddress,
            balance: balance,
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

  // console.log("tokens", tokens)

  const onClick = (asset: AssetType) => {
    setValue("asset", asset.denom)
    setValue("chain", asset.tokenChain)
    setValue("assetInfo", asset)
    goToStep(4)
  }

  if (!recipient) {
    goToStep(1)
    return null
  }

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
                  key={asset.id}
                  {...asset}
                  onClick={() => onClick(asset)}
                />
              ))}
            </>
          )
        }}
      </WithSearchInput>
    </>
  )
}

export default Token
