import classNames from 'classnames/bind';
import styles from "./WalletSummaryCard.module.scss";

const cx = classNames.bind(styles);

export interface WalletSummaryCardProps {
  className?: string;
  walletType: string;
  walletAddress: string;
  walletBalance: string;
  prevTransactions: string;
  isActive?: boolean;
  onClick?: () => void;
}

const WalletSummaryCard = ({
  className,
  walletType,
  walletAddress,
  walletBalance,
  prevTransactions,
  isActive,
  onClick,
}: WalletSummaryCardProps) => {
  const walletHasBalance = walletBalance[0] !== "0";
  const prevTransactionsExist = prevTransactions !== "0";

  return (
    <div className={cx(styles.wallet__summary__card__container, className, {isActive})} onClick={onClick}>
      <div className={styles.top}>
        <div className={styles.wallet__type}>{walletType}</div>
        <div className={styles.wallet__address}>{walletAddress}</div>
      </div>

      <span className={styles.line} />

      <div className={styles.bottom}>
        <div className={cx(styles.wallet__balance, { not__zero: walletHasBalance })}>
          <h6>Balance</h6>
          <h5>{walletBalance}</h5>
        </div>
        <div className={cx(styles.wallet__prev__transactions, { not__zero: prevTransactionsExist })}>
          <h6>Previous Txs</h6>
          <h5>{prevTransactions}</h5>
        </div>
      </div>
    </div>
  );
};

export default WalletSummaryCard;
