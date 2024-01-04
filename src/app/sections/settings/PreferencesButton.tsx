import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import HeaderIconButton from "app/components/HeaderIconButton";
import { forwardRef, ForwardedRef } from "react";

const PreferencesButton = forwardRef((_, ref: ForwardedRef<HTMLButtonElement>) => {
  const navigate = useNavigate();

  return (
    <HeaderIconButton onClick={() => navigate("/preferences")} ref={ref}>
      <SettingsIcon style={{ fontSize: 18, color: "var(--token-dark-900)" }} />
    </HeaderIconButton>
  );
});

export default PreferencesButton;
