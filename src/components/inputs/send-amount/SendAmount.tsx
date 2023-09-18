/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputHTMLAttributes, useRef, useState } from 'react';
import { ReactComponent as SwapArrows } from 'assets/icon/SwapArrows.svg';
import styles from './SendAmount.module.scss';

export interface SendAmountProps {
  displayType: 'token' | 'currency';
  amount: number;
  symbol: string;
  tokenIcon: string;
  secondaryAmount: number;
  amountInputAttrs: InputHTMLAttributes<HTMLInputElement>
  currencySymbol: string;
  price: number;
}

const SendAmount = ({
  displayType = 'token',
  amount,
  symbol,
  tokenIcon,
  secondaryAmount = 0,
  amountInputAttrs,
  currencySymbol,
  price
}: SendAmountProps) => {
  const [displayOverride, setDisplayOverride] = useState(displayType);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: any) => {
    if (inputRef.current) {
      const parentElement = inputRef.current.parentNode as HTMLElement;
      if (parentElement) {
        parentElement.dataset.value = e.target.value;
      }
    }
  }

  const forceSwitch = () => {
    if (displayOverride === 'token') {
      setDisplayOverride('currency');
    } else {
      setDisplayOverride('token');
    }
  }

  return (
    <div className={styles.send__amount__container}>
      {displayOverride === 'token' && (
        <>
          <div className={styles.input__amount}>
            <label className={styles.input__container}>
              <input
                type='number'
                onInput={(e) => handleInput(e)}
                min={1}
                max={1}
                placeholder="0"
                {...amountInputAttrs}
              />
              <span ref={inputRef} className={styles.input__label}>{amount}</span>
            </label>
            <div className={styles.amount__symbol}>{symbol}</div>
          </div>
          <div className={styles.currency}>
            {currencySymbol}{(secondaryAmount * price).toFixed(2) || 0}
            <SwapArrows onClick={forceSwitch} fill='var(--token-dark-900)' height={16} width={16} />
          </div>
        </>
      )}

      {displayOverride === 'currency' && (
        <>
          <div className={styles.input__amount}>
            <label className={styles.input__container}>
            <div className={styles.amount__symbol}>{currencySymbol}</div>
              <input
                type='number'
                onInput={(e) => handleInput(e)}
                min={1}
                max={1}
                placeholder="0"
                {...amountInputAttrs}
                style={{ textAlign: 'start' }}
              />
              <span ref={inputRef} className={styles.input__label}>{amount}</span>
            </label>
          </div>
          <div className={styles.currency}>
            <img src={tokenIcon} width={16} height={16} />
            {(secondaryAmount / price || 0).toFixed(4)} {symbol}
            <SwapArrows onClick={forceSwitch} fill='var(--token-dark-900)' height={16} width={16} />
          </div>
        </>
      )}
    </div>
  );
};

export default SendAmount;
