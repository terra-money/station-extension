import { ReactComponent as PriceUp } from "assets/icon/PriceUp.svg";
import { ReactComponent as PriceDown } from "assets/icon/PriceDown.svg";

import styles from '../TokenListItem.module.scss';

export interface TokenListItemProps {
  balance?: string
  chains: string[]
  currency: { id: string, symbol: string, name: string }
  tokenImg: string
  symbol: string
  price?: number
  change?: number
  amountNode: React.ReactNode
  onClick?: () => void
}

const TokenListItem = ({
  balance,
  chains,
  currency,
  tokenImg,
  symbol,
  price,
  change,
  amountNode,
  onClick,
}: TokenListItemProps) => {
  const coinPrice = price ?? 0
  const token24hrChange = change ?? 0

  const walletPrice = coinPrice * parseInt(balance ?? "0")

  return (
    <div className={styles.token__container} onClick={onClick}>
      <div className={styles.details}>
        <div className={styles.token__icon__container}>
          <img
            src={tokenImg}
            alt={symbol}
            className={styles.token__icon}
          />
        </div>
        <div className={styles.details__container}>
          <div className={styles.top__row}>
            <h2 className={styles.symbol}>
              <span className={styles.symbol__name}>{symbol}</span>
              {chains && chains.length > 1 ? (
                <span className={styles.chain__num}>{chains.length}</span>
              ) : (
                <span className={styles.single__chain__text}>{chains[0]}</span>
              )}
            </h2>
            <h3 className={styles.amount}>
              {amountNode}
            </h3>
          </div>
          <div className={styles.bottom__row}>
            <h5
              className={token24hrChange >= 0 ? styles.change__up : styles.change__down}
            >
              {token24hrChange >= 0 ? <PriceUp /> : <PriceDown />} {token24hrChange.toFixed(2)}%
            </h5>
            <h5 className={styles.price}>
              {currency.symbol}{" "}
              {coinPrice ? (
                <div>{walletPrice}</div>
              ) : (
                <span>—</span>
              )}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenListItem;
