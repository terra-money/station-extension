import { ReactComponent as RightArrow } from 'assets/icon/RightArrow.svg';
import styles from './NavButton.module.scss';

export interface NavButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string
  value?: string
  icon?: React.ReactNode
}

const NavButton = ({ label, value, icon, ...rest }: NavButtonProps) => {
  return (
    <button {...rest} type='button' className={styles.nav__button}>
      <div className={styles.left__side}>
        {icon && icon}
        <div className={styles.label}>{label}</div>
      </div>
      <div className={styles.right__side}>
        <div className={styles.sub__label}>{value}</div>
        <RightArrow fill='var(--token-light-white)' />
      </div>
    </button>
  );
};

export default NavButton;
