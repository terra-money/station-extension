import { useTranslation } from "react-i18next"
import SettingsIcon from "@mui/icons-material/Settings"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import { Flex, Tabs } from "components/layout"
import { Popover } from "components/display"
import HeaderIconButton from "app/components/HeaderIconButton"
import PopoverNone from "app/components/PopoverNone"
import { getOpenURL } from "../storage"
import NetworkSetting from "./NetworkSetting"
import LanguageSetting from "./LanguageSetting"
import ThemeSetting from "./ThemeSetting"
import CurrencySetting from "app/sections/CurrencySetting"

const Settings = () => {
  const { t } = useTranslation()

  const tabs = [
    { key: "network", tab: t("Network"), children: <NetworkSetting /> },
    { key: "lang", tab: t("Language"), children: <LanguageSetting /> },
    { key: "theme", tab: t("Theme"), children: <ThemeSetting /> },
    { key: "currency", tab: t("Currency"), children: <CurrencySetting /> },
  ]

  const openURL = getOpenURL()
  const footer = (
    <Flex gap={4}>
      <FullscreenIcon fontSize="small" />
      {t("Expand")}
    </Flex>
  )

  return (
    <Popover
      content={
        <PopoverNone footer={openURL && { onClick: openURL, children: footer }}>
          <Tabs tabs={tabs} type="line" state />
        </PopoverNone>
      }
      placement="bottom-end"
      theme="none"
    >
      <HeaderIconButton>
        <SettingsIcon style={{ fontSize: 18 }} />
      </HeaderIconButton>
    </Popover>
  )
}

export default Settings
