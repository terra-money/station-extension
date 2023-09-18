import { useState } from 'react';
import classNames from 'classnames/bind';
import { ReactComponent as CircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import { ReactComponent as AlertIcon } from 'assets/icon/Alert.svg';
import styles from './TopLevelBanner.module.scss';

const cx = classNames.bind(styles);

export interface TopLevelBannerProps {
  title: string;
  variant: 'warning' | 'info';
  withRadio?: boolean;
  onRadioClick?: () => void;
}

const TopLevelBanner = ({
  title,
  variant,
  withRadio,
  onRadioClick
}: TopLevelBannerProps) => {
  const [active, setActive] = useState(false);

  const handleRadioClick = () => {
    setActive(!active);
    if (onRadioClick) {
      onRadioClick();
    }
  }

  return (
    <div className={cx(styles.banner, variant, { has__radio: withRadio })} onClick={handleRadioClick}>
      <div className={styles.left__wrapper}>
        <AlertIcon className={styles.alert__icon} />
        <h3 className={styles.title}>{title}</h3>
      </div>
      {withRadio && (
        <div className={cx(styles.checkbox__container, { active })}>
          <input type='checkbox' hidden />
          {active ? (
            <CircleCheck fill='var(--token-primary-300)' />
          ) : (
            <span className={styles.track} />
          )}
        </div>
      )}
    </div>
  );
};

export default TopLevelBanner;
