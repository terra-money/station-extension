import { NavButton } from "station-ui"
import { FlexColumn } from "components/layout"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { useSettingsPage } from "./Preferences"

const SecuritySetting = () => {
  const { setPage } = useSettingsPage()
  return (
    <FlexColumn gap={16}>
      <NavButton
        icon={<LockOutlinedIcon />}
        label="Change Password"
        onClick={() => setPage("changePassword")}
      />
    </FlexColumn>
  )
}

export default SecuritySetting
