import classNames from "classnames"
import { Tooltip } from "components"
import { ReactComponent as TrendUp } from "assets/icon/TrendUp.svg"
import { ReactComponent as TrendDown } from "assets/icon/TrendDown.svg"
import { ChainImage, TokenImage } from "../utils"
import { truncate } from 'utils/format'
import styles from "../TokenListItem.module.scss"

const cx = classNames.bind(styles)

const BuildChainList = (chain: { name: string, icon: string, balance: string }, index: number) => {
  return (
    <div key={index} className={styles.container}>
      <ChainImage
        chainImg={chain.icon}
        chainName={chain.name}
        className={styles.chain__icon}
        small
      />
      <div className={styles.text__container}>
        <span className={styles.chain}>{chain.name}</span>
        <span className={styles.balance}>{chain.balance}</span>
      </div>
    </div>
  )
}

export interface TokenListItemProps {
  chains: { name: string, icon: string, balance: string }[]
  tokenImg: string
  symbol: string
  change?: number
  amountNode: React.ReactNode
  priceNode: React.ReactNode
  onClick?: () => void
}

const TokenListItem = ({
  priceNode,
  chains,
  tokenImg,
  symbol,
  change = 0,
  amountNode,
  onClick,
}: TokenListItemProps) => {
  const TooltipContent = () => {
    return (
      <div className={styles.chains__list}>
        {chains.map((c, index) => BuildChainList(c, index))}
      </div>
    )
  }

  return (
    <div className={cx(styles.token__container, {[styles.pointer] : !!onClick})} onClick={onClick}>
      <div className={styles.details}>
        <div className={styles.token__icon__container}>
          <TokenImage
            tokenImg={tokenImg}
            tokenName={symbol}
            className={styles.token__icon}
          />
        </div>
        <div className={styles.details__container}>
          <div className={styles.top__row}>
            <h2 className={styles.symbol}>
              <span className={styles.symbol__name}>{truncate(symbol, [15, 15])}</span>
              {chains?.length > 1 ? (
                <Tooltip className={styles.tooltip} placement="top" content={<TooltipContent/>}>
                  <span className={cx(styles.chain__details, styles.num)}>{chains.length}</span>
                </Tooltip>
              ) : (
                chains.length === 1 && <span className={cx(styles.chain__details, styles.single)}>{chains[0].name}</span>
              )}
            </h2>
            <h3 className={styles.amount}>
              {amountNode}
            </h3>
          </div>
          <div className={styles.bottom__row}>
            <h5
              className={change >= 0 ? styles.change__up : styles.change__down}
            >
              {change >= 0 ? <TrendUp /> : <TrendDown />} {change.toFixed(2)}%
            </h5>
            <h5 className={styles.price}>
              {priceNode}
            </h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenListItem
