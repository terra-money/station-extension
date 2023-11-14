import { useNavigate } from "react-router-dom"
import SettingsIcon from "@mui/icons-material/Settings"

export default function PreferencesButton() {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate("/preferences")}>
      <SettingsIcon
        style={{ color: "var(--token-dark-900)", width: 20, height: 20 }}
      />
    </button>
  )
}
