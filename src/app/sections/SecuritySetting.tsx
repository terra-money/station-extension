import { NavButton } from "station-ui"
import { FlexColumn } from "components/layout"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"

interface Props {
  subPageNav: () => void
}

const SecuritySetting = (props: Props) => {
  return (
    <FlexColumn gap={16}>
      <NavButton
        icon={<LockOutlinedIcon />}
        label="Change Password"
        onClick={() => props.subPageNav()}
      />
    </FlexColumn>
  )
}

export default SecuritySetting
