import { Checkbox } from "station-ui"
import { useTokenFilters } from "utils/localStorage"
import { useTranslation } from "react-i18next"

const TokenFilters = () => {
  const { hideNoWhitelist, toggleHideNoWhitelist } = useTokenFilters()
  const { t } = useTranslation()

  return (
    <Checkbox
      label={t("Hide non-whitelisted")}
      onChange={toggleHideNoWhitelist}
      checked={hideNoWhitelist}
    />
  )
}

export default TokenFilters
