import { FlexColumn } from 'components';
import styles from './ProposalHeader.module.scss';

export interface ProposalHeaderProps {
  title: string;
  metaText: string;
  metaImage: string;
  submittedDate: string;
}

const ProposalHeader = ({
  title,
  metaText,
  metaImage,
  submittedDate,
}: ProposalHeaderProps) => {
  return (
    <FlexColumn className={styles.proposal__header__container} gap={16} align={"flex-start"}>
      <div className={styles.meta__container}>
        <img src={metaImage} alt="Proposal Meta" />
        <h6 className={styles.meta__text}>{metaText}</h6>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <h6 className={styles.submitted__date}>Submitted {submittedDate}</h6>
    </FlexColumn>
  );
};

export default ProposalHeader;
