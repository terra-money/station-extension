import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import classNames from 'classnames/bind';
import styles from './Checkbox.module.scss';

const cx = classNames.bind(styles);

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const Checkbox = forwardRef(
  (
    { className, label, ...attrs }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const { checked, disabled } = attrs;
    return (
      <label className={cx(styles.checkbox, { checked, disabled }, className)}>
        <input {...attrs} type='checkbox' hidden ref={ref} />
        <span className={styles.track}>
          <span className={styles.indicator} />
        </span>
        <span className={styles.text}>{label}</span>
      </label>
    );
  },
);

export default Checkbox;
