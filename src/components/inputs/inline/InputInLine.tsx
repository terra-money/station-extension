import { InputHTMLAttributes, ReactNode } from 'react';
import styles from './InputInLine.module.scss';

// const cx = classNames.bind(styles);

export interface InputInLineProps extends InputHTMLAttributes<HTMLInputElement> {
  inLineExtra?: ReactNode
  inLineLabel: string
}

const InputInLine = ({ inLineExtra, inLineLabel, ...attrs }: InputInLineProps) => {

  return (
    <div className={styles.inline__input}>
      <label className={styles.inline__input__label}>
        {inLineLabel}
      </label>

      <input
        {...attrs}
        className={styles.base__input__field}
        type={attrs.type || 'text'}
        autoComplete='off'
        autoFocus={attrs.autoFocus || false}
      />

      {inLineExtra && (
        <span className={styles.inline__input__extra}>
          {inLineExtra}
        </span>
      )}
    </div>
  );
};

export default InputInLine;
