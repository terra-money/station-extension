import { useNavigate } from "react-router-dom"
import SettingsIcon from "@mui/icons-material/Settings"
import HeaderIconButton from "app/components/HeaderIconButton"

export default function PreferencesButton() {
  const navigate = useNavigate()
  return (
    <HeaderIconButton onClick={() => navigate("/preferences")}>
      <SettingsIcon style={{ fontSize: 18 }} />
    </HeaderIconButton>
  )
}
