import { ReactNode } from 'react';
import { FlexColumn } from 'components';
import styles from './VestingCard.module.scss';

export interface VestingCardProps {
  className?: string;
  vestedAmount: string;
  children?: ReactNode;
}

const VestingCard = ({
  className,
  vestedAmount,
  children,
}: VestingCardProps) => {
  return (
    <FlexColumn gap={1} className={className}>
      <div className={styles.token__container}>
        {children}
      </div>
      <div className={styles.vested__amount__container}>
        <h5>Vested</h5>
        <h4>{vestedAmount}</h4>
      </div>
    </FlexColumn>
  );
};

export default VestingCard;
