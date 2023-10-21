import { useTranslation } from "react-i18next"
import { FlexColumn } from "station-ui"
import { sandbox } from "auth/scripts/env"
import { NavButton, SectionHeader } from "station-ui"
import { ReactElement } from "react"
import { useSettingsRoutes } from "./routes"
import { useNavigate } from "react-router-dom"

export interface SettingsPage {
  route: string
  title: string
  element: ReactElement
  value?: string
  icon?: ReactElement
}

const PreferencesPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { routes, functions, settings } = useSettingsRoutes()

  const SettingsGroup = ({
    settings,
  }: {
    settings: Record<string, SettingsPage>
  }) => (
    <FlexColumn gap={6}>
      {Object.values(settings).map(({ title, route, ...rest }) => (
        <NavButton
          label={title}
          key={route}
          {...rest}
          onClick={() => navigate(`/preferences/${route}`)}
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
          onClick={() => navigate(`/preferences/${routes.network.route}`)}
        />
      )}
      <SectionHeader withLine />
      <SettingsGroup settings={functions} />
      <SectionHeader withLine />
      <SettingsGroup settings={settings} />
    </FlexColumn>
  )
}

export default PreferencesPage
