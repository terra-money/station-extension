import { ReactComponent as RightArrow } from "assets/icon/RightArrow.svg"
import styles from "./NavButton.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

export interface NavButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  label: string
  value?: string
  icon?: React.ReactNode
  disabled?: boolean
}

const NavButton = ({
  label,
  value,
  icon,
  disabled,
  ...rest
}: NavButtonProps) => {
  return (
    <button
      {...rest}
      type="button"
      className={cx(styles.nav__button, { disabled })}
    >
      <div className={styles.left__side}>
        {icon && icon}
        <div className={styles.label}>{label}</div>
      </div>
      <div className={styles.right__side}>
        <div className={styles.sub__label}>{value}</div>
        {!disabled && <RightArrow fill="var(--token-light-white)" />}
      </div>
    </button>
  )
}

export default NavButton
