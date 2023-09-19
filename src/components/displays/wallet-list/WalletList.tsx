import WalletSelectableListItem from 'components/displays/list-items/selectable/wallet/WalletSelectableListItem';
import SectionHeader from 'components/headers/section/SectionHeader';
import styles from './WalletList.module.scss';

export interface WalletListProps {
  activeWallet: {
    name: string;
    address: string;
    settingsOnClick: () => void;
  };
  otherWallets: {
    name: string;
    address: string;
    onClick: () => void;
    settingsOnClick: () => void;
  }[];
}

const WalletList = ({ activeWallet, otherWallets }: WalletListProps) => {
  return (
    <div className={styles.wallet__list__container}>
      <div className={styles.active__wallet}>
        <SectionHeader
          title="Active"
          indented
          icon={<span className={styles.blue__dot} />}
          className={styles.active__header}
        />
        <WalletSelectableListItem
          label={activeWallet.name}
          subLabel={activeWallet.address}
          copyValue={activeWallet.address}
          active
          onClick={() => {}}
          settingsOnClick={activeWallet.settingsOnClick}
        />
      </div>

      <div className={styles.other__wallets}>
        <SectionHeader
          title="Other Wallets"
          indented
        />
        {otherWallets.map((wallet) => (
          <WalletSelectableListItem
            label={wallet.name}
            subLabel={wallet.address}
            copyValue={activeWallet.address}
            onClick={wallet.onClick}
            settingsOnClick={wallet.settingsOnClick}
          />
        ))}
      </div>
    </div>
  );
};

export default WalletList;
