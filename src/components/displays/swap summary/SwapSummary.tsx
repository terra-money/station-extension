import { ReactComponent as FlipArrows } from 'assets/icon/FlipArrows.svg';
import styles from './SwapSummary.module.scss';

export interface SwapSummaryProps {
  fromAsset: {
    symbol: string;
    amount: string;
    icon: string;
  }
  toAsset: {
    symbol: string;
    amount: string;
    icon: string;
  }
}

const SwapSummary = ({ fromAsset, toAsset }: SwapSummaryProps) => {
  return (
    <div className={styles.swap__summary__container}>
      <div className={styles.from__section}>
        <img src={fromAsset.icon} alt={fromAsset.symbol} />
        <div className={styles.section__details}>
          <div className={styles.symbol}>{fromAsset.symbol}</div>
          <div className={styles.amount}>{fromAsset.amount}</div>
        </div>
      </div>

      <FlipArrows className={styles.swap__icon} fill="var(--token-dark-900)" height={14} width={14} />

      <div className={styles.to__section}>
        <div className={styles.section__details}>
          <div className={styles.symbol}>{toAsset.symbol}</div>
          <div className={styles.amount}>{toAsset.amount}</div>
        </div>
        <img src={toAsset.icon} alt={toAsset.symbol} />
      </div>
    </div>
  );
};

export default SwapSummary;
