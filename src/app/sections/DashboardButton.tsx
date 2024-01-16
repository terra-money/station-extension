import { ForwardedRef, forwardRef } from "react"
import { DashboardIcon } from "@terra-money/station-ui"
import HeaderIconButton from "app/components/HeaderIconButton"
import { STATION } from "config/constants"

const DashboardButton = forwardRef(
  (_, ref: ForwardedRef<HTMLButtonElement>) => {
    const openDashboard = () => window.open(STATION, "_blank")
    return (
      <HeaderIconButton onClick={openDashboard} ref={ref}>
        <DashboardIcon
          style={{ height: 18, width: 18, fill: "var(--token-dark-900)" }}
        />
      </HeaderIconButton>
    )
  }
)

export default DashboardButton
