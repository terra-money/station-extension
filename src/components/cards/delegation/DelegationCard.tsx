import { ReactNode } from 'react';
import classNames from 'classnames/bind';
import { ReactComponent as RightArrowIcon } from 'assets/icon/RightArrow.svg';
import styles from './DelegationCard.module.scss';

const cx = classNames.bind(styles);

export interface DelegationCardProps {
  className?: string;
  validator: { name: string; img: string; description: string };
  onClick: () => void;
  children?: ReactNode;
}

const DelegationCard = ({
  validator,
  onClick,
  className,
  children,
}: DelegationCardProps) => {
  return (
    <div className={cx(styles.card__container, className)} onClick={onClick}>
      <div className={styles.validator}>
        <div className={styles.top__row}>
          <div className={styles.title__wrapper}>
            <img src={validator.img} alt={validator.name} />
            <h3>{validator.name}</h3>
          </div>
          <RightArrowIcon fill="var(--token-light-white)" />
        </div>
        <p className={styles.description}>{validator.description}</p>
      </div>
      {children}
    </div>
  );
};

export default DelegationCard;
