import Pill from 'components/general/pill/Pill';
import styles from '../TokenListItem.module.scss';

export interface TokenSingleChainListItemProps {
  balance?: string
  currency: { id: string, symbol: string, name: string }
  tokenImg: string
  symbol: string
  price?: number
  amountNode: React.ReactNode
  chain: { icon: string, label: string }
  isSendBack?: boolean
  onClick?: () => void
}

const TokenSingleChainListItem = ({
  balance,
  currency,
  tokenImg,
  symbol,
  price,
  amountNode,
  chain,
  isSendBack,
  onClick,
}: TokenSingleChainListItemProps) => {
  const coinPrice = price ?? 0;

  const walletPrice = coinPrice * parseInt(balance ?? "0");

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
              {isSendBack && <Pill variant='warning' text="Send Back" />}
            </h2>
            <h3 className={styles.amount}>
              {amountNode}
            </h3>
          </div>
          <div className={styles.bottom__row}>
            <h5 className={styles.chain__label}>
              <img
                src={chain.icon}
                alt={chain.label}
                className={styles.chain__icon}
              />
              {chain.label}
            </h5>
            <h5 className={styles.price}>
              {currency.symbol}
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

export default TokenSingleChainListItem;
