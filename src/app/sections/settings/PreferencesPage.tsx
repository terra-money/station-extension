import { useTranslation } from "react-i18next"
import { Checkbox, FlexColumn, Grid } from "@terra-money/station-ui"
import { sandbox } from "auth/scripts/env"
import { NavButton, SectionHeader } from "@terra-money/station-ui"
import { ReactElement } from "react"
import { useSettingsRoutes } from "./routes"
import { useNavigate } from "react-router-dom"
import styles from "./PreferencesPage.module.scss"
import { useReplaceKeplr } from "utils/localStorage"
import browser from "webextension-polyfill"

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
    <FlexColumn gap={6}>
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
    <FlexColumn gap={16}>
      {sandbox && (
        <NavButton
          {...routes.network}
          label={t(routes.network.title)}
          onClick={
            routes.network.route
              ? () => navigate(`/preferences/${routes.network.route}`)
              : routes.network.onClick
          }
        />
      )}
      <SectionHeader withLine />
      <SettingsGroup settings={functions} />
      <SectionHeader withLine />
      <SettingsGroup settings={settings} />
      <SectionHeader withLine />
      <Grid gap={8}>
        <Checkbox
          label={t("Set Station as default browser wallet")}
          checked={replaceKeplr}
          onClick={() => setReplaceKeplr(!replaceKeplr)}
        />
        <p className={styles.subtitle}>
          {t(
            "Activating this will prioritize station over other wallet extensions when connecting to apps."
          )}
        </p>
      </Grid>
      <p className={styles.version}>
        {"Station Wallet v" + browser.runtime?.getManifest?.()?.version}
      </p>
    </FlexColumn>
  )
}

export default PreferencesPage
