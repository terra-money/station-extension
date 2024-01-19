import classNames from "classnames/bind"
import styles from "./DashboardNavButton.module.scss"

const cx = classNames.bind(styles)

export interface DashboardNavButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  label?: string
  icon?: React.ReactNode
  disabled?: boolean
  active?: boolean
  small?: boolean
  withIndicator?: boolean
}

const DashboardNavButton = ({
  label,
  icon,
  disabled,
  active,
  small,
  withIndicator,
  ...rest
}: DashboardNavButtonProps) => {
  return (
    <button
      {...rest}
      type="button"
      className={cx(styles.nav__button, { disabled, active, small })}
    >
      <div className={styles.icon__container}>
        {withIndicator && <div className={styles.indicator} />}
        {icon && icon}
      </div>
      <div className={styles.label}>{label}</div>
    </button>
  )
}

export default DashboardNavButton
