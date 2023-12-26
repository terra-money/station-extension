import { AssetSelectorSkeleton, FlipButton } from "@terra-money/station-ui"
import styles from "./SwapLoadingPage.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import { useTranslation } from "react-i18next"

const SwapLoadingPage = () => {
  const { t } = useTranslation()
  return (
    <ExtensionPage title={t("Swap")} modal>
      <div className={styles.swap__loading__container}>
        <AssetSelectorSkeleton />
        <FlipButton className={styles.swapper} onClick={() => {}} />
        <AssetSelectorSkeleton />
      </div>
    </ExtensionPage>
  )
}

export default SwapLoadingPage
