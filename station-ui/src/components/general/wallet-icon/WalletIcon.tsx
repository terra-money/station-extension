import styles from "./WalletIcon.module.scss"

export interface WalletIconProps {
  id: string // walletName or an emoji
}

const WalletIcon = ({
    id,
}: WalletIconProps) => {
    const emoji = id.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g)
  return (
      emoji ? (
          <div className={styles.emoji}>
            <span role='img' aria-label='emoji'>
              {id}
            </span>
          </div>
        ) : (
          <span className={styles.big__letter}>
            {id.charAt(0).toUpperCase()}
          </span>
        )
  )
}

export default WalletIcon
