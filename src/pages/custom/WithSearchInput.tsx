import { ReactNode, useState } from "react"
import { Grid } from "components/layout"
import { SearchInput } from "components/form"

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
    <Grid gap={gap ?? 20} className={className}>
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
    </Grid>
  )
}

export default WithSearchInput
