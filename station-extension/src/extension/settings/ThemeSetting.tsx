import { capitalize } from "@mui/material"
import themes from "styles/themes/themes"
import { useFindTheme, useThemeState } from "data/settings/Theme"
import { RadioGroup } from "components/form"

const ThemeSetting = () => {
  const [theme, setTheme] = useThemeState()
  const find = useFindTheme()

  return (
    <RadioGroup
      options={themes.map(({ name }) => {
        return { value: name, label: capitalize(name) }
      })}
      value={theme.name}
      onChange={(name) => setTheme(find(name))}
    />
  )
}

export default ThemeSetting
