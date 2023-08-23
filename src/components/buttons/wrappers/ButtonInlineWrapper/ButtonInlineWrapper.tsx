import { ReactElement } from 'react';
import styles from './ButtonInlineWrapper.module.scss';

export interface ButtonInlineWrapperProps {
  buttons: ReactElement[]
}

const ButtonInlineWrapper = ({ buttons }: ButtonInlineWrapperProps) => {
  return (
    <div className={styles.wrapper}>
      {buttons}
    </div>
  );
};

export default ButtonInlineWrapper;