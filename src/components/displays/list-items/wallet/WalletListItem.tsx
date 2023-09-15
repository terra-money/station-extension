
import styles from './WalletListItem.module.scss';

export interface WalletListItemProps {
  name: string
  address: string
  emoji: string
  walletBalance?: string
}

const WalletListItem = ({
  name,
  address,
  emoji,
  walletBalance
}: WalletListItemProps) => {
  return (
    <div className={styles.wallet__li}>
      <div className={styles.wallet__emoji}>
        {emoji}
      </div>
      <div className={styles.wallet__details}>
        <h2 className={styles.wallet__name}>
          {name}
        </h2>
        <div className={styles.bottom__line}>
          <h5 className={styles.wallet__address}>
            {address}
          </h5>

          {walletBalance && (
            <h3 className={styles.wallet__balance}>
              {walletBalance}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletListItem;
