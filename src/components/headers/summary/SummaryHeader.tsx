import { FlexColumn } from 'components';
import { ReactComponent as CircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import { ReactComponent as AlertIcon } from 'assets/icon/Alert.svg';
import styles from './SummaryHeader.module.scss';

export interface SummaryHeaderProps {
  statusLabel: string;
  statusMessage: string;
  status?: 'alert' | 'success';
  summaryTitle?: string;
  summaryValue?: string;
}

const SummaryHeader = ({
  statusLabel,
  statusMessage,
  status,
  summaryTitle,
  summaryValue,
}: SummaryHeaderProps) => {
  return (
    <FlexColumn className={styles.summary__header} gap={24}>
      <FlexColumn className={styles.summary__main} gap={16}>
        {status === 'alert' ? (
          <AlertIcon fill="var(--token-error-500)" />
        ) : (
          <CircleCheck fill="var(--token-success-500)" />
        )}
        <FlexColumn className={styles.summary__main__text} gap={8}>
          <h1 className={styles.title}>{statusLabel}</h1>
          <h6 className={styles.description}>{statusMessage}</h6>
        </FlexColumn>
      </FlexColumn>
      {summaryTitle && summaryValue && (
        <FlexColumn className={styles.summary__card} gap={16} align='flex-start'>
          <h3 className={styles.summary__card__title}>{summaryTitle}</h3>
          <p className={styles.summary__card__value}>{summaryValue}</p>
        </FlexColumn>
      )}
    </FlexColumn>
  );
};

export default SummaryHeader;
