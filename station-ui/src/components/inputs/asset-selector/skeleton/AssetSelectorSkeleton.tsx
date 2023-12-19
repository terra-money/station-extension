import classNames from "classnames/bind"
import { WalletIcon } from "assets"
import styles from "./AssetSelectorSkeleton.module.scss"
import skeletonStyles from "scss/skeleton__animation.module.scss"

const cx = classNames.bind(styles)

const AssetSelectorSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.header}>
        <WalletIcon width={12} height={12} fill="var(--token-dark-900)" />
        <div className={cx(styles.wallet__amount, skeletonStyles.animation)} />
      </div>

      <div className={styles.inputs}>
        <div className={styles.token__selector}>
          <div className={cx(styles.image, skeletonStyles.animation)}></div>
          <div className={styles.token__wrapper}>
            <div className={cx(styles.symbol, skeletonStyles.animation)} />
            <div className={cx(styles.chain__wrapper, skeletonStyles.animation)} />
          </div>
        </div>

        <div className={styles.amounts__wrapper}>
          <div className={cx(styles.input__amount, skeletonStyles.animation)} />
          <div className={cx(styles.amount__currency, skeletonStyles.animation)} />
        </div>
      </div>
    </div>
  )
}

export default AssetSelectorSkeleton
