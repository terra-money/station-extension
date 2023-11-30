import {
  SectionHeader,
  Dropdown,
  TokenSingleChainListItem,
  Button,
  Banner,
} from "station-ui"
import {
  useCustomTokensCW20,
  useCustomTokensNative,
} from "data/settings/CustomTokens"
import { useIsWalletEmpty } from "data/queries/bank"
import { useNativeDenoms, useParsedAssetList } from "data/token"
import FilterListIcon from "@mui/icons-material/FilterList"
import { useTokenFilters } from "utils/localStorage"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import styles from "./AssetList.module.scss"
import { useMemo, useState } from "react"
import { useNetwork } from "data/wallet"
import { Read } from "components/token"
import { toInput } from "txs/utils"
import classNames from "classnames"
import Asset from "./Asset"

const cx = classNames.bind(styles)

const AssetList = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const { onlyShowWhitelist, hideLowBal, toggleHideLowBal } = useTokenFilters()
  const readNativeDenom = useNativeDenoms()
  const native = useCustomTokensNative()
  const cw20 = useCustomTokensCW20()
  const list = useParsedAssetList()
  const [showFilter, setShowFilter] = useState(false)
  const [filterChain, setFilterChain] = useState("all")
  const network = useNetwork()
  const navigate = useNavigate()

  const toggleFilter = () => {
    setShowFilter(!showFilter)
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

  const renderAsset = ({ denom, decimals, id, ...item }: any) => {
    return (
      <Asset
        {...item}
        denom={denom}
        decimals={decimals}
        key={item.id}
        onClick={() => navigate(`asset/${id.split("*")?.[0]}/${denom}`)}
      />
    )
  }

  const AssetListTokenFilter = () => {
    return (
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
    )
  }

  const render = () => {
    if (!assets) return

    return (
      <section>
        {isWalletEmpty && (
          <Banner
            variant="error"
            title={t("Coins required to post transactions")}
          />
        )}
        {showFilter && <AssetListTokenFilter />}
        {assets.visible.map(renderAsset)}
        {assets.lowBal.length > 0 && (
          <>
            <SectionHeader
              title={t(`Show Low Balance Assets (${assets.lowBal.length})`)}
              withLine
              onClick={toggleHideLowBal}
            />
            {!hideLowBal && assets.lowBal.map(renderAsset)}
          </>
        )}
      </section>
    )
  }

  return (
    <article className={styles.assetlist}>
      <div className={styles.assetlist__title}>
        <SectionHeader title={t("Assets")} />
        <FilterListIcon
          className={cx(styles.filter, { [styles.inactive]: !showFilter })}
          onClick={toggleFilter}
        />
      </div>
      <div className={styles.assetlist__list}>{render()}</div>
      {filterChain !== "all" && (
        <Button
          className={cx(styles.filter, { [styles.inactive]: !showFilter })}
          onClick={toggleFilter}
          label={t("Clear Filter")}
          variant="secondary"
        />
      )}
    </article>
  )
}

export default AssetList
