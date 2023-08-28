import { InputHTMLAttributes, ReactNode } from 'react';
import styles from './InputInLine.module.scss';

// const cx = classNames.bind(styles);

export interface InputInLineProps extends InputHTMLAttributes<HTMLInputElement> {
  extra?: ReactNode
  label: string
}

const InputInLine = ({ extra, label, ...attrs }: InputInLineProps) => {

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
      />

      {extra && (
        <span className={styles.inline__input__extra}>
          {extra}
        </span>
      )}
    </div>
  );
};

export default InputInLine;
