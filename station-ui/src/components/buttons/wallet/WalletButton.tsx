import { ReactComponent as RightArrow } from "assets/icon/RightArrow.svg"
import styles from "./WalletButton.module.scss"

export interface WalletButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  emoji?: string
  walletName: string
  walletAddress: string
  chainIcon: string
  onClick: () => void
}

const WalletButton = ({
  emoji,
  walletName,
  walletAddress,
  chainIcon,
  onClick,
  ...rest
}: WalletButtonProps) => {
  return (
    <button {...rest} type='button' className={styles.wallet__button} onClick={onClick}>
      <div className={styles.left__side}>
        {emoji ? (
          <div className={styles.emoji}>
            <span role='img' aria-label='emoji'>
              {emoji}
            </span>
          </div>
        ) : (
          <span className={styles.big__letter}>
            {walletName.charAt(0).toUpperCase()}
          </span>
        )}
        <div className={styles.details}>
          <h3 className={styles.wallet__name}>{walletName}</h3>
          <div className={styles.wallet__address__container}>
            <img src={chainIcon} />
            <h6 className={styles.address}>{walletAddress}</h6>
          </div>
        </div>
      </div>
      <div className={styles.right__side}>
        <RightArrow fill='var(--token-light-white)' />
      </div>
    </button>
  )
}

export default WalletButton
