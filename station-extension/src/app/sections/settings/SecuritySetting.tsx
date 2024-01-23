import { useNavigate } from "react-router-dom"
import { NavButton, FlexColumn, LockIcon } from "@terra-money/station-ui"

const SecuritySetting = () => {
  const navigate = useNavigate()
  return (
    <FlexColumn gap={16} justify="flex-start">
      <NavButton
        icon={
          <LockIcon width={14} height={14} fill={"var(--token-light-white)"} />
        }
        label="Change Password"
        onClick={() => navigate(`/preferences/security/change-password`)}
      />
    </FlexColumn>
  )
}

export default SecuritySetting
