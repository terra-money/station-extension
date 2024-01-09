import { ForwardedRef, InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import styles from './InputInLine.module.scss';
import classNames from 'classnames';

export interface InputInLineProps extends InputHTMLAttributes<HTMLInputElement> {
  extra?: ReactNode
  label: string
}

const cx = classNames.bind(styles);

const InputInLine = forwardRef(
  (
    { extra, label, ...attrs }: InputInLineProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div className={cx(styles.inline__input, {onClick: !!attrs.onClick})}>
        <label className={styles.inline__input__label}>
          {label}
        </label>

        <input
          {...attrs}
          className={styles.base__input__field}
          type={attrs.type || 'text'}
          autoComplete='off'
          autoFocus={attrs.autoFocus || false}
          ref={ref}
        />

        {extra && (
          <span className={styles.inline__input__extra}>
            {extra}
          </span>
        )}
      </div>
    );
  },
);

export default InputInLine;
