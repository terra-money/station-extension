import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter } from "react-router-dom"
import { ReactQueryDevtools } from "react-query/devtools"
import { RecoilRoot } from "recoil"
import { getChainOptions, WalletProvider } from "@terra-rebels/wallet-provider"
import "tippy.js/dist/tippy.css"

import "config/lang"
import { BRIDGE } from "config/constants"
import { debug } from "utils/env"

import "index.scss"
import ScrollToTop from "app/ScrollToTop"
import InitNetworks from "app/InitNetworks"
import InitWallet from "app/InitWallet"
import InitTheme from "app/InitTheme"
import ElectronVersion from "app/ElectronVersion"
import App from "extension/App"

const connectorOpts = { bridge: BRIDGE }

const root = createRoot(document.getElementById("station") as HTMLElement)

getChainOptions().then((chainOptions) =>
  root.render(
    <StrictMode>
      <RecoilRoot>
        <HashRouter>
          <ScrollToTop />
          <WalletProvider {...chainOptions} connectorOpts={connectorOpts}>
            <InitNetworks>
              <InitWallet>
                <InitTheme />
                <ElectronVersion />
                <App />
              </InitWallet>
            </InitNetworks>
          </WalletProvider>
          {debug.query && <ReactQueryDevtools position="bottom-right" />}
        </HashRouter>
      </RecoilRoot>
    </StrictMode>
  )
)
