import { useState } from "react"
import { useNetworks } from "app/InitNetworks"
import { RadioList, RadioListItem } from "station-ui"

interface Props {
  value: string
  accordion?: boolean
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

const SettingsSelector = ({
  value: selectedOption,
  options,
  onChange,
  accordion,
}: Props) => {
  // const { deleteCustomChain } = useCustomChains()

  const [openAcc, setOpenAcc] = useState<number>()

  const { networks } = useNetworks()
  console.log("networks", Object.values(networks["mainnet"]))

  return (
    <RadioList>
      {options.map(({ value, label }, index) => (
        <RadioListItem
          key={value}
          label={label}
          checked={selectedOption === value}
          onClick={() => onChange(value)}
          {...(accordion && {
            isOpen: openAcc === index,
            setOpenAcc:
              openAcc === index
                ? () => setOpenAcc(undefined)
                : () => setOpenAcc(index),
            accContent: Object.values(networks[value]).map(
              ({ name, icon }) => ({ name, icon })
            ),
          })}
        />
      ))}
    </RadioList>
  )
}

export default SettingsSelector
