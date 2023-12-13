import { AssetSelectorSkeleton, FlipButton } from "@terra-money/station-ui"
import styles from "./SwapLoadingPage.module.scss"

const SwapLoadingPage = () => {
  return (
    <div className={styles.swap__loading__container}>
      <AssetSelectorSkeleton />
      <FlipButton className={styles.swapper} onClick={() => {}} />
      <AssetSelectorSkeleton />
    </div>
  )
}

export default SwapLoadingPage
