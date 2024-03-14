import { useTranslation } from "react-i18next"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"
import { AssetSelectorSkeleton, FlipButton } from "@terra-money/station-ui"
import styles from "./SwapLoadingPage.module.scss"

const SwapLoadingPage = () => {
  const { t } = useTranslation()
  return (
    <ExtensionPageV2 title={t("Swap")}>
      <div className={styles.swap__loading__container}>
        <AssetSelectorSkeleton />
        <FlipButton className={styles.swapper} onClick={() => {}} />
        <AssetSelectorSkeleton />
      </div>
    </ExtensionPageV2>
  )
}

export default SwapLoadingPage
