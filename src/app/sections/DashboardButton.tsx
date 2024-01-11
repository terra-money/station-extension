import { DashboardIcon, Tooltip } from "@terra-money/station-ui"
import { useTranslation } from "react-i18next"
import { STATION } from "config/constants"

const DashboardButton = () => {
  const openDashboard = () => window.open(STATION, "_blank")
  const { t } = useTranslation()

  return (
    <Tooltip
      content={t("Dashboard")}
      children={
        <DashboardIcon
          width={18}
          height={18}
          onClick={openDashboard}
          style={{
            cursor: "pointer",
            //margin: "24px 12px 16px 16px",
          }}
          fill={"var(--token-dark-900)"}
        />
      }
    />
  )
}

export default DashboardButton
