import { Route, Routes } from "react-router-dom"
import { useSettingsRoutes } from "./routes"
import PreferencesPage from "./PreferencesPage"

const PreferencesRouter = () => {
  const { routes } = useSettingsRoutes()
  return (
    <Routes>
      {Object.values(routes).map((r) => (
        <Route path={r.route} element={r.element} />
      ))}
      <Route path="/" element={<PreferencesPage />} />
    </Routes>
  )
}
export default PreferencesRouter
