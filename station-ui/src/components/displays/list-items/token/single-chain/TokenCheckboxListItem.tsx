import classNames from "classnames/bind"
import { ReactComponent as CircleCheck } from "assets/icon/SmallCircleCheck.svg"
import { ChainImage, TokenImage } from "../utils"
import { truncate } from 'utils/format'
import styles from "../TokenListItem.module.scss"

const cx = classNames.bind(styles)

export interface TokenCheckboxListItemProps {
  tokenImg: string
  symbol: string
  chain: { icon: string, label: string }
  onClick: () => void
  checked?: boolean
}

const TokenCheckboxListItem = ({
  tokenImg,
  symbol,
  chain,
  onClick,
  checked
}: TokenCheckboxListItemProps) => {
  return (
    <div className={cx(styles.token__container, { [styles.pointer] : !!onClick})} onClick={onClick}>
      <div className={styles.details}>
        <div className={styles.token__icon__container}>
          <TokenImage
            tokenImg={tokenImg}
            tokenName={symbol}
            className={styles.token__icon}
          />
        </div>
        <div className={styles.details__container__lr}>
          <div className={styles.left}>
            <h2 className={styles.symbol}>
              <span className={styles.symbol__name}>{truncate(symbol, [15, 15])}</span>
            </h2>
            <h3 className={styles.chain__label}>
              <ChainImage
                chainImg={chain.icon}
                chainName={chain.label}
                className={styles.chain__icon}
                small
              />
              {chain.label}
            </h3>
          </div>
          <div className={styles.right}>
            <div className={cx(styles.checkbox__container)}>
              <input type="checkbox" hidden />
              {checked ? (
                <CircleCheck fill="var(--token-light-white)" />
              ) : (
                <span className={styles.track} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenCheckboxListItem
