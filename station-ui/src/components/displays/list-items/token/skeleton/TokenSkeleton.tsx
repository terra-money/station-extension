import classNames from "classnames/bind"
import styles from "./TokenSkeleton.module.scss"
import skeletonStyles from "scss/skeleton__animation.module.scss"

const cx = classNames.bind(styles)

const TokenSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.left}>
        <div className={cx(styles.image, skeletonStyles.animation)}></div>
        <div className={styles.token__wrapper}>
          <div className={cx(styles.top, skeletonStyles.animation)} />
          <div className={cx(styles.bottom, skeletonStyles.animation)} />
        </div>
      </div>

      <div className={styles.right}>
        <div className={cx(styles.top, skeletonStyles.animation)} />
        <div className={cx(styles.bottom, skeletonStyles.animation)} />
      </div>
    </div>
  )
}

export default TokenSkeleton
