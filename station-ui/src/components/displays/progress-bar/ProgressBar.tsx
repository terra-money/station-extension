import { useRef, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ProgressBar.module.scss';

const cx = classNames.bind(styles);

export type ProgressBarData = {
  type: 'yes' | 'abstain' | 'no' | 'noWithVeto' | 'deposit';
  percent: string;
};

export type ProgressBarProps = {
  data: ProgressBarData[];
  threshold: number;
  isSmall?: boolean;
  labelOverride?: string;
};

const ProgressBar = ({ data, threshold, isSmall, labelOverride }: ProgressBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelPosition, setLabelPosition] = useState({ transform: 'translateX(-50%)' });

  const hasThresholdBeenMet = () => {
    const totalPercentage = data.reduce((sum, item) => {
      return sum + parseFloat(item.percent.replace('%', ''));
    }, 0);
    return totalPercentage >= threshold;
  }

  useEffect(() => {
    if (containerRef.current && labelRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const labelWidth = labelRef.current.offsetWidth;

      const spaceLeft = threshold / 100 * containerWidth;
      const spaceRight = containerWidth - spaceLeft;

      if (spaceLeft < labelWidth / 2) {
        setLabelPosition({ transform: 'translateX(0%)' });
      } else if (spaceRight < labelWidth / 2) {
        setLabelPosition({ transform: 'translateX(-100%)' });
      } else {
        setLabelPosition({ transform: 'translateX(-50%)' });
      }
    }
  }, [threshold]);

  return (
    <div className={cx(styles.progress__bar__container, { small: isSmall })} ref={containerRef}>
      <div className={styles.progress__bar}>
        {data.map((bar, index) => (
          <div
            key={index}
            className={styles[bar.type]}
            style={{ width: bar.percent }}
          />
        ))}
      </div>
      <div
        className={cx(styles.threshold, { [styles.has__threshold]: hasThresholdBeenMet() })}
        style={{ left: `${threshold}%` }}
      >
        <span className={styles.label} style={labelPosition} ref={labelRef}>
          {labelOverride ? labelOverride : hasThresholdBeenMet() ? 'Pass Threshold' : 'Quorum'}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
