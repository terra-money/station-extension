import { Route, Routes, useLocation } from "react-router-dom"
import { useSettingsRoutes } from "./routes"
import ExtensionPage from "extension/components/ExtensionPage"
import { useTranslation } from "react-i18next"

const PreferencesRouter = () => {
  const { routes } = useSettingsRoutes()
  const { pathname } = useLocation()
  const backPath = pathname.split("/").slice(0, -1).join("/")
  const { t } = useTranslation()

  const currentRoute = Object.values(routes).find((r) =>
    pathname.includes(r.route)
  )
  const title = currentRoute ? currentRoute.title : t("Settings")

  return (
    <ExtensionPage title={title} fullHeight modal backButtonPath={backPath}>
      <Routes>
        {Object.values(routes).map((r) => (
          <Route path={r.route} element={r.element} key={r.route} />
        ))}
      </Routes>
    </ExtensionPage>
  )
}

export default PreferencesRouter
