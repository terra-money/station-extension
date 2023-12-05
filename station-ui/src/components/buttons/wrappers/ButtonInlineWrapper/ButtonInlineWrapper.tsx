import { ReactNode } from 'react';
import styles from './ButtonInlineWrapper.module.scss';

export interface ButtonInlineWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

const ButtonInlineWrapper = ({children, ...rest}: ButtonInlineWrapperProps) => {
  return (
    <div {...rest} className={styles.wrapper}>
      {children}
    </div>
  );
};

export default ButtonInlineWrapper;