import { StrictMode } from "react"
import { render } from "react-dom"
import { HashRouter } from "react-router-dom"
import { ReactQueryDevtools } from "react-query/devtools"
import { RecoilRoot } from "recoil"
import { getChainOptions } from "@terra-money/wallet-controller"
import { WalletProvider } from "@terra-money/wallet-provider"
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
import InitChains from "app/InitChains"
import WithNodeInfo from "app/WithNodeInfo"
import InitQueryClient from "app/InitQueryClient"
import { initSentry } from "utils/sentry/setupSentry"

const connectorOpts = { bridge: BRIDGE }
initSentry()

getChainOptions().then((chainOptions) =>
  render(
    <StrictMode>
      <RecoilRoot>
        <HashRouter>
          <ScrollToTop />
          <WalletProvider {...chainOptions} connectorOpts={connectorOpts}>
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
          </WalletProvider>
          {debug.query && <ReactQueryDevtools position="bottom-right" />}
        </HashRouter>
      </RecoilRoot>
    </StrictMode>,
    document.getElementById("station")
  )
)
