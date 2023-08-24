import { PropsWithChildren } from 'react';
import classNames from 'classnames/bind';
import { Grid } from 'components/layout';

import styles from './MultiInputWrapper.module.scss';

const cx = classNames.bind(styles);

export interface MultiInputWrapperProps {
  label: React.ReactNode
  layout: 'horizontal' | 'vertical'
  error?: string
  warning?: string
}

const MultiInputWrapper = (
  {label, layout, error, warning, children }:
  PropsWithChildren<MultiInputWrapperProps>
) => {

  return (
    <Grid gap={8} className={cx({ warning, error })}>
      <header className={styles.header}>
        {label && <label className={styles.label}>{label}</label>}
      </header>

      <div className={styles[layout]}>
        {children}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {warning && !error && <p className={styles.warning}>{warning}</p>}
    </Grid>
  );
};

export default MultiInputWrapper;
