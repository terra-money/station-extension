import { Checkbox } from "@terra-money/station-ui"
import { useTokenFilters } from "utils/localStorage"
import { useTranslation } from "react-i18next"

const TokenFilters = () => {
  const { onlyShowWhitelist, toggleOnlyShowWhitelist } = useTokenFilters()
  const { t } = useTranslation()

  return (
    <Checkbox
      label={t("Only show whitelisted tokens")}
      onChange={toggleOnlyShowWhitelist}
      checked={onlyShowWhitelist}
    />
  )
}

export default TokenFilters
