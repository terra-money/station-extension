import { ReactComponent as RightArrow } from 'assets/icon/RightArrow.svg';
import styles from './NavButton.module.scss';

export interface NavButtonProps {
  label: string
  subLabel?: string
  icon?: React.ReactNode
}

const NavButton = ({ label, subLabel, icon }: NavButtonProps) => {
  return (
    <button type='button' className={styles.nav__button}>
      <div className={styles.left__side}>
        {icon && icon}
        <div className={styles.label}>{label}</div>
      </div>
      <div className={styles.right__side}>
        <div className={styles.sub__label}>{subLabel}</div>
        <RightArrow fill='var(--token-light-white)' />
      </div>
    </button>
  );
};

export default NavButton;
