import { ButtonHTMLAttributes, ForwardedRef, ReactNode, forwardRef } from 'react';
import classNames from 'classnames/bind';
import { LoadingCircular } from 'components/feedback';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

export interface ButtonConfig {
  color:
    'primary' | 'secondary' | 'destructive' | 'dashed' | 'white-filled' | 'outline'
  label: string
  block?: boolean
  loading?: boolean
  icon?: ReactNode
}

type Props = ButtonConfig & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef(
  (
    { ...props }: Props,
    ref?: ForwardedRef<HTMLButtonElement>
  ) => {
    const { color, label, loading, icon, block, className, ...attrs } = props;
    const buttonClassName = cx(styles.button, color, className, { block, loading });

    return (
      <button
        type='button'
        {...attrs}
        className={buttonClassName}
        ref={ref}
        disabled={attrs.disabled || loading}
      >
        {loading ? <LoadingCircular size={16} /> : icon}
        {label}
      </button>
    );
  },
);

export default Button;
