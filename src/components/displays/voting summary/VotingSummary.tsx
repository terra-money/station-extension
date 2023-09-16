import { ReactNode } from 'react';
import classNames from 'classnames/bind';
import ProgressBar from '../progress bar/ProgressBar';
import styles from './VotingSummary.module.scss';

const cx = classNames.bind(styles);

type ProgressBarData = {
  type: 'yes' | 'abstain' | 'no' | 'noWithVeto';
  percent: string;
  amount: string | ReactNode;
};

export type VotingSummaryProps = {
  data: ProgressBarData[];
  threshold: number;
};

const VotingSummary = ({ data, threshold }: VotingSummaryProps) => {
  const getCategory = (type: string) => {
    return type === 'noWithVeto' ? 'No (Veto)' : type;
  }

  return (
    <div className={styles.voting__summary__container}>
      <ProgressBar
        data={data}
        threshold={threshold}
      />

      <div className={styles.vote__details}>
        {data.map((item, index) => (
          <div className={styles.vote} key={index}>
            <h3 className={cx(styles.type, item.type)}>{getCategory(item.type)}</h3>
            <h6 className={styles.percent}>{item.percent}</h6>
            <p className={styles.amount}>{item.amount}</p>
            <div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingSummary;
