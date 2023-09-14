import classNames from 'classnames/bind';
import styles from './Pill.module.scss';

const cx = classNames.bind(styles);

export interface PillProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  text: string
}

const Pill = ({ variant, text }: PillProps) => {
  return (
    <span className={cx(styles.pill, variant )}>
      {text}
    </span>
  );
};

export default Pill;
