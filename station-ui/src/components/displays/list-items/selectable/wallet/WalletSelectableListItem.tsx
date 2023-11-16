import classNames from "classnames/bind"
import { SettingsIcon } from "components"
import { WalletEmoji } from "components"
import Copy from "components/general/copy/Copy"
import styles from "../SelectableListItem.module.scss"

const cx = classNames.bind(styles)

export interface WalletSelectableListItemProps {
  label: string
  subLabel: string
  active?: boolean
  copyValue: string
  onClick?: () => void
  walletName: string
  emoji?: string
  settingsOnClick?: () => void
}

const WalletSelectableListItem = ({
  label,
  subLabel,
  active,
  onClick,
  emoji,
  walletName,
  copyValue,
  settingsOnClick,
}: WalletSelectableListItemProps) => {
  const iconFill = active
    ? "var(--token-light-white)"
    : "var(--token-light-300)"

  return (
    <div className={cx(styles.selectable__li, { active })} onClick={onClick}>
      <WalletEmoji id={emoji ?? walletName} />
      <div className={styles.selectable__details__container}>
        <div className={styles.selectable__details}>
          <h2 className={styles.selectable__name}>{label}</h2>
          <h5 className={styles.selectable__address}>{subLabel}</h5>
        </div>
        <div className={styles.selectable__settings}>
          <Copy
            copyText={copyValue}
            iconOnlySize={20}
            fillColor={iconFill}
            iconOnly
          />
          {settingsOnClick && (
            <SettingsIcon fill={iconFill} onClick={settingsOnClick} />
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletSelectableListItem
