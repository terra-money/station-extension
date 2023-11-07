import { useTranslation } from "react-i18next"
import { Read } from "components/token"
import { useExchangeRates } from "data/queries/coingecko"
import { combineState } from "data/query"
import { useCurrency } from "data/settings/Currency"
import { WithFetching } from "components/feedback"
import { useMemo } from "react"

import styles from "./Asset.module.scss"
import { useWalletRoute, Path } from "./Wallet"
import { TokenListItem } from "station-ui"
import { useBankBalance } from "data/queries/bank"
import { useNativeDenoms } from "data/token"
import { useNetwork } from "data/wallet"

export interface Props extends TokenItem, QueryState {
  balance?: Amount
  denom: string
  price?: number
  change?: number
  hideActions?: boolean
  chains: string[]
  id: string
}

interface AssetInfo {
  chain: string
  name: string
  icon: string
  balance: string
}

const Asset = (props: Props) => {
  const { icon, denom, decimals, id, balance, ...state } = props
  const { t } = useTranslation()
  const currency = useCurrency()
  const readNativeDenom = useNativeDenoms()
  const network = useNetwork()
  const coins = useBankBalance()

  const { data: prices, ...pricesState } = useExchangeRates()
  const { route, setRoute } = useWalletRoute()

  const price = props.price ?? prices?.[props.token]?.price
  const change = props.change ?? prices?.[props.token]?.change

  const handleAssetClick = () => {
    if (route.path !== Path.coin)
      setRoute({ path: Path.coin, denom: id, previousPage: route })
  }

  const chains = useMemo(() => {
    return props.chains.reduce((acc, chain) => {
      if (!network[chain] || acc.some((c) => c.chain === chain)) return acc

      const coin = coins.find((b) => {
        const { token, symbol } = readNativeDenom(b.denom, b.chain)
        return (
          token === props.token && props.symbol === symbol && b.chain === chain
        )
      })

      const balanceVal = Number(coin?.amount) ?? 0
      const bal = Math.pow(10, -decimals) * balanceVal

      const { name, icon } = network[chain]

      if (!isNaN(bal)) {
        acc.push({
          chain,
          name,
          icon,
          balance: bal.toFixed(2),
        })
      }

      return acc
    }, [] as AssetInfo[])
  }, [
    props.chains,
    props.token,
    props.symbol,
    readNativeDenom,
    coins,
    network,
    decimals,
  ])

  const AmountNode = () => {
    return (
      <WithFetching
        {...combineState(state, pricesState)}
        yOffset={-5}
        height={1}
      >
        {(progress, wrong) => (
          <>
            {progress}
            {wrong ? (
              <span className="danger">{t("Query failed")}</span>
            ) : (
              <Read
                {...props}
                amount={balance}
                token=""
                fixed={2}
                decimals={decimals}
              />
            )}
          </>
        )}
      </WithFetching>
    )
  }

  const PriceNode = () => {
    return (
      <>
        {currency.symbol}
        {price ? (
          <Read
            {...props}
            amount={price * parseInt(balance ?? "0")}
            decimals={decimals}
            fixed={2}
            denom=""
            token=""
          />
        ) : (
          <span>—</span>
        )}
      </>
    )
  }

  return (
    <div className={styles.asset}>
      <TokenListItem
        chains={chains}
        onClick={handleAssetClick}
        amountNode={<AmountNode />}
        priceNode={<PriceNode />}
        change={change}
        symbol={props.symbol}
        tokenImg={icon ?? ""}
      />
    </div>
  )
}

export default Asset