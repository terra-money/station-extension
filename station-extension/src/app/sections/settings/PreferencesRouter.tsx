import { Route, Routes, useLocation } from "react-router-dom"
import { useSettingsRoutes } from "./routes"
import ExtensionPage from "extension/components/ExtensionPage"
import ConfirmDelete from "txs/AddressBook/ConfirmDelete"
import ExtensionPageV2 from 'extension/components/ExtensionPageV2'

const PreferencesRouter = () => {
  const { routes } = useSettingsRoutes()
  const { pathname } = useLocation()
  const backPath = pathname.split("/").slice(0, -1).join("/")

  return (
    <Routes>
      {Object.values(routes).map((r) => (
        <Route
          path={r.route}
          element={
            <ExtensionPageV2
              title={r.title}
              fullHeight
              backButtonPath={backPath}
            >
              {r.element}
            </ExtensionPageV2>
          }
          key={r.route}
        />
      ))}
      <Route element={<ConfirmDelete />} path="address-book/delete" />
    </Routes>
  )
}

export default PreferencesRouter
