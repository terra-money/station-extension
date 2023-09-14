import { PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames/bind';
import { Grid } from 'components/layout';
import styles from './InputWrapper.module.scss';

const cx = classNames.bind(styles);

export interface InputWrapperProps {
  label?: ReactNode
  extra?: ReactNode
  error?: string
  warning?: string
}

// Replaces FormItem
export const InputWrapper = (props: PropsWithChildren<InputWrapperProps>) => {
  const { label, extra, error, warning, children } = props;

  return (
    <Grid gap={8} className={cx(styles.input__wrapper, { warning, error })}>
      <header className={styles.header}>
        {label && <label className={styles.label}>{label}</label>}
        <aside className={styles.extra}>{extra}</aside>
      </header>

      {children}

      {error && <p className={styles.error}>{error}</p>}
      {warning && !error && <p className={styles.warning}>{warning}</p>}
    </Grid>
  );
};
