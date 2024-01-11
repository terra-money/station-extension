import WalletSelectableListItem from "components/displays/list-items/selectable/wallet/WalletSelectableListItem"
import SectionHeader from "components/headers/section/SectionHeader"
import { truncate } from "utils/format"
import styles from "./WalletList.module.scss"

interface Wallet { 
  name: string
  address: string
  settingsOnClick?: () => void
  isLedger?: boolean
  isMultisig?: boolean
  onClick?: () => void
}

export interface WalletListProps {
  activeWallet?: Wallet
  otherWallets: Wallet[]
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
            walletName={activeWallet.name}
            copyValue={activeWallet.address}
            subLabel={truncate(activeWallet.address)}
            active
            isLedger={activeWallet.isLedger}
            isMultisig={activeWallet.isMultisig}
            settingsOnClick={activeWallet.settingsOnClick}
            onClick={activeWallet.onClick}
          />
        </div>
      )}

      {!!otherWallets.length && (
        <div className={styles.other__wallets}>
          {activeWallet && <SectionHeader title="Other Wallets" indented />}
          {otherWallets.map((wallet, i) => (
            <WalletSelectableListItem
              label={wallet.name}
              walletName={wallet.name}
              copyValue={wallet.address}
              subLabel={truncate(wallet.address)}
              onClick={wallet.onClick}
              isLedger={wallet.isLedger}
              isMultisig={wallet.isMultisig}
              settingsOnClick={wallet.settingsOnClick}
              key={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WalletList
