import { Checkbox } from "@terra-money/station-ui"
import { useTokenFilters } from "utils/localStorage"
import { useTranslation } from "react-i18next"
import styles from "./TokenFilters.module.scss"

const TokenFilters = () => {
  const { onlyShowWhitelist, toggleOnlyShowWhitelist } = useTokenFilters()
  const { t } = useTranslation()

  return (
    <div className={styles.whitelisted__checkbox}>
      <Checkbox
        label={t("Only show whitelisted tokens")}
        onChange={toggleOnlyShowWhitelist}
        checked={onlyShowWhitelist}
        indent
      />
    </div>
  )
}

export default TokenFilters
