import { ReactElement } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import browser from "webextension-polyfill"
import { sandbox } from "auth/scripts/env"
import { useReplaceKeplr } from "utils/localStorage"
import { useSettingsRoutes } from "./routes"
import {
  NavButton,
  SectionHeader,
  Checkbox,
  FlexColumn,
} from "@terra-money/station-ui"
import styles from "./PreferencesPage.module.scss"

export interface SettingsPage {
  route?: string
  onClick?: () => void
  title: string
  element?: ReactElement
  value?: string
  icon?: ReactElement
  disabled?: boolean
}

const PreferencesPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { replaceKeplr, setReplaceKeplr } = useReplaceKeplr()

  const { routes, functions, settings } = useSettingsRoutes()

  const SettingsGroup = ({
    settings,
  }: {
    settings: Record<string, SettingsPage>
  }) => (
    <FlexColumn gap={8}>
      {Object.values(settings)
        .filter(({ disabled }) => !disabled)
        .map(({ title, route, onClick, ...rest }) => (
          <NavButton
            label={title}
            key={route}
            {...rest}
            onClick={route ? () => navigate(`/preferences/${route}`) : onClick}
          />
        ))}
    </FlexColumn>
  )

  return (
    <FlexColumn gap={16} justify="flex-start">
      <FlexColumn gap={8} align="flex-start">
        <Checkbox
          label={t("Set Station as default browser wallet")}
          checked={replaceKeplr}
          onClick={() => setReplaceKeplr(!replaceKeplr)}
        />
        <p className={styles.subtitle}>
          {t(
            "Activating this will prioritize station over other wallet extensions you may have installed when connecting to apps."
          )}
        </p>
      </FlexColumn>
      {sandbox && (
        <>
          <SectionHeader withLine />
          <NavButton
            {...routes.network}
            label={t(routes.network.title)}
            onClick={
              routes.network.route
                ? () => navigate(`/preferences/${routes.network.route}`)
                : routes.network.onClick
            }
          />
        </>
      )}
      <SectionHeader withLine />
      <SettingsGroup settings={functions} />
      <SectionHeader withLine />
      <SettingsGroup settings={settings} />
      <p className={styles.version}>
        {"Station Wallet v" + browser.runtime?.getManifest?.()?.version}
      </p>
    </FlexColumn>
  )
}

export default PreferencesPage
