import { ReactNode } from 'react';
import styles from './ButtonInlineWrapper.module.scss';

export interface ButtonInlineWrapperProps {
  children?: ReactNode
}

const ButtonInlineWrapper = (props: ButtonInlineWrapperProps) => {
  return (
    <div className={styles.wrapper}>
      {props.children}
    </div>
  );
};

export default ButtonInlineWrapper;