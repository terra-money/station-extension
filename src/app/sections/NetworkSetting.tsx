import { useNetworkOptions, useNetworkState } from "data/wallet"
import SettingsSelector from "components/layout/SettingsSelector"
import { NavButton } from "station-ui"
import { FlexColumn } from "components/layout"
import AddIcon from "@mui/icons-material/Add"
import { useSettingsPage } from "./Preferences"

const NetworkSetting = () => {
  const [network, setNetwork] = useNetworkState()
  const networkOptions = useNetworkOptions()
  const { setPage } = useSettingsPage()

  if (!networkOptions) return null

  return (
    <FlexColumn gap={16}>
      <SettingsSelector
        accordion
        options={networkOptions}
        value={network}
        onChange={setNetwork}
      />
      <NavButton
        icon={<AddIcon />}
        label="Add Custom LCD Endpoint"
        onClick={() => setPage("lcd")}
      />
    </FlexColumn>
  )
}

export default NetworkSetting
