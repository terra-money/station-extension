import classNames from 'classnames/bind';
import { ReactComponent as AlertIcon } from 'assets/icon/Alert.svg';
import { ReactComponent as SmallCircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import styles from './Banner.module.scss';

const cx = classNames.bind(styles);

export interface BannerProps {
  title: string;
  variant: 'warning' | 'error' | 'success' | 'info';
}

const Banner = ({ title, variant }: BannerProps) => {
  return (
    <div className={cx(styles.banner, variant)}>
      {variant === 'success' ? (
        <SmallCircleCheck className={styles.alert__icon} />
      ) : (
        <AlertIcon className={styles.alert__icon} />
      )}
      <h3 className={styles.title}>{title}</h3>
    </div>
  );
};

export default Banner;
