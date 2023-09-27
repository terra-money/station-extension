import { ReactComponent as PriceUp } from "assets/icon/PriceUp.svg";
import classNames from "classnames";
import { ReactComponent as PriceDown } from "assets/icon/PriceDown.svg";
import styles from '../TokenListItem.module.scss';
import { Tooltip } from "components";

const cx = classNames.bind(styles);

export interface TokenListItemProps {
  balance?: string
  chains: { name: string, img: string, balance: string }[]
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
  price = 0,
  change = 0,
  amountNode,
  onClick,
}: TokenListItemProps) => {

  const walletPrice = price * parseInt(balance ?? "0")

  const TooltipContent = () => (
    <div className={styles.chains__list}>
      {chains.map((c, index) => (
        <div key={index} className={styles.container}>
          <img src={c.img} alt={c.name} />
          <div className={styles.text__container}>
            <span className={styles.chain}>{c.name}</span>
            <span className={styles.balance}>{c.balance}</span>
          </div>
        </div>
      ))}
    </div>
  );

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
              {chains?.length > 1 ? (
                <Tooltip className={styles.tooltip} content={<TooltipContent/>} placement='top'>
                  <span className={cx(styles.chain__details, styles.num)}>{chains.length}</span>
                </Tooltip>
              ) : (
                <span className={cx(styles.chain__details, styles.single)}>{chains[0].name}</span>
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
              {change >= 0 ? <PriceUp /> : <PriceDown />} {change.toFixed(2)}%
            </h5>
            <h5 className={styles.price}>
              {currency.symbol}{" "}
              {price ? (
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
