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
  FilterIcon,
  ChainLoader,
} from "@terra-money/station-ui"
import { useIsWalletEmpty } from "data/queries/bank"
import { useParsedAssetList } from "data/token"
import { useTokenFilters } from "utils/localStorage"
import { toInput } from "txs/utils"
import { useNetworks } from "app/InitNetworks"
import Asset from "./Asset"
import styles from "./AssetList.module.scss"

const cx = classNames.bind(styles)

const AssetList = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const { onlyShowWhitelist, hideLowBal, toggleHideLowBal } = useTokenFilters()
  const list = useParsedAssetList()
  const [search, setSearch] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()
  const { networksLoading, validNetworksLength, validationResultLength } =
    useNetworks()
  const showHideText = hideLowBal ? "Show" : "Hide"

  const toggleFilter = () => {
    setSearch("")
    setShowFilter(!showFilter)
  }

  const assets = useMemo(() => {
    const filtered = list
      .filter((a) => (onlyShowWhitelist ? a.whitelisted : true))
      .filter((a) =>
        [a.symbol, a.denom, a.nativeChain].some((field) =>
          field?.toLowerCase().includes(search.toLowerCase())
        )
      )

    const visible = filtered
      .filter(
        (a) =>
          a.totalValue >= 0.1 ||
          Number(a.totalBalance) / 10 ** a.decimals > 0.01
      )
      .sort((a, b) => {
        if (a.totalValue && b.totalValue) {
          return b.totalValue - a.totalValue
        } else if (!a.totalValue && !b.totalValue) {
          return (
            toInput(b.totalBalance, b.decimals) -
            toInput(a.totalBalance, a.decimals)
          )
        } else if (!a.totalValue) {
          return 1
        } else {
          return -1
        }
      })

    const lowBal = filtered
      .filter((a: any) => !visible.includes(a))
      .sort((a, b) => {
        const normalizedAmountA = toInput(a.totalBalance, a.decimals)
        const normalizedAmountB = toInput(b.totalBalance, b.decimals)

        return normalizedAmountB - normalizedAmountA
      })

    return { visible, lowBal }
  }, [list, onlyShowWhitelist, search])

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
              data-testid="assetlist-filter-input"
            />
          </div>
        )}
        {networksLoading && (
          <div className={styles.chain__loader__container}>
            <ChainLoader
              count={validNetworksLength}
              total={validationResultLength}
              textLabel={t("Chains Loading")}
            />
          </div>
        )}
        {assets.visible.map(renderAsset)}
        {assets.lowBal.length > 0 && (
          <>
            <button className={styles.low__bal}>
              <SectionHeader
                title={t(`${showHideText} Low Balance Assets ({{count}})`, {
                  count: assets.lowBal.length,
                })}
                withLine
                withArrow
                onClick={toggleHideLowBal}
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
          data-testid="assetlist-filter-icon"
        />
      </div>
      <div className={styles.assetlist__list}>{render()}</div>
      {showFilter && (
        <Button
          className={cx(styles.filter, { [styles.inactive]: !showFilter })}
          onClick={toggleFilter}
          label={t("Clear Filter")}
          variant="secondary"
          data-testid="assetlist-clear-filter-button"
        />
      )}
    </article>
  )
}

export default AssetList
