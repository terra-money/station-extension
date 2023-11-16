import classNames from "classnames/bind"
import { ReactComponent as RightArrowIcon } from "assets/icon/RightArrow.svg"
import styles from "../SelectableListItem.module.scss"

const cx = classNames.bind(styles)

export interface SelectableListItemProps {
  label: string
  subLabel: string
  disabled?: boolean
  icon: React.ReactNode
  onClick: () => void
}

const SelectableListItem = ({
  label,
  subLabel,
  icon,
  disabled,
  onClick,
}: SelectableListItemProps) => {
  return (
    <div
      className={cx(styles.selectable__li, styles.address__li, { disabled })}
      onClick={onClick}
    >
      <div className={styles.chain__icon__container}>{icon && icon}</div>
      <div className={styles.selectable__details__container}>
        <div className={styles.selectable__details}>
          <h2 className={styles.selectable__name}>{label}</h2>
          <h5 className={styles.selectable__address}>{subLabel}</h5>
        </div>

        <div>
          {!disabled && <RightArrowIcon fill="var(--token-light-white)" />}
        </div>
      </div>
    </div>
  )
}

export default SelectableListItem