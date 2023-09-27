import { useTranslation } from "react-i18next"
import { Read } from "components/token"
import { useExchangeRates } from "data/queries/coingecko"
import { combineState } from "data/query"
import { useCurrency } from "data/settings/Currency"
import { WithFetching } from "components/feedback"

import styles from "./Asset.module.scss"
import { useWalletRoute, Path } from "./Wallet"
import { useNetwork } from "data/wallet"
import { TokenListItem } from "station-ui"
import { useBankBalance } from "data/queries/bank"
import { useNativeDenoms } from "data/token"

export interface Props extends TokenItem, QueryState {
  balance?: Amount
  denom: string
  price?: number
  change?: number
  hideActions?: boolean
  chains: string[]
  id: string
}

const Asset = (props: Props) => {
  const { icon, denom, decimals, id, balance, ...state } = props
  const { t } = useTranslation()
  const currency = useCurrency()
  const network = useNetwork()
  const coins = useBankBalance()
  const readNativeDenom = useNativeDenoms()

  const chains = Array.from(
    new Set(
      props.chains
        .filter((chain) => !!network[chain])
        .map((chain) => {
          const balance = coins.find((b) => {
            const { token, symbol } = readNativeDenom(b.denom, b.chain)
            return (
              token === props.token &&
              props.symbol === symbol &&
              b.chain === chain
            )
          })
          return {
            chain,
            name: network[chain].name,
            img: network[chain].icon,
            balance: (
              Math.pow(10, -decimals) * Number(balance?.amount) ?? 0
            ).toFixed(2),
          }
        })
    )
  )

  const { data: prices, ...pricesState } = useExchangeRates()
  const { route, setRoute } = useWalletRoute()

  const price = props.price ?? prices?.[props.token]?.price
  const change = props.change ?? prices?.[props.token]?.change

  const handleAssetClick = () => {
    if (route.path !== Path.coin)
      setRoute({ path: Path.coin, denom: id, previousPage: route })
  }

  const AmountNode = () => {
    return (
      <WithFetching {...combineState(state, pricesState)} height={1}>
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
