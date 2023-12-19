import { WalletIcon } from 'assets';
import styles from './AssetSelectorSkeleton.module.scss';

const AssetSelectorSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.header}>
        <WalletIcon width={12} height={12} fill='var(--token-dark-900)' />
        <div className={styles.wallet__amount} />
      </div>

      <div className={styles.inputs}>
        <div className={styles.token__selector}>
          <div className={styles.image}></div>
          <div className={styles.token__wrapper}>
            <div className={styles.symbol} />
            <div className={styles.chain__wrapper} />
          </div>
        </div>

        <div className={styles.amounts__wrapper}>
          <div className={styles.input__amount} />
          <div className={styles.amount__currency} />
        </div>
      </div>
    </div>
  );
};

export default AssetSelectorSkeleton;
