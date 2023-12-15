import { FlexColumn } from "components";
import { ReactComponent as CircleCheck } from "assets/icon/SmallCircleCheck.svg";
import { ReactComponent as AlertIcon } from "assets/icon/Alert.svg";
import styles from "./SummaryHeader.module.scss";

export interface SummaryHeaderProps {
  statusLabel: string;
  statusMessage: string;
  status?: "alert" | "success" | "warning";
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
  let statusColor = "var(--token-error-500)"
  if (status === "success") {
    statusColor = "var(--token-success-500)"
  } else if (status === "warning") {
    statusColor = "var(--token-warning-500)"
  }


  return (
    <FlexColumn className={styles.summary__header} gap={24}>
      <FlexColumn className={styles.summary__main} gap={16}>
        {status === "alert" || status === "warning" ? (
          <AlertIcon fill={statusColor} />
        ) : (
          <CircleCheck fill="var(--token-success-500)" />
        )}
        <FlexColumn className={styles.summary__main__text} gap={8}>
          <h1 className={styles.title}>{statusLabel}</h1>
          <h6 className={styles.description}>{statusMessage}</h6>
        </FlexColumn>
      </FlexColumn>
      {summaryTitle && summaryValue && (
        <FlexColumn className={styles.summary__card} gap={16} align="flex-start">
          <h3 className={styles.summary__card__title}>{summaryTitle}</h3>
          <p className={styles.summary__card__value}>{summaryValue}</p>
        </FlexColumn>
      )}
    </FlexColumn>
  );
};

export default SummaryHeader;
