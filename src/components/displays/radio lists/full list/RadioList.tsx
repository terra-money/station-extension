import { ReactNode } from 'react';
import styles from './RadioList.module.scss';

export interface RadioListProps {
  children: ReactNode
}

const RadioList = ({ children }: RadioListProps) => {

  return (
    <div className={styles.radio__list}>
      {children}
    </div>
  );
};

export default RadioList;
