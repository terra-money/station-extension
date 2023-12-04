import { NavButton } from "@terra-money/station-ui"
import { FlexColumn } from "components/layout"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { useNavigate } from "react-router-dom"

const SecuritySetting = () => {
  const navigate = useNavigate()
  return (
    <FlexColumn gap={16}>
      <NavButton
        icon={<LockOutlinedIcon />}
        label="Change Password"
        onClick={() => navigate(`/preferences/security/change-password`)}
      />
    </FlexColumn>
  )
}

export default SecuritySetting
