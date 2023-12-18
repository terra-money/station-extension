import { useNetworkOptions, useNetworkState } from "data/wallet"
import SettingsSelector from "components/layout/SettingsSelector"
import {
  NavButton,
  SectionHeader,
  AddressSelectableListItem,
} from "@terra-money/station-ui"
import { FlexColumn } from "components/layout"
import AddIcon from "@mui/icons-material/Add"
import { useCustomLCDs } from "utils/localStorage"
import { useNetwork } from "data/wallet"
import { useNavigate } from "react-router-dom"

const NetworkSetting = () => {
  const [network, setNetwork] = useNetworkState()
  const networkOptions = useNetworkOptions()
  const { customLCDs } = useCustomLCDs()
  const networks = useNetwork()
  const navigate = useNavigate()

  const list = Object.entries(customLCDs ?? {})
    .map(([chainID, lcd]) => {
      const { name = "", icon = "" } = networks?.[chainID] ?? {}
      return { name, chainID, chain: { icon, label: name }, lcd }
    })
    .filter((i) => !!i.lcd)

  if (!networkOptions) return null

  return (
    <FlexColumn gap={30}>
      <SettingsSelector
        accordion
        options={networkOptions}
        value={network}
        onChange={setNetwork}
      />
      <NavButton
        icon={<AddIcon />}
        label="Add Custom LCD Endpoint"
        onClick={() => navigate("/preferences/network/lcd")}
      />
      {!!list.length && (
        <>
          <SectionHeader title="Custom LCD Endpoints" withLine />
          {list.map((i) => (
            <AddressSelectableListItem
              active
              subLabel={i.lcd ?? ""}
              chain={i.chain}
              label={i.name}
              onClick={() =>
                navigate("/preferences/network/lcd", {
                  state: { chainID: i.chainID },
                })
              }
            />
          ))}
        </>
      )}
    </FlexColumn>
  )
}

export default NetworkSetting
