import { FormError } from "components/form"
import { Button } from "components/general"
import { useBankBalance, useIsWalletEmpty } from "data/queries/bank"
import { useMemoizedPrices } from "data/queries/coingecko"
import { useNativeDenoms } from "data/token"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import AddTokens from "./AddTokens"
import Asset from "./Asset"
import styles from "./AssetList.module.scss"
import AddIcon from "@mui/icons-material/Add"
import CoinGeckoLink from "components/coingecko/CoinGeckoLink"

const AssetList = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()

  const coins = useBankBalance()
  const { data: prices } = useMemoizedPrices()
  const readNativeDenom = useNativeDenoms()

  const list = useMemo(
    () =>
      [
        ...Object.values(
          coins.reduce((acc, { denom, amount, chain }) => {
            const data = readNativeDenom(denom)
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
                  denom,
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
      ].sort(
        (a, b) => b.price * parseInt(b.balance) - a.price * parseInt(a.balance)
      ),
    [coins, readNativeDenom, prices]
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
              {...readNativeDenom(denom)}
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
        <CoinGeckoLink />
      </div>
      <div className={styles.assetlist__list}>{render()}</div>
      <div className={styles.assetlist__add}>
        <AddTokens>
          {(open) => (
            <Button onClick={open}>
              <AddIcon />
              {t("Add tokens")}
            </Button>
          )}
        </AddTokens>
      </div>
    </article>
  )
}

export default AssetList
