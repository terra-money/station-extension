import WalletSelectableListItem from "components/displays/list-items/selectable/wallet/WalletSelectableListItem"
import SectionHeader from "components/headers/section/SectionHeader"
import styles from "./WalletList.module.scss"
export interface WalletListProps {
  activeWallet?: {
    name: string
    address: string
    subLabel: string
    settingsOnClick?: () => void
  }
  otherWallets: {
    name: string
    address: string
    onClick: () => void
    subLabel: string
    settingsOnClick?: () => void
  }[]
}

const WalletList = ({ activeWallet, otherWallets }: WalletListProps) => {
  return (
    <div className={styles.wallet__list__container}>
      {activeWallet && (
        <div className={styles.active__wallet}>
          <SectionHeader
            title="Active"
            indented
            icon={<span className={styles.blue__dot} />}
            className={styles.active__header}
          />
          <WalletSelectableListItem
            label={activeWallet.name}
            walletName="Big Money"
            copyValue={activeWallet.address}
            subLabel={activeWallet.subLabel}
            active
            onClick={() => {}}
            settingsOnClick={activeWallet.settingsOnClick}
          />
        </div>
      )}

      {!!otherWallets.length && (
        <div className={styles.other__wallets}>
          {activeWallet && <SectionHeader title="Other Wallets" indented />}
          {otherWallets.map((wallet) => (
            <WalletSelectableListItem
              label={wallet.name}
              walletName="Money"
              copyValue={wallet.address}
              subLabel={wallet.subLabel}
              onClick={wallet.onClick}
              settingsOnClick={wallet.settingsOnClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WalletList
