import { useTranslation } from "react-i18next"
import { FlexColumn } from "station-ui"
import { sandbox } from "auth/scripts/env"
import { NavButton, SectionHeader } from "station-ui"
import { ReactElement } from "react"
import { useSettingsRoutes } from "./routes"
import ExtensionPage from "extension/components/ExtensionPage"
import { useNavigate, useLocation } from "react-router-dom"

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
  const location = useLocation()

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
          onClick={() => navigate(route)}
        />
      ))}
    </FlexColumn>
  )

  const SettingsMenu = () => (
    <FlexColumn gap={16}>
      {sandbox && (
        <NavButton
          {...routes.network}
          label={t(routes.network.title)}
          onClick={() => navigate(routes.network.route)}
        />
      )}
      <SectionHeader withLine />
      <SettingsGroup settings={functions} />
      <SectionHeader withLine />
      <SettingsGroup settings={settings} />
    </FlexColumn>
  )

  // const renderHeader = () =>
  //   page ? (
  //     <>
  //       <button
  //         className={styles.back}
  //         onClick={() => setPage(routes[page]?.parent ?? undefined)}
  //       >
  //         <BackIcon width={18} height={18} />
  //       </button>
  //       {routes[page].tab}
  //     </>
  //   ) : (
  //     t("Settings")
  //   )

  return (
    <ExtensionPage title={t("Settings")} fullHeight modal backButtonPath="/">
      <SettingsMenu />
    </ExtensionPage>
  )
}

export default PreferencesPage
