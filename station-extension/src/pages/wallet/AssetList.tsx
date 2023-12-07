import {
  SectionHeader,
  Dropdown,
  TokenSingleChainListItem,
  Button,
  Banner,
  Input,
} from "@terra-money/station-ui"
import {
  useCustomTokensCW20,
  useCustomTokensNative,
} from "data/settings/CustomTokens"
import { useNativeDenoms, useParsedAssetList } from "data/token"
import FilterListIcon from "@mui/icons-material/FilterList"
import { useIsWalletEmpty } from "data/queries/bank"
import { useTokenFilters } from "utils/localStorage"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import styles from "./AssetList.module.scss"
import { useMemo, useState } from "react"
import { toInput } from "txs/utils"
import classNames from "classnames"
import { encode } from "js-base64"
import Asset from "./Asset"

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
    const filtered = list.filter((a) =>
      onlyShowWhitelist ? a.whitelisted : true
    )
    const visible = filtered
      .filter(
        (a: any) =>
          a.price * toInput(a.balance) >= 1 || alwaysVisibleDenoms.has(a.denom)
      )
      .sort(
        (a: any, b: any) =>
          b.price * parseInt(b.balance) - a.price * parseInt(a.balance)
      )

    const lowBal = filtered.filter((a: any) => !visible.includes(a))
    return { visible, lowBal }
  }, [list, onlyShowWhitelist, alwaysVisibleDenoms])

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
      <section>
        {isWalletEmpty && (
          <Banner
            variant="error"
            title={t("Coins required to post transactions")}
          />
        )}
        {showFilter && (
          <Input
            autoFocus
            value={search}
            placeholder={t("Filter by tokens, chains, etc.")}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        {assets.visible
          .filter((a) =>
            [a.symbol, a.denom].some((field) =>
              field?.toLowerCase().includes(search.toLowerCase())
            )
          )
          .map(renderAsset)}

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
        <FilterListIcon
          className={cx(styles.filter, { [styles.inactive]: !showFilter })}
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
