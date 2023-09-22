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

const AssetList = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const { onlyShowWhitelist, hideLowBal } = useTokenFilters()
  const unknownIBCDenoms = useUnknownIBCDenoms()
  const coins = useBankBalance()
  const readNativeDenom = useNativeDenoms()
  const native = useCustomTokensNative()
  const cw20 = useCustomTokensCW20()
  const list = useParsedAssetList() as any[]

  const alwaysVisibleDenoms = useMemo(
    () =>
      new Set([
        ...cw20.list.map((a) => a.token),
        ...native.list.map((a) => a.denom),
      ]),
    [cw20.list, native.list]
  )

  const sortedList = list
    .filter((a) => (onlyShowWhitelist ? a.whitelisted : true))
    .filter((a) => {
      const { token } = readNativeDenom(a.denom)

      if (!hideLowBal || a.price === 0 || alwaysVisibleDenoms.has(token))
        return true

      return a.price * toInput(a.balance) >= 1
    })
    .sort(
      (a, b) => b.price * parseInt(b.balance) - a.price * parseInt(a.balance)
    )

  const render = () => {
    if (!coins) return

    return (
      <div>
        {isWalletEmpty && (
          <FormError>{t("Coins required to post transactions")}</FormError>
        )}
        <section>
          {sortedList.map(({ denom, chainID, id, ...item }, i) => (
            <Asset
              denom={denom}
              {...readNativeDenom(
                unknownIBCDenoms[[denom, chainID].join("*")]?.baseDenom ??
                  denom,
                unknownIBCDenoms[[denom, chainID].join("*")]?.chainID ?? chainID
              )}
              id={id}
              {...item}
              key={i}
            />
          ))}
        </section>
      </div>
    )
  }

  return (
    <article className={styles.assetlist}>
      <div className={styles.assetlist__title}>
        <h3>Assets</h3>
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
