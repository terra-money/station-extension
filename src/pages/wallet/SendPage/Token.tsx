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
      a.chains.forEach((tokenChain: string) => {
        if (!has(a.balance)) return acc
        const isNative = tokenChain === destination
        const channel = getIBCChannel({
          from: tokenChain,
          to: destination,
          tokenAddress: a.denom,
          icsChannel:
            ibcDenoms[networkName][`${destination}:${a.denom}`]?.icsChannel,
        })

        if (isNative || channel) {
          const balVal = a.balance * a.price
          const senderAddress = addresses?.[tokenChain]
          const item = {
            ...a,
            denom: a.denom,
            tokenImg: a.icon,
            balVal,
            senderAddress,
            balance: a.balance,
            channel,
            tokenChain,
            amountNode: (
              <Read amount={a.balance} fixed={2} decimals={a.decimals} />
            ),
            priceNode: balVal ? (
              <>
                <Read
                  amount={balVal}
                  currency
                  fixed={2}
                  decimals={a.decimals}
                />
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
  }, [
    addresses,
    assetList,
    destination,
    ibcDenoms,
    networks,
    networkName,
    getIBCChannel,
  ])

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
