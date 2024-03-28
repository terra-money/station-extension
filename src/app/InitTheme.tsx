import { useEffect } from "react"
import { useThemeState } from "data/settings/Theme"

const InitTheme = () => {
  const [theme, setTheme] = useThemeState()

  useEffect(() => {
    setTheme(theme)
  }, [theme]) // eslint-disable-line

  return null
}

export default InitTheme
