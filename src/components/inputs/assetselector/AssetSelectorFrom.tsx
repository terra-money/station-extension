import { InputHTMLAttributes, ReactNode } from 'react';
import { ReactComponent as DropdownArrowIcon } from 'assets/icon/DropdownArrow.svg';
import styles from './AssetSelector.module.scss';

export interface AssetSelectorFromProps {
  extra: ReactNode
  symbol: string
  tokenIcon: string
  onSymbolClick: () => void
  chainIcon: string
  chainName: string
  amountInputAttrs: InputHTMLAttributes<HTMLInputElement>
  currencyAmount: string
}

const AssetSelectorFrom = ({
  extra,
  symbol,
  tokenIcon,
  onSymbolClick,
  chainIcon,
  chainName,
  amountInputAttrs,
  currencyAmount,
}: AssetSelectorFromProps) => {
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
                onClick={() => {
                  onSymbolClick();
                }}
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
            <input
              className={styles.amount__token}
              type='number'
              inputMode='decimal'
              placeholder='0.00'
              {...amountInputAttrs}
            />
          </div>
          <div className={styles.amount__currency}>
            {currencyAmount !== "$NaN" ? currencyAmount : '$0.00'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetSelectorFrom;
