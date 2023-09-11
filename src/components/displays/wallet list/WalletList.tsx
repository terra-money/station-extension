import WalletSelectableListItem from 'components/displays/list items/selectable/wallet/WalletSelectableListItem';
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
        <h6 className={styles.active__title}><span />Active</h6>
        <WalletSelectableListItem
          label={activeWallet.name}
          subLabel={activeWallet.address}
          active
          onClick={() => {}}
          settingsOnClick={activeWallet.settingsOnClick}
        />
      </div>

      <div className={styles.other__wallets}>
        <h6 className={styles.other__title}>Other Wallets</h6>
        {otherWallets.map((wallet) => (
          <WalletSelectableListItem
            label={wallet.name}
            subLabel={wallet.address}
            onClick={wallet.onClick}
            settingsOnClick={wallet.settingsOnClick}
          />
        ))}
      </div>
    </div>
  );
};

export default WalletList;
