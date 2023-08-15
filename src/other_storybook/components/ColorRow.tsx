import styles from './ColorRow.module.scss'

interface ColorRowProps {
  label: string;
  subLabel?: string;
  colorToken: string;
  hslColorText: string;
  withHeader?: boolean;
}

const ColorRow = ({ label, subLabel, colorToken, hslColorText, withHeader=false }: ColorRowProps) => {

  return (
    <div className={styles.color__row__container}>
      {withHeader && (
        <div className={styles.color__headers}>
          <div className={styles.first}>Token</div>
          <div className={styles.second}>Swatches</div>
        </div>
      )}

      <div className={styles.display__section}>
        <div className={styles.label__container}>
          <div className={styles.label}>
            {label}
          </div>
          <div className={styles.subLabel}>
            {subLabel}
          </div>
        </div>
        <div className={styles.color__section}>
          <div className={styles.color__container}>
            <div className={styles.color__display__container}>
              <div
                title={colorToken}
                className={styles.color__display}
                style={{ background: `var(${colorToken})` }}
              />
            </div>
            <div className={styles.color__text__container}>
              <div
                title={hslColorText}
                className={styles.color__text}
              >
                <div>{hslColorText}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorRow;
