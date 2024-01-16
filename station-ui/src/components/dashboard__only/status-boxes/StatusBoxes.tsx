import classNames from "classnames/bind"
import { ClaimableAssetsSVG, StakedAssetsSVG, TotalAssetsSVG } from "assets"
import styles from "./StatusBoxes.module.scss"

const cx = classNames.bind(styles)

export interface StatusBoxesProps {
  totalAssets: number
  stackedAssets: number
  claimableRewards: number
  isVertical?: boolean
}

const StatusBoxes = ({
  totalAssets,
  stackedAssets,
  claimableRewards,
  isVertical,
}: StatusBoxesProps) => {
  return (
    <div className={cx(styles.boxes__container, { [styles.vertical]: isVertical })}>
      <div className={styles.box}>
        <div className={styles.text__container}>
          <div className={styles.title}>Total Assets</div>
          <div className={styles.amount}>${totalAssets}</div>
        </div>
        <TotalAssetsSVG className={styles.backdrop} />
      </div>

      <div className={styles.box}>
        <div className={styles.text__container}>
          <div className={styles.title}>Staked Assets</div>
          <div className={styles.amount}>${stackedAssets}</div>
        </div>
        <StakedAssetsSVG className={styles.backdrop} />
      </div>

      <div className={styles.box}>
        <div className={styles.text__container}>
          <div className={styles.title}>Claimable Rewards</div>
          <div className={cx(styles.amount, { [styles.positive]: claimableRewards > 0 })}>
            ${claimableRewards}
          </div>
        </div>
        <ClaimableAssetsSVG className={styles.backdrop} />
      </div>
    </div>
  )
}

export default StatusBoxes
