import { useNetworkOptions, useNetworkState } from "data/wallet"
import { RadioGroup } from "components/form"

const NetworkSetting = () => {
  const [network, setNetwork] = useNetworkState()
  const networkOptions = useNetworkOptions()

  if (!networkOptions) return null

  return (
    <>
      <RadioGroup
        options={networkOptions}
        value={network}
        onChange={setNetwork}
      />

      {/*list.length ? (
        <InternalLink to="/networks" chevron>
          {t("Manage networks")}
        </InternalLink>
      ) : (
        <InternalLink to="/network/new" chevron>
          {t("Add a network")}
        </InternalLink>
      )*/}
    </>
  )
}

export default NetworkSetting
