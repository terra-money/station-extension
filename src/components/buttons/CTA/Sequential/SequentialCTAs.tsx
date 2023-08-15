import { ReactElement } from 'react';
import styles from '../CTAs.module.scss';

export interface SequentialCTAsProps {
  firstCTA: ReactElement
  secondCTA: ReactElement
}

const SequentialCTAs = ({firstCTA, secondCTA}: SequentialCTAsProps) => {
  return (
    <div className={styles.sequential__container}>
      {firstCTA}
      {secondCTA}
    </div>
  );
};

export default SequentialCTAs;