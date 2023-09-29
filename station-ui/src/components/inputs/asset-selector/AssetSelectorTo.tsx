import { ReactNode } from 'react';
import classNames from 'classnames/bind';
import { ReactComponent as DropdownArrowIcon } from 'assets/icon/DropdownArrow.svg';
import { ReactComponent as RoughlyEquals } from 'assets/icon/RoughlyEquals.svg';
import styles from './AssetSelector.module.scss';

const cx = classNames.bind(styles);

export interface AssetSelectorToProps {
  extra: ReactNode
  symbol: string
  tokenIcon: string
  onSymbolClick: () => void
  chainIcon: string
  chainName: string
  amount: string
  currencyAmount: string
}

const AssetSelectorTo = ({
  extra,
  symbol,
  tokenIcon,
  onSymbolClick,
  chainIcon,
  chainName,
  currencyAmount,
  amount
}: AssetSelectorToProps) => {
  return (
    <div className={styles.asset__selector_wrapper}>
      <div className={styles.header}>
        {extra}
      </div>

      <div className={styles.inputs}>
        <div className={styles.token__selector}>
          <img src={tokenIcon} width={26} height={26} />
          <div className={styles.token__wrapper}>
            <div className={styles.symbol}>
              <button
                type='button'
                className={styles.symbol__button}
                onClick={onSymbolClick}
              >
                {symbol}
                <DropdownArrowIcon fill="var(--token-light-white)" />
              </button>
            </div>
            <div className={styles.chain__wrapper}>
              <img src={chainIcon} width={12} height={12} />
              <div className={styles.chain__name}>{chainName}</div>
            </div>
          </div>
        </div>

        <div className={styles.amounts__wrapper}>
          <div className={styles.input__amount}>
            <RoughlyEquals fill='var(--token-light-100)' />
            <span className={cx(styles.amount__token, { [`${styles.amount__empty}`]: amount === "NaN" })}>
              {amount !== "NaN" ? amount : '0.00'}
            </span>
          </div>
          <div className={styles.amount__currency}>
            {currencyAmount !== "$NaN" ? currencyAmount : '$0.00'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetSelectorTo;
