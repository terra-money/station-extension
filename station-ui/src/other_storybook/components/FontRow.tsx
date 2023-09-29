import classNames from 'classnames';
import styles from './ColorRow.module.scss'
import { useState } from 'react';

interface FontRowProps {
  label: string;
  subLabel?: string;
  mixinClass: string;
  mixinValues: string;
  withHeader?: boolean;
}

const FontRow = ({
  label,
  subLabel,
  mixinClass,
  mixinValues,
  withHeader=false
}: FontRowProps) => {
  const [displayToken, setDisplayToken] = useState(false);

  return (
    <div className={styles.color__row__container}>
      {withHeader && (
        <div className={styles.color__headers}>
          <div className={styles.first}>Mixin</div>
          <div className={styles.second}>Example</div>
        </div>
      )}

      <div className={styles.display__section}>
        <div className={styles.label__container}>
          <div className={styles.label}>
            {label}
          </div>
          <div className={classNames(styles.subLabel, styles.font__subLabel)}>
            {subLabel}
          </div>
        </div>
        <div className={styles.color__section}>
          <div className={classNames(styles.color__container, styles.font__container)}>
            <div className={styles.color__display__container}>
              <div
                className={classNames(styles.color__display, mixinClass, styles.font__display)}
              >
                Lorem ipsum
              </div>
            </div>
            {displayToken ? (
              <div
                className={styles.token__display__button}
                onClick={() => setDisplayToken(!displayToken)}
              >
                Hide Tokens
              </div>
            ) : (
              <div
                className={styles.token__display__button}
                onClick={() => setDisplayToken(!displayToken)}
              >
                See Tokens
              </div>
            )}
            {displayToken && (
              <div className={styles.mixin__display}>
                {mixinValues}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FontRow;
