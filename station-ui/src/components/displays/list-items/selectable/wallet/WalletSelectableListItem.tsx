import classNames from "classnames/bind"
import { Flex, Grid, SettingsIcon } from "components"
import { WalletEmoji } from "components"
import Copy from "components/general/copy/Copy"
import styles from "../SelectableListItem.module.scss"
import { LedgerIcon, MultisigIcon } from "components"

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
  isLedger?: boolean
  isMultisig?: boolean
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
  isLedger,
  isMultisig,
}: WalletSelectableListItemProps) => {
  const iconFill = active
    ? "var(--token-light-white)"
    : "var(--token-light-300)"

  return (
    <div className={cx(styles.selectable__li, { active })} onClick={onClick}>
      <WalletEmoji id={emoji ?? walletName} />
      <div className={styles.selectable__details__container}>
        <div className={styles.selectable__details}>
          <Flex gap={8} start align="flex-end">
            <h2 className={styles.selectable__name}>{label}</h2>
            {isLedger && <LedgerIcon height={16} width={16} />}
            {isMultisig && <MultisigIcon height={16}  width={16} />}
          </Flex>
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
            <SettingsIcon fill={iconFill} onClick={(e) => {
              e.stopPropagation()
              settingsOnClick()
            }} />
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletSelectableListItem
