import classNames from 'classnames/bind';
import RoundedButton from '../RoundedButton/RoundedButton';
import { ReactComponent as SwapArrows } from 'assets/icon/SwapArrows.svg';
import styles from './FlipButton.module.scss';

const cx = classNames.bind(styles);

export interface FlipButtonProps {
  className?: string
  onClick: () => void
}

const FlipButton = ({ onClick, className }: FlipButtonProps) => {
  return (
    <RoundedButton
      className={cx(styles.flip__button, className)}
      onClick={onClick}
      variant='secondary'
      size='small'
      icon={<SwapArrows fill='var(--token-light-100)' width={16} height={16} />}
    />
  );
};

export default FlipButton;
