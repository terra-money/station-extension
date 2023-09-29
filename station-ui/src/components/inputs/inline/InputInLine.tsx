import { ForwardedRef, InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import styles from './InputInLine.module.scss';

export interface InputInLineProps extends InputHTMLAttributes<HTMLInputElement> {
  extra?: ReactNode
  label: string
}

const InputInLine = forwardRef(
  (
    { extra, label, ...attrs }: InputInLineProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div className={styles.inline__input}>
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
