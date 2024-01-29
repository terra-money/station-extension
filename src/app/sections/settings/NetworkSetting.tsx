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
    <FlexColumn gap={30} data-testid="network-settings">
      <SettingsSelector
        accordion
        options={networkOptions}
        value={network}
        onChange={setNetwork}
        data-testid="network-options-selector"
      />
      <NavButton
        icon={<AddIcon />}
        label="Add Custom LCD Endpoint"
        onClick={() => navigate("/preferences/network/lcd")}
        data-testid="add-custom-lcd-button"
      />
      {!!list.length && (
        <>
          <SectionHeader
            title="Custom LCD Endpoints"
            withLine
            data-testid="custom-lcd-section-header"
          />
          {list.map((i, index) => (
            <AddressSelectableListItem
              key={index}
              active
              subLabel={i.lcd ?? ""}
              chain={i.chain}
              label={i.name}
              onClick={() =>
                navigate("/preferences/network/lcd", {
                  state: { chainID: i.chainID },
                })
              }
              data-testid={`address-selectable-list-item-${index}`}
              data-debug="true"
            />
          ))}
        </>
      )}
    </FlexColumn>
  )
}

export default NetworkSetting
