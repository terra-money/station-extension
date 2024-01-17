import { SettingsIcon } from "@terra-money/station-ui"
import { useNavigate } from "react-router-dom"

const SettingsButton = () => {
  const navigate = useNavigate()

  return (
    <button>
      <SettingsIcon
        width={18}
        height={18}
        onClick={() => navigate("/preferences")}
        fill={"var(--token-dark-900)"}
      />
    </button>
  )
}

export default SettingsButton
