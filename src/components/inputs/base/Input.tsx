import { InputHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames/bind';
import styles from './BaseInput.module.scss';

const cx = classNames.bind(styles);

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  actionIcon?: {
    icon: ReactNode
    onClick?: () => void
  }
  emoji?: string
}

const Input = ({ actionIcon, emoji, ...attrs }: InputProps) => {
  return (
    <div className={cx(styles.base__input)}>
      <input
        className={styles.base__input__field}
        type={attrs.type ?? 'text'}
        autoComplete='off'
        autoFocus={attrs.autoFocus ?? false}
        onWheel={(e) => e.currentTarget.blur()}
        {...attrs}
        ref={null}
      />
      {actionIcon && (
        <button
          type='button'
          className={styles.base__input__action}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            actionIcon?.onClick?.();
          }}
        >
          {actionIcon.icon}
        </button>
      )}

      {emoji && (
        <span className={styles.base__input__emoji}>
          {emoji}
        </span>
      )}
    </div>
  );
};

export default Input;
