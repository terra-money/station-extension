import { ReactNode, useState } from "react"
import { SearchInput } from "components/form"
import { FlexColumn } from "@terra-money/station-ui"

interface Props {
  gap?: number
  placeholder?: string
  inline?: boolean
  padding?: boolean
  small?: boolean
  disabled?: boolean
  extra?: ReactNode
  children: (input: string) => ReactNode
  className?: string
  label?: string
  defaultInput?: string
}

const WithSearchInput = ({
  gap,
  children,
  placeholder,
  padding,
  small,
  inline,
  extra,
  defaultInput,
  className,
  label,
}: Props) => {
  const [input, setInput] = useState(defaultInput ?? "")

  return (
    <FlexColumn gap={gap ?? 24} className={className} justify="flex-start">
      <SearchInput
        label={label}
        value={input}
        small={small}
        inline={inline}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        extra={extra}
        padding={padding}
      />
      {children(input)}
    </FlexColumn>
  )
}

export default WithSearchInput
