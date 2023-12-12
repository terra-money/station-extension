import { ReactComponent as RightArrow } from "assets/icon/RightArrow.svg"
import styles from "./WalletButton.module.scss"
import { WalletEmoji } from "components"
import classNames from "classnames"
export interface WalletButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  emoji?: string
  walletName: string
  walletAddress: string
  chainIcon?: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

const cx = classNames.bind(styles)

const WalletButton = ({
  emoji,
  walletName,
  walletAddress,
  chainIcon,
  onClick,
  variant = 'primary',
  ...rest
}: WalletButtonProps) => {
  return (
    <button {...rest} type='button' className={cx(styles.wallet__button, { [styles.secondary]: variant === 'secondary'})} onClick={onClick}>
      <div className={styles.left__side}>
        <WalletEmoji id={emoji ?? walletName} />
        <div className={styles.details}>
          <h3 className={styles.wallet__name}>{walletName}</h3>
          <div className={styles.wallet__address__container}>
            {chainIcon && <img src={chainIcon} /> }
            <h6 className={styles.address}>{walletAddress}</h6>
          </div>
        </div>
      </div>
      <div className={styles.right__side}>
        <RightArrow fill={variant === 'secondary' ? 'var(--token-light-white)' : 'var(--token-light-white)'} />
      </div>
    </button>
  )
}

export default WalletButton
