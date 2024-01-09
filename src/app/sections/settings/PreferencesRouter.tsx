import { Route, Routes, useLocation } from "react-router-dom"
import { useSettingsRoutes } from "./routes"
import ExtensionPage from "extension/components/ExtensionPage"
import ConfirmDelete from "txs/AddressBook/ConfirmDelete"

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
            <ExtensionPage
              title={r.title}
              fullHeight
              modal
              backButtonPath={backPath}
            >
              {r.element}
            </ExtensionPage>
          }
          key={r.route}
        />
      ))}
      <Route element={<ConfirmDelete />} path="address-book/delete" />
    </Routes>
  )
}

export default PreferencesRouter
