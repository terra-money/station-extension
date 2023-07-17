import { useDevMode, useReplaceKeplr } from "utils/localStorage"
import SettingsSelectorToggle from "components/layout/SettingsSelectorToggle"
import { FlexColumn, GasAdjustment } from "components/layout"
import { TooltipIcon } from "components/display"
import { DevModeTooltip, ReplaceKeplrTooltip } from "./DevModeTooltips"
import { FormWarning } from "components/form"

const AdvancedSettings = () => {
  const { devMode, changeDevMode } = useDevMode()
  const { replaceKeplr, toggleReplaceKeplr } = useReplaceKeplr()

  return (
    <FlexColumn gap={10}>
      <SettingsSelectorToggle
        onChange={toggleReplaceKeplr}
        extra={<TooltipIcon content={<ReplaceKeplrTooltip />} />}
        options={[
          {
            value: "replaceKeplr",
            selected: replaceKeplr,
            label: "Replace Keplr",
          },
        ]}
      />
      {replaceKeplr && (
        <FormWarning>
          To prevent collisions between Keplr and Station, please uninstall or
          disable the Keplr extension on your browser when this feature is
          enabled.
        </FormWarning>
      )}
      <SettingsSelectorToggle
        onChange={changeDevMode}
        extra={<TooltipIcon content={<DevModeTooltip />} />}
        options={[
          { value: "devMode", selected: devMode, label: "Developer Mode" },
        ]}
      />
      <GasAdjustment />
    </FlexColumn>
  )
}

export default AdvancedSettings
