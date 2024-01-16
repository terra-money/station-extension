import { WalletIcon } from "assets"
import styles from "./WalletNavButton.module.scss"


export interface WalletNavButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  walletName: string
}

const WalletNavButton = ({
  walletName,
  ...rest
}: WalletNavButtonProps) => {
  return (
    <button
      {...rest}
      type="button"
      className={styles.nav__button}
    >
      <div className={styles.icon__container}>
        <WalletIcon fill="var(--token-dark-900)" width={16} height={16} />
        <div className={styles.label}>{walletName}</div>
      </div>
      <div className={styles.indicator} />
    </button>
  )
}

export default WalletNavButton
