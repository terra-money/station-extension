import { useTranslation } from "react-i18next"
import { Read } from "components/token"
import { combineState } from "data/query"
import { WithFetching } from "components/feedback"
import { useMemo } from "react"

import styles from "./Asset.module.scss"
import { TokenListItem } from "@terra-money/station-ui"
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
  onClick?: () => void
}

interface AssetInfo {
  chain: string
  name: string
  icon: string
  balance: string
}

const Asset = (props: Props) => {
  const {
    icon,
    denom,
    decimals,
    id,
    balance,
    onClick,
    price,
    change,
    ...state
  } = props
  const { t } = useTranslation()
  const coins = useBankBalance()
  const readNativeDenom = useNativeDenoms()
  const network = useNetwork()

  const chains = useMemo(() => {
    return props.chains.reduce((acc, chain) => {
      if (!network[chain] || acc.some((c) => c.chain === chain)) return acc

      const coin = coins.find((b) => {
        const { token, symbol } = readNativeDenom(b.denom, b.chain)
        return (
          token === props.denom && props.symbol === symbol && b.chain === chain
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
    props.denom,
    props.symbol,
    readNativeDenom,
    coins,
    network,
    decimals,
  ])

  const AmountNode = () => {
    return (
      <WithFetching {...combineState(state)} yOffset={-5} height={1}>
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
        {price ? (
          <Read
            {...props}
            amount={price * parseInt(balance ?? "0")}
            decimals={decimals}
            fixed={2}
            denom=""
            token=""
            currency
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
        onClick={onClick}
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
