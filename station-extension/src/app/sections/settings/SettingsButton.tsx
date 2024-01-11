import { SettingsIcon } from "@terra-money/station-ui"
import { useNavigate } from "react-router-dom"

const SettingsButton = () => {
  const navigate = useNavigate()

  return (
    <SettingsIcon
      width={18}
      height={18}
      onClick={() => navigate("/preferences")}
      style={{
        cursor: "pointer",
        //marginTop: "24px",
        //marginBottom: "16px",
      }}
      fill={"var(--token-dark-900)"}
    />
  )
}

export default SettingsButton
