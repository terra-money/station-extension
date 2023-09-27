
import { ReactNode } from 'react';
import classNames from 'classnames/bind';
import { ReactComponent as CircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import { ReactComponent as Alert } from 'assets/icon/Alert.svg';
import { ReactComponent as LoadingIcon } from 'assets/icon/Loading.svg';
import Pill from 'components/general/pill/Pill';
import styles from './ActivityListItem.module.scss';

const cx = classNames.bind(styles);

export interface ActivityListItemProps {
  variant: 'success' | 'failed' | 'loading'
  chain: { icon: string, label: string }
  msg: ReactNode
  type: string
  time: string
  timelineMessages?: ReactNode[]
}

const ActivityListItem = ({
  variant,
  chain,
  msg,
  type,
  time,
  timelineMessages,
}: ActivityListItemProps) => {

  let statusIcon = <LoadingIcon fill='var(--token-warning-500)' />;

  if (variant === 'success') {
    statusIcon = <CircleCheck fill='var(--token-success-500)' />;
  } else if (variant === 'failed') {
    statusIcon = <Alert fill='var(--token-error-500)' />;
  }

  return (
    <div className={styles.activity__li__container}>
      <div className={cx(styles.activity__li, { has__timeline: timelineMessages?.length })}>
        <div className={styles.activity__icon__container}>
          {timelineMessages?.length && <span className={styles.dashed__line} />}
          <img
            src={chain.icon}
            alt={chain.label}
            className={styles.activity__icon}
          />
          <span className={styles.status__icon}>
            {statusIcon}
          </span>
        </div>
        <div className={styles.activity__details__container}>
          <Pill
            variant={variant === 'failed' ? 'danger' : 'secondary'}
            text={type}
          />
          <h3 className={styles.activity__msg}>
            {msg}
          </h3>
          <h6 className={styles.activity__time}>
            {time}
          </h6>
        </div>
      </div>
      {timelineMessages && timelineMessages?.length > 0 && (
        <div className={styles.timeline}>
          {timelineMessages?.map((timelineMsg, index) => (
            <div key={index} className={styles.timeline__line}>
              <div className={styles.icon__container}>
                <div className={styles.check__icon}>
                  <CircleCheck fill='var(--token-dark-900)' />
                </div>
                {timelineMessages.length - 1 !== index && <span className={styles.dashed__line} />}
              </div>
              <div className={styles.timeline__msg}>
                {timelineMsg}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityListItem;
