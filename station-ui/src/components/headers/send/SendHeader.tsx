import { FlexColumn } from 'components';
import styles from './SendHeader.module.scss';

export interface SendHeaderProps {
  heading: string
  label: string
  subLabel: string
}

const SendHeader = ({ heading, label, subLabel }: SendHeaderProps) => {
  return (
    <FlexColumn className={styles.send__header__container} gap={8}>
      <h5 className={styles.heading}>{heading}</h5>
      <h1 className={styles.label}>{label}</h1>
      <h3 className={styles.subLabel}>{subLabel}</h3>
    </FlexColumn>
  );
};

export default SendHeader;
