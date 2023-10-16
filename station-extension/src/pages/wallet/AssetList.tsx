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
import { SectionHeader, Dropdown, TokenSingleChainListItem } from "station-ui"
import classNames from "classnames"
import { useWalletRoute, Page } from "./Wallet"
import { ChainID } from "types/network"
import { useNetwork } from "data/wallet"

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
      .filter((a) => (filterChain ? a.chains.includes(filterChain) : true))

    const chainList = filtered.reduce((acc, { chains, symbol, balance }) => {
      chains.forEach((chain: ChainID) => {
        if (!acc.includes(chain)) {
          const token = {
            symbol,
            chain,
            name: network[chain].name,
            icon: network[chain].icon,
            balance,
          }
          acc.push(token)
        }
      })
      return acc
    }, [])

    const visible = filtered
      .filter(
        (a) =>
          a.price * toInput(a.balance) >= 1 || alwaysVisibleDenoms.has(a.denom)
      )
      .sort(
        (a, b) => b.price * parseInt(b.balance) - a.price * parseInt(a.balance)
      )

    const lowBal = filtered.filter((a) => !visible.includes(a))
    return { visible, lowBal, chainList }
  }, [list, onlyShowWhitelist, filterChain, network, alwaysVisibleDenoms])

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
    if (!coins) return

    return (
      <div>
        {isWalletEmpty && (
          <FormError>{t("Coins required to post transactions")}</FormError>
        )}
        <section>
          {filter && (
            <Dropdown
              value="all"
              onChange={(chain) => setFilterChain(chain)}
              options={[
                { value: "all", label: "All Chains" },
                ...assets.chainList.map((c: any) => ({
                  value: c.chain,
                  label: c.name,
                })),
              ]}
            >
              {assets.chainList.map((chain: any) => (
                <TokenSingleChainListItem
                  {...chain}
                  chain={{
                    name: chain.name,
                    icon: chain.tokenImg,
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
          className={cx(styles.filter, { active: filter, inactive: !filter })}
          onClick={toggleFilter}
        />
      </div>
      <div className={styles.assetlist__list}>{render()}</div>
    </article>
  )
}

export default AssetList
