import { FormError } from "components/form"
import { useBankBalance, useIsWalletEmpty } from "data/queries/bank"
import { useNativeDenoms } from "data/token"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import Asset from "./Asset"
import styles from "./AssetList.module.scss"
import { useTokenFilters } from "utils/localStorage"
import { toInput } from "txs/utils"
import {
  useCustomTokensCW20,
  useCustomTokensNative,
} from "data/settings/CustomTokens"
import FilterListIcon from "@mui/icons-material/FilterList"
import { useUnknownIBCDenoms, useParsedAssetList } from "data/token"
import {
  SectionHeader,
  Dropdown,
  TokenSingleChainListItem,
  Button,
} from "station-ui"
import classNames from "classnames"
import { useWalletRoute, Page } from "./Wallet"
import { useNetwork } from "data/wallet"
import { Read } from "components/token"

const cx = classNames.bind(styles)

const AssetList = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const { onlyShowWhitelist, hideLowBal, toggleHideLowBal } = useTokenFilters()
  const unknownIBCDenoms = useUnknownIBCDenoms()
  const coins = useBankBalance()
  const readNativeDenom = useNativeDenoms()
  const native = useCustomTokensNative()
  const cw20 = useCustomTokensCW20()
  const list = useParsedAssetList()
  const [filter, setFilter] = useState(false)
  const [filterChain, setFilterChain] = useState("all")
  const { route, setRoute } = useWalletRoute()
  const network = useNetwork()

  const handleAssetClick = (denom: Denom) => {
    if (route.page !== Page.coin) {
      setRoute({ page: Page.coin, denom })
    }
  }

  const toggleFilter = () => {
    setFilter(!filter)
    setFilterChain("all")
  }

  const alwaysVisibleDenoms = useMemo(
    () =>
      new Set([
        ...cw20.list.map((a) => a.token),
        ...native.list.map((a) => a.denom),
      ]),
    [cw20.list, native.list]
  )

  const assets = useMemo(() => {
    const filtered = list
      .filter((a) => (onlyShowWhitelist ? a.whitelisted : true))
      .filter((a) =>
        filterChain !== "all" ? a.chains.includes(filterChain) : true
      )

    const baseAssets = Object.keys(network).reduce((acc, chain) => {
      if (acc.includes(chain)) return acc
      const { symbol, decimals } = readNativeDenom(
        network[chain].baseAsset,
        chain
      )
      const balance =
        list.find((a) => a.denom === network[chain].baseAsset)?.balance ?? "0"
      const token = {
        symbol,
        chain,
        name: network[chain].name,
        tokenImg: network[chain].icon,
        decimals,
        balance,
      }
      acc.push(token)
      return acc
    }, [] as any[])

    const visible = filtered
      .filter(
        (a) =>
          a.price * toInput(a.balance) >= 1 || alwaysVisibleDenoms.has(a.denom)
      )
      .sort(
        (a, b) => b.price * parseInt(b.balance) - a.price * parseInt(a.balance)
      )

    const lowBal = filtered.filter((a) => !visible.includes(a))
    return { visible, lowBal, baseAssets }
  }, [
    list,
    onlyShowWhitelist,
    filterChain,
    readNativeDenom,
    network,
    alwaysVisibleDenoms,
  ])

  const renderAsset = ({ denom, chainID, ...item }: any) => {
    return (
      <Asset
        {...readNativeDenom(
          unknownIBCDenoms[[denom, chainID].join("*")]?.baseDenom ?? denom,
          unknownIBCDenoms[[denom, chainID].join("*")]?.chainID ?? chainID
        )}
        {...item}
        key={item.id}
        coins={coins}
        onClick={() => handleAssetClick(denom)}
      />
    )
  }

  const render = () => {
    if (!assets) return

    return (
      <div>
        {isWalletEmpty && (
          <FormError>{t("Coins required to post transactions")}</FormError>
        )}
        <section>
          {filter && (
            <Dropdown
              value={filterChain}
              onChange={(chain) => setFilterChain(chain)}
              options={[
                { value: "all", label: "All Chains" },
                ...assets.baseAssets.map((c: any) => ({
                  value: c.chain,
                  image: c.tokenImg,
                  label: c.name,
                })),
              ]}
            >
              {assets.baseAssets.map((asset: any) => (
                <TokenSingleChainListItem
                  {...asset}
                  symbol={asset.name}
                  onClick={() => setFilterChain(asset.chain)}
                  amountNode={
                    <Read amount={asset.balance} decimals={asset.decimals} />
                  }
                  chain={{
                    name: asset.name,
                    icon: asset.tokenImg,
                  }}
                />
              ))}
            </Dropdown>
          )}
          {assets.visible.map(renderAsset)}
        </section>
        {assets.lowBal.length > 0 && (
          <>
            <SectionHeader
              title={t(`Show Low Balance Assets (${assets.lowBal.length})`)}
              withLine
              onClick={toggleHideLowBal}
            />
            {!hideLowBal && <section>{assets.lowBal.map(renderAsset)}</section>}
          </>
        )}
      </div>
    )
  }

  return (
    <article className={styles.assetlist}>
      <div className={styles.assetlist__title}>
        <SectionHeader title={t("Assets")} />
        <FilterListIcon
          className={cx(styles.filter, filter ? styles.active : null)}
          onClick={toggleFilter}
        />
      </div>
      <div className={styles.assetlist__list}>{render()}</div>
      {filter && (
        <Button
          onClick={toggleFilter}
          label={t("Clear Filter")}
          variant="secondary"
        />
      )}
    </article>
  )
}

export default AssetList
