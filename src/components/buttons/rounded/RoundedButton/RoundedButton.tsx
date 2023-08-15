import { ButtonHTMLAttributes, ForwardedRef, ReactNode, forwardRef } from 'react';
import classNames from 'classnames/bind';
import styles from './RoundedButton.module.scss';

const cx = classNames.bind(styles);

export interface RoundedButtonConfig {
  color: 'primary' | 'secondary'
  icon: ReactNode
  size?: 'default' | 'small' | 'large'
}

type Props = RoundedButtonConfig & ButtonHTMLAttributes<HTMLButtonElement>;

const RoundedButton = forwardRef(
  (
    { ...props }: Props,
    ref?: ForwardedRef<HTMLButtonElement>
  ) => {
    const { color, icon, size, className, ...attrs } = props;
    const buttonClassNames = cx(
      styles.rounded__button,
      className,
      color,
      {
        large: size === 'large',
        small: size === 'small'
      }
    );

    return (
      <button type='button' {...attrs} className={buttonClassNames} ref={ref}>
        {icon}
      </button>
    );
  },
);

export default RoundedButton;
