import { useCallback } from "react"
import { atom, useRecoilState, useRecoilValue } from "recoil"
import BigNumber from "bignumber.js"
import themes, { Theme } from "styles/themes/themes"
import { DefaultTheme, SettingKey } from "utils/localStorage"
import {
  //getLocalSetting,
  setLocalSetting,
} from "utils/localStorage"

export const themeNameState = atom({
  key: "themeName",
  // force dark theme
  // TODO: when we implement other themes remove this
  default: "dark", //getLocalSetting<Theme["name"]>(SettingKey.Theme),
})

export const useFindTheme = () => {
  return (name: string) => {
    const item = themes.find((theme) => theme.name === name)
    if (!item) return DefaultTheme
    return item
  }
}

export const useTheme = () => {
  const name = useRecoilValue(themeNameState)
  const find = useFindTheme()
  return find(name)
}

export const useThemeFavicon = () => {
  const { favicon } = useTheme()
  return favicon
}

export const useThemeAnimation = () => {
  const { animation } = useTheme()
  return animation
}

export const useThemeState = () => {
  const [prevName, setThemeName] = useRecoilState(themeNameState)
  const findTheme = useFindTheme()
  const prevTheme = findTheme(prevName)

  const set = useCallback(
    (nextTheme: Theme) => {
      if (prevTheme.name) document.body.classList.remove(prevTheme.name)
      if (nextTheme.name) document.body.classList.add(nextTheme.name)
      setFavicon(nextTheme.favicon)
      setThemeName(nextTheme.name)
      setLocalSetting<Theme["name"]>(SettingKey.Theme, nextTheme.name)
    },
    [prevTheme, setThemeName]
  )

  return [prevTheme, set] as const
}

/* validate */
export const validateTheme = (staked: string, theme?: Theme) => {
  const item = themes.find((item) => item.name === theme?.name)
  if (!item) return false
  return new BigNumber(staked).gte(item.unlock)
}

export const useThemeFront = () => {
  const { front } = useTheme()
  return front
}

/* favicon */
const setFavicon = (href: string) => {
  const favicon = document.getElementById("favicon") as HTMLLinkElement
  favicon.href = href
}
