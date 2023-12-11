import { useState } from 'react';
import classNames from 'classnames/bind';
import { ReactComponent as CircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import DefaultTokenIcon from 'assets/icon/DefaultToken.svg';
import DefaultChainIcon from 'assets/icon/DefaultChain.svg';
import styles from '../TokenListItem.module.scss';

const cx = classNames.bind(styles);

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
  const [displayTokenImg, setDisplayTokenImg] = useState(tokenImg)
  const [displayChainImg, setDisplayChainImg] = useState(chain.icon);

  const handleTokenImgError = (e: { stopPropagation: () => void; }, type: string) => {
    e.stopPropagation()
    if (type === 'token') {
      setDisplayTokenImg(DefaultTokenIcon)
    } else if (type === 'chain') {
      setDisplayChainImg(DefaultChainIcon)
    }
  }

  return (
    <div className={styles.token__container} onClick={onClick}>
      <div className={styles.details}>
        <div className={styles.token__icon__container}>
          <img
            src={displayTokenImg}
            alt={symbol}
            className={styles.token__icon}
            onError={(e) => handleTokenImgError(e, 'token')}
          />
        </div>
        <div className={styles.details__container__lr}>
          <div className={styles.left}>
            <h2 className={styles.symbol}>
              <span className={styles.symbol__name}>{symbol}</span>
            </h2>
            <h3 className={styles.chain__label}>
                <img
                  src={displayChainImg}
                  alt={chain.label}
                  className={styles.chain__icon}
                  onError={(e) => handleTokenImgError(e, 'chain')}
                />
              {chain.label}
            </h3>
          </div>
          <div className={styles.right}>
            <div className={cx(styles.checkbox__container)}>
              <input type='checkbox' hidden />
              {checked ? (
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
