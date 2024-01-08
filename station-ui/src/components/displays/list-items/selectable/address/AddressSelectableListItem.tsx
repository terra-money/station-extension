import classNames from "classnames/bind"
import { RightArrowIcon } from "assets"
import Pill from "components/general/pill/Pill"
import styles from "../SelectableListItem.module.scss"

const cx = classNames.bind(styles)

export interface AddressSelectableListItemProps {
  label: string
  subLabel: string
  active?: boolean
  chain?: { icon: string, label: string }
  onClick: () => void
}

const AddressSelectableListItem = ({
  label,
  subLabel,
  active,
  chain,
  onClick,
}: AddressSelectableListItemProps) => {
  return (
    <div className={cx(
      styles.selectable__li,
      styles.address__li,
      { active, [styles.with__pill]: active }
    )} onClick={onClick}>
      {chain && (
        <div className={styles.chain__icon__container}>
          <img
            src={chain.icon}
            alt={chain.label}
            className={styles.chain__icon}
          />
        </div>
      )}
      <div className={styles.selectable__details__container}>
        <div className={styles.selectable__details}>
          <h2 className={styles.selectable__name}>
            {label}
            {active && <Pill text="Active" variant="primary" />}
          </h2>
          <h5 className={styles.selectable__address}>
            {subLabel}
          </h5>
        </div>

        <RightArrowIcon fill="var(--token-light-white)" />
      </div>
    </div>
  )
}

export default AddressSelectableListItem
