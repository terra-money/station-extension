import { ReactNode } from 'react';
import { ButtonInlineWrapper } from 'components';
import styles from './DataHeader.module.scss';

export interface DataHeaderProps {
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  tertiaryLabel?: string;
  tertiaryValue?: string;
  actionButtons?: ReactNode;
}

const DataHeader = ({
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  tertiaryLabel,
  tertiaryValue,
  actionButtons,
}: DataHeaderProps) => {
  return (
    <div className={styles.data__header__container}>
      <div className={styles.text__container}>
        <div className={styles.primary__container}>
          <h2 className={styles.primary__label}>{primaryLabel}</h2>
          <h1 className={styles.primary__value}>{primaryValue}</h1>
        </div>
        <div className={styles.other__info__container}>
          <div className={styles.secondary__container}>
            <h3 className={styles.other__label}>{secondaryLabel}</h3>
            <h2 className={styles.other__value}>{secondaryValue}</h2>
          </div>
          <div className={styles.tertiary__container}>
            <h3 className={styles.other__label}>{tertiaryLabel}</h3>
            <h2 className={styles.other__value}>{tertiaryValue}</h2>
          </div>
        </div>
      </div>
      <ButtonInlineWrapper>
        {actionButtons}
      </ButtonInlineWrapper>
    </div>
  );
};

export default DataHeader;
