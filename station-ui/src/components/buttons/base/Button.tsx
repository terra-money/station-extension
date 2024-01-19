import { ButtonHTMLAttributes, ForwardedRef, ReactNode, forwardRef } from 'react';
import classNames from 'classnames/bind';
import { LoadingCircular } from 'components/feedback';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

export interface ButtonConfig {
  variant:
    'primary' | 'secondary' | 'warning' | 'dashed' | 'white-filled' | 'outlined'
  label?: string
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  icon?: ReactNode
  small?: boolean
}

type Props = ButtonConfig & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef(
  (
    { ...props }: Props,
    ref?: ForwardedRef<HTMLButtonElement>
  ) => {
    const { variant, label, loading, icon, block, className, children, type, small, ...attrs } = props;
    const buttonClassName = cx(styles.button, variant, className, { block, loading, small });

    return (
      <button
        type={type ?? 'button'}
        {...attrs}
        className={buttonClassName}
        ref={ref}
        disabled={attrs.disabled ?? loading}
      >
        {loading ? <LoadingCircular size={14} /> : icon}
        {children ?? label}
      </button>
    );
  },
);

export default Button;
