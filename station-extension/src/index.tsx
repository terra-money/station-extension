import { StrictMode } from "react"
import { HashRouter } from "react-router-dom"
import { ReactQueryDevtools } from "react-query/devtools"
import { RecoilRoot } from "recoil"
import "tippy.js/dist/tippy.css"
import "station-ui/dist/style.css"

import "config/lang"
import { debug } from "utils/env"

import "index.scss"
import ScrollToTop from "app/ScrollToTop"
import InitNetworks from "app/InitNetworks"
import InitWallet from "app/InitWallet"
import InitTheme from "app/InitTheme"
import ElectronVersion from "app/ElectronVersion"
import App from "extension/App"
import InitChains from "app/InitChains"
import WithNodeInfo from "app/WithNodeInfo"
import InitQueryClient from "app/InitQueryClient"
import { initAnalytics } from "utils/analytics"
import { createRoot } from "react-dom/client"

const root = createRoot(document.getElementById("station")!)

initAnalytics()

root.render(
  <StrictMode>
    <RecoilRoot>
      <HashRouter>
        <ScrollToTop />
        <InitQueryClient>
          <InitNetworks>
            <WithNodeInfo>
              <InitChains>
                <InitWallet>
                  <InitTheme />
                  <ElectronVersion />
                  <App />
                </InitWallet>
              </InitChains>
            </WithNodeInfo>
          </InitNetworks>
        </InitQueryClient>
        {debug.query && <ReactQueryDevtools position="bottom-right" />}
      </HashRouter>
    </RecoilRoot>
  </StrictMode>
)
