import { useEffect } from "react"
import { DefaultTheme } from "utils/localStorage"
import { useThemeState, useValidateTheme } from "data/settings/Theme"

const InitTheme = () => {
  const [theme, setTheme] = useThemeState()
  const validate = useValidateTheme()
  const valid = validate(theme)

  useEffect(() => {
    setTheme(valid ? theme : DefaultTheme)
  }, [valid]) // eslint-disable-line

  return null
}

export default InitTheme
