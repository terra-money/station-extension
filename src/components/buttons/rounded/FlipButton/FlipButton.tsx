import RoundedButton from '../RoundedButton/RoundedButton';
import { ReactComponent as SwapArrows } from 'assets/icon/SwapArrows.svg';
import styles from './FlipButton.module.scss';

const FlipButton = () => {
  return (
    <RoundedButton
      className={styles.flip__button}
      color='secondary'
      size='small'
      icon={<SwapArrows fill='var(--token-light-100)' />}
    />
  );
};

export default FlipButton;