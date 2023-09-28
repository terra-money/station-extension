import { FormError } from "components/form"
import { InternalButton } from "components/general"
import { useBankBalance, useIsWalletEmpty } from "data/queries/bank"
import { useNativeDenoms } from "data/token"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import ManageTokens from "./ManageTokens"
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
import { SectionHeader } from "station-ui"

const AssetList = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const { onlyShowWhitelist, hideLowBal, toggleHideLowBal } = useTokenFilters()
  const unknownIBCDenoms = useUnknownIBCDenoms()
  const coins = useBankBalance()
  const readNativeDenom = useNativeDenoms()
  const native = useCustomTokensNative()
  const cw20 = useCustomTokensCW20()
  const list = useParsedAssetList() as any[]
  const hiddenList = [] as any[]

  const alwaysVisibleDenoms = useMemo(
    () =>
      new Set([
        ...cw20.list.map((a) => a.token),
        ...native.list.map((a) => a.denom),
      ]),
    [cw20.list, native.list]
  )

  const assetList = list
    .filter((a) => (onlyShowWhitelist ? a.whitelisted : true))
    .filter((a) => {
      const { token } = readNativeDenom(a.denom)
      const visible =
        a.price * toInput(a.balance) >= 1 || alwaysVisibleDenoms.has(token)
      if (!visible) hiddenList.push(a)
      return visible
    })
    .sort(
      (a, b) => b.price * parseInt(b.balance) - a.price * parseInt(a.balance)
    )

  const LowBalList = () => {
    if (!hiddenList.length) return null
    return (
      <>
        <SectionHeader
          title={t(`Show Low Balance Assets (${hiddenList.length})`)}
          withLine
          onClick={toggleHideLowBal}
        />
        {!hideLowBal && (
          <section>
            {hiddenList.map(({ denom, chainID, id, ...item }, i) => (
              <Asset
                denom={denom}
                {...readNativeDenom(
                  unknownIBCDenoms[[denom, chainID].join("*")]?.baseDenom ??
                    denom,
                  unknownIBCDenoms[[denom, chainID].join("*")]?.chainID ??
                    chainID
                )}
                id={id}
                {...item}
                key={i}
              />
            ))}
          </section>
        )}
      </>
    )
  }

  const List = () => {
    return (
      <section>
        {assetList.map(({ denom, chainID, id, ...item }, i) => (
          <Asset
            denom={denom}
            {...readNativeDenom(
              unknownIBCDenoms[[denom, chainID].join("*")]?.baseDenom ?? denom,
              unknownIBCDenoms[[denom, chainID].join("*")]?.chainID ?? chainID
            )}
            id={id}
            {...item}
            key={i}
          />
        ))}
      </section>
    )
  }

  const render = () => {
    if (!coins) return

    return (
      <>
        {isWalletEmpty && (
          <FormError>{t("Coins required to post transactions")}</FormError>
        )}
        <List />
        <LowBalList />
      </>
    )
  }

  return (
    <article className={styles.assetlist}>
      <div className={styles.assetlist__title}>
        <SectionHeader title={t("Assets")} />
        <ManageTokens>
          {(open) => (
            <InternalButton onClick={open}>
              <FilterListIcon />
            </InternalButton>
          )}
        </ManageTokens>
      </div>
      <div className={styles.assetlist__list}>{render()}</div>
    </article>
  )
}

export default AssetList
