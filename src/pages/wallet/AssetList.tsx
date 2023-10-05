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
import { SectionHeader, Dropdown } from "station-ui"
import classNames from "classnames"

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
  const [filterChain, setFilterChain] = useState<string>()

  const toggleFilter = () => {
    setFilter(!filter)
    setFilterChain(undefined)
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
      .filter((a) => (filterChain ? a.chains.includes(filterChain) : true))

    const visible = filtered
      .filter(
        (a) =>
          a.price * toInput(a.balance) >= 1 || alwaysVisibleDenoms.has(a.denom)
      )
      .sort(
        (a, b) => b.price * parseInt(b.balance) - a.price * parseInt(a.balance)
      )

    const lowBal = filtered.filter((a) => !visible.includes(a))

    return { visible, lowBal }
  }, [list, onlyShowWhitelist, filterChain, alwaysVisibleDenoms])

  const renderAsset = ({ denom, chainID, ...item }: any) => {
    return (
      <Asset
        {...readNativeDenom(
          unknownIBCDenoms[[denom, chainID].join("*")]?.baseDenom ?? denom,
          unknownIBCDenoms[[denom, chainID].join("*")]?.chainID ?? chainID
        )}
        {...item}
        key={item.id}
      />
    )
  }

  const render = () => {
    if (!coins) return

    return (
      <div>
        {isWalletEmpty && (
          <FormError>{t("Coins required to post transactions")}</FormError>
        )}
        <section>
          {filter && (
            <Dropdown
              value="chain-placeholder"
              onChange={(chain) => {
                setFilterChain(chain)
              }}
              options={[{ value: "phoenix-1", label: "Terra" }]}
            />
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
          className={cx(styles.filter, { active: filter, inactive: !filter })}
          onClick={toggleFilter}
        />
      </div>
      <div className={styles.assetlist__list}>{render()}</div>
    </article>
  )
}

export default AssetList
