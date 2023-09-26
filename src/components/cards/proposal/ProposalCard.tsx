import classNames from 'classnames/bind';
import { ProgressBar, ProposalHeader } from 'components';
import styles from './ProposalCard.module.scss';

const cx = classNames.bind(styles);

type ProgressBarData = {
  type: 'yes' | 'abstain' | 'no' | 'noWithVeto' | 'deposit';
  percent: string;
};

export interface ProposalCardProps {
  className?: string;
  proposal: {
    metaText: string;
    metaImage: string;
    title: string;
    submittedDate: string;
  }
  progressData: ProgressBarData[]
  threshold: number;
  progressLabelOverride?: string;
}

const ProposalCard = ({
  className,
  proposal,
  progressData,
  threshold,
  progressLabelOverride,
}: ProposalCardProps) => {
  return (
    <div className={cx(styles.proposal__card__container, className)}>
      <ProposalHeader
        metaText={proposal.metaText}
        metaImage={proposal.metaImage}
        title={proposal.title}
        submittedDate={proposal.submittedDate}
      />
      <div className={styles.progressbar__wrapper}>
        <ProgressBar
          data={progressData}
          threshold={threshold}
          isSmall
          labelOverride={progressLabelOverride}
        />
      </div>
    </div>
  );
};

export default ProposalCard;
