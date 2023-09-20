import { useNetworkOptions, useNetworkState } from "data/wallet"
import SettingsSelector from "components/layout/SettingsSelector"
import { NavButton, SectionHeader, AddressSelectableListItem } from "station-ui"
import { FlexColumn } from "components/layout"
import AddIcon from "@mui/icons-material/Add"
import { useCustomLCDs } from "utils/localStorage"
import { useNetwork } from "data/wallet"
import { useState } from "react"
import LCDSetting from "./LCDSetting"

const NetworkSetting = () => {
  const [network, setNetwork] = useNetworkState()
  const networkOptions = useNetworkOptions()
  const { customLCDs } = useCustomLCDs()
  const networks = useNetwork()
  const [open, setOpen] = useState(false)
  const [chain, setChain] = useState<string | undefined>()

  const list = Object.keys(customLCDs ?? {}).map((chainID) => {
    const { name, icon } = networks[chainID]
    return {
      name,
      chainID,
      chain: { icon, label: name },
      lcd: customLCDs[chainID]!,
    }
  })

  if (!networkOptions) return null

  return open ? (
    <LCDSetting selectedChainID={chain} />
  ) : (
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
        onClick={() => setOpen(true)}
      />
      {!!list.length && (
        <>
          <SectionHeader title="Custom LCD Endpoints" withLine />
          {list.map((i) => (
            <AddressSelectableListItem
              active
              subLabel={i.lcd}
              chain={i.chain}
              label={i.name}
              onClick={() => {
                setChain(i.chainID)
                setOpen(true)
              }}
            />
          ))}
        </>
      )}
    </FlexColumn>
  )
}

export default NetworkSetting
