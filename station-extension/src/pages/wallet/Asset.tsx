import { TokenListItem } from "@terra-money/station-ui"
import { WithFetching } from "components/feedback"
import { useTranslation } from "react-i18next"
import { combineState } from "data/query"
import styles from "./Asset.module.scss"
import { Read } from "components/token"
import { useMemo } from "react"

export interface Props extends TokenItem, QueryState {
  totalBalance?: Amount
  denom: string
  price?: number
  change?: number
  hideActions?: boolean
  chains: string[]
  tokenChainInfo: AssetInfo[]
  symbol: string
  id: string
  onClick?: () => void
}

interface AssetInfo {
  balance: string
  chain: string
  name: string
  icon: string
}

const Asset = (props: Props) => {
  const {
    denom,
    symbol,
    icon,
    decimals,
    totalBalance,
    onClick,
    price,
    change,
    ...state
  } = props
  const { t } = useTranslation()

  const chains = useMemo(() => {
    return props.tokenChainInfo.reduce((acc, chain) => {
      const bal = Math.pow(10, -decimals) * parseInt(chain.balance)

      if (!isNaN(bal)) {
        acc.push({
          ...chain,
          balance: bal.toFixed(2),
        })
      }

      return acc
    }, [] as AssetInfo[])
  }, [decimals, props.tokenChainInfo])

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
                amount={totalBalance}
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
            amount={price * parseInt(totalBalance ?? "0")}
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
        symbol={symbol}
        tokenImg={icon ?? ""}
      />
    </div>
  )
}

export default Asset
