import { FormError } from "components/form"
import { InternalButton } from "components/general"
import { useBankBalance, useIsWalletEmpty } from "data/queries/bank"
import { useExchangeRates } from "data/queries/coingecko"
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
import { useIBCBaseDenoms } from "data/queries/ibc"

const AssetList = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const { hideNoWhitelist, hideLowBal } = useTokenFilters()

  const coins = useBankBalance()
  const { data: prices } = useExchangeRates()
  const readNativeDenom = useNativeDenoms()
  const native = useCustomTokensNative()
  const cw20 = useCustomTokensCW20()
  const alwaysVisibleDenoms = useMemo(
    () =>
      new Set([
        ...cw20.list.map((a) => a.token),
        ...native.list.map((a) => a.denom),
      ]),
    [cw20.list, native.list]
  )

  const unknownIBCDenomsData = useIBCBaseDenoms(
    coins
      .map(({ denom, chain }) => ({ denom, chainID: chain }))
      .filter(({ denom }) => {
        const data = readNativeDenom(denom)
        return denom.startsWith("ibc/") && data.symbol.endsWith("...")
      })
  )
  const unknownIBCDenoms = unknownIBCDenomsData.reduce(
    (acc, { data }) =>
      data ? { ...acc, [data.ibcDenom]: data.baseDenom } : acc,
    {} as Record<string, string>
  )

  const list = useMemo(
    () =>
      [
        ...Object.values(
          coins.reduce((acc, { denom, amount, chain }) => {
            const data = readNativeDenom(unknownIBCDenoms[denom] ?? denom)

            if (acc[data.token]) {
              acc[data.token].balance = `${
                parseInt(acc[data.token].balance) + parseInt(amount)
              }`
              acc[data.token].chains.push(chain)
              return acc
            } else {
              return {
                ...acc,
                [data.token]: {
                  denom: data.token,
                  balance: amount,
                  icon: data.icon,
                  symbol: data.symbol,
                  price: prices?.[data.token]?.price ?? 0,
                  change: prices?.[data.token]?.change ?? 0,
                  chains: [chain],
                },
              }
            }
          }, {} as Record<string, any>)
        ),
      ]
        .filter(
          (a) => (hideNoWhitelist ? !a.symbol.endsWith("...") : true) // TODO: update and implement whitelist check
        )
        .filter((a) => {
          if (!hideLowBal || a.price === 0 || alwaysVisibleDenoms.has(a.denom))
            return true
          return a.price * toInput(a.balance) >= 1
        })
        .sort(
          (a, b) =>
            b.price * parseInt(b.balance) - a.price * parseInt(a.balance)
        ),
    [
      coins,
      readNativeDenom,
      prices,
      hideNoWhitelist,
      hideLowBal,
      alwaysVisibleDenoms,
      unknownIBCDenoms,
    ]
  )

  const render = () => {
    if (!coins) return

    return (
      <div>
        {isWalletEmpty && (
          <FormError>{t("Coins required to post transactions")}</FormError>
        )}
        <section>
          {list.map(({ denom, ...item }) => (
            <Asset
              denom={denom}
              {...readNativeDenom(unknownIBCDenoms[denom] ?? denom)}
              {...item}
              key={denom}
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
            <InternalButton onClick={open}>{t("Manage tokens")}</InternalButton>
          )}
        </ManageTokens>
      </div>
      <div className={styles.assetlist__list}>{render()}</div>
    </article>
  )
}

export default AssetList
