import { useTranslation } from "react-i18next"
import ExtensionPage from "extension/components/ExtensionPage"
import Address from "./Address"
import Chain from "./Chain"
import Token from "./Token"
import Submit from "./Submit"
import Confirm from "./Confirm"
import SendContext from "./SendContext"
import { Routes, Route, useLocation } from "react-router-dom"

const SendTx = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const getBackPath = (pathname: string) => {
    if (pathname.includes("/send/")) {
      const stepMatch = pathname.match(/\/send\/(\d+)/)
      if (stepMatch?.[1]) {
        const step = Number(stepMatch[1])
        return step > 1 ? `/send/${step - 1}` : "/"
      }
    }
  }

  const routes = [
    { path: "/1", element: <Address />, title: "Address" },
    { path: "/2", element: <Chain />, title: "Chain" },
    { path: "/3", element: <Token />, title: "Token" },
    { path: "/4", element: <Submit />, title: "Submit" },
    { path: "/5", element: <Confirm />, title: "Confirm" },
  ]

  return (
    <SendContext>
      <Routes>
        {routes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={
              <ExtensionPage
                backButtonPath={getBackPath(pathname)}
                fullHeight
                title={t(r.title)}
                modal
              >
                <div style={{ display: "grid", gap: 20 }}>{r.element}</div>
              </ExtensionPage>
            }
          />
        ))}
      </Routes>
    </SendContext>
  )
}

export default SendTx
