import { ReactNode } from 'react';
import classNames from 'classnames/bind';
import styles from './SummaryCard.module.scss';

const cx = classNames.bind(styles);

export interface SummaryCardProps {
  className?: string;
  children?: ReactNode;
}

const SummaryCard = ({
  children,
  className,
}: SummaryCardProps) => {
  return (
    <div className={cx(styles.summary__card__container, className)}>
      {children}
    </div>
  );
};

export default SummaryCard;
