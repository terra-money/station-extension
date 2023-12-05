import { useTranslation } from "react-i18next"
import { FlexColumn } from "@terra-money/station-ui"
import { sandbox } from "auth/scripts/env"
import { NavButton, SectionHeader } from "@terra-money/station-ui"
import { ReactElement } from "react"
import { useSettingsRoutes } from "./routes"
import { useNavigate } from "react-router-dom"

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
    </FlexColumn>
  )
}

export default PreferencesPage
