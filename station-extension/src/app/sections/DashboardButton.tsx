import { ReactComponent as Dashboard } from "styles/images/icons/Dashboard.svg"
import HeaderIconButton from "app/components/HeaderIconButton"
import { STATION } from "config/constants"

export default function DashboardButton() {
  const openDashboard = () => {
    window.open(STATION, "_blank")
  }
  return (
    <HeaderIconButton onClick={openDashboard}>
      <Dashboard style={{ height: 18, color: "var(--token-dark-900)" }} />
    </HeaderIconButton>
  )
}
