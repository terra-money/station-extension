import { useState } from "react"
import { useNetworks } from "app/InitNetworks"
import { RadioList, RadioListItem } from "@terra-money/station-ui"

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
  const [openAcc, setOpenAcc] = useState<number>()
  const { networks } = useNetworks()

  return (
    <RadioList>
      {options.map(({ value, label }, index) => (
        <RadioListItem
          key={value}
          label={label}
          checked={value === selectedOption}
          onClick={() => onChange(value)}
          {...(accordion && {
            isOpen: openAcc === index,
            setOpenAcc: () => setOpenAcc(openAcc === index ? undefined : index),
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
