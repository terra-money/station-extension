import { useNavigate } from "react-router-dom"
import SettingsIcon from "@mui/icons-material/Settings"

export default function PreferencesButton() {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate("/preferences")}>
      <SettingsIcon />
    </button>
  )
}
