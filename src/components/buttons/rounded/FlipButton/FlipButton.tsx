import RoundedButton from '../RoundedButton/RoundedButton';
import { ReactComponent as SwapArrows } from 'assets/icon/SwapArrows.svg';
import styles from './FlipButton.module.scss';

export interface FlipButtonProps {
  onClick: () => void
}

const FlipButton = ({ onClick }: FlipButtonProps) => {
  return (
    <RoundedButton
      className={styles.flip__button}
      onClick={onClick}
      variant='secondary'
      size='small'
      icon={<SwapArrows fill='var(--token-light-100)' />}
    />
  );
};

export default FlipButton;
