import { useMemo, useState } from "react"
import classNames from "classnames"
import { encode } from "js-base64"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  SectionHeader,
  Button,
  Banner,
  Input,
  FilterIcon
} from "@terra-money/station-ui"
import {
  useCustomTokensCW20,
  useCustomTokensNative,
} from "data/settings/CustomTokens"
import { useParsedAssetList } from "data/token"
import { useIsWalletEmpty } from "data/queries/bank"
import { useTokenFilters } from "utils/localStorage"
import Asset from "./Asset"
import styles from "./AssetList.module.scss"

const cx = classNames.bind(styles)

const AssetList = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const { onlyShowWhitelist, hideLowBal, toggleHideLowBal } = useTokenFilters()
  const native = useCustomTokensNative()
  const cw20 = useCustomTokensCW20()
  const list = useParsedAssetList()
  const [search, setSearch] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()

  const toggleFilter = () => {
    setSearch("")
    setShowFilter(!showFilter)
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
        [a.symbol, a.denom, a.nativeChain].some((field) =>
          field?.toLowerCase().includes(search.toLowerCase())
        )
      )

    const visible = filtered
      .filter((a) => a.totalValue >= 0.1 || alwaysVisibleDenoms.has(a.denom))
      .sort((a, b) => b.totalValue - a.totalValue)

    const lowBal = filtered.filter((a: any) => !visible.includes(a))

    return { visible, lowBal }
  }, [list, onlyShowWhitelist, alwaysVisibleDenoms, search])

  const renderAsset = ({ denom, decimals, id, nativeChain, ...item }: any) => {
    const encodedDenomPath = encode(denom)
    return (
      <Asset
        {...item}
        denom={denom}
        decimals={decimals}
        key={id}
        onClick={() => navigate(`asset/${nativeChain}/${encodedDenomPath}`)}
      />
    )
  }

  const render = () => {
    if (!assets) return

    return (
      <section className={styles.asset__section}>
        {isWalletEmpty && (
          <Banner
            variant="error"
            title={t("Coins required to post transactions")}
          />
        )}
        {showFilter && (
          <div className={styles.filter__input}>
            <Input
              autoFocus
              value={search}
              placeholder={t("Filter by tokens, chains, etc.")}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        {assets.visible.map(renderAsset)}
        {assets.lowBal.length > 0 && (
          <>
            <button className={styles.low__bal} onClick={toggleHideLowBal}>
              <SectionHeader
                title={t(`Show Low Balance Assets ({{count}})`, {
                  count: assets.lowBal.length,
                })}
                withLine
              />
            </button>
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
        <FilterIcon
          className={cx(styles.filter, { [styles.active]: showFilter })}
          fill={"var(--token-dark-900)"}
          width={16}
          height={16}
          onClick={toggleFilter}
        />
      </div>
      <div className={styles.assetlist__list}>{render()}</div>
      {showFilter && (
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
