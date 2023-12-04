import WalletSelectableListItem from "components/displays/list-items/selectable/wallet/WalletSelectableListItem"
import SectionHeader from "components/headers/section/SectionHeader"
import styles from "./WalletList.module.scss"

export interface WalletListProps {
  activeWallet?: {
    name: string
    address: string
    copyValue?: string
    settingsOnClick?: () => void
  }
  otherWallets: {
    name: string
    address: string
    copyValue?: string
    onClick: () => void
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
            copyValue={activeWallet.copyValue ?? activeWallet.address}
            subLabel={activeWallet.address}
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
              copyValue={wallet.copyValue ?? wallet.address}
              subLabel={wallet.address}
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
