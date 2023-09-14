
import { useState } from 'react';
import classNames from 'classnames/bind';
import { ReactComponent as CircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import styles from '../TokenListItem.module.scss';

const cx = classNames.bind(styles);

export interface TokenCheckboxListItemProps {
  tokenImg: string
  symbol: string
  chain: { icon: string, label: string }
  onClick?: () => void
}

const TokenCheckboxListItem = ({
  tokenImg,
  symbol,
  chain,
  onClick,
}: TokenCheckboxListItemProps) => {
  const [active, setActive] = useState(false);

  const handleClicked = () => {
    setActive(!active);
    if (onClick) {
      onClick();
    }
  }

  return (
    <div className={styles.token__container} onClick={handleClicked}>
      <div className={styles.details}>
        <div className={styles.token__icon__container}>
          <img
            src={tokenImg}
            alt={symbol}
            className={styles.token__icon}
          />
        </div>
        <div className={styles.details__container__lr}>
          <div className={styles.left}>
            <h1 className={styles.symbol}>
              <span className={styles.symbol__name}>{symbol}</span>
            </h1>
            <h2 className={styles.chain__label}>
              <img
                src={chain.icon}
                alt={chain.label}
                className={styles.chain__icon}
              />
              {chain.label}
            </h2>
          </div>
          <div className={styles.right}>
            <div className={cx(styles.checkbox__container, { active })}>
              <input type='checkbox' hidden />
              {active ? (
                <CircleCheck fill='var(--token-light-white)' />
              ) : (
                <span className={styles.track} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCheckboxListItem;
