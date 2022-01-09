import { StrictMode } from "react"
import { render } from "react-dom"
import { HashRouter } from "react-router-dom"
import { ReactQueryDevtools } from "react-query/devtools"
import { RecoilRoot } from "recoil"
import { getChainOptions, WalletProvider } from "@terra-money/wallet-provider"
import "tippy.js/dist/tippy.css"

import "config/lang"
import { BRIDGE } from "config/constants"
import { debug } from "utils/env"

import "index.scss"
import { convert, NetworksProvider } from "app/NetworksProvider"
import ScrollToTop from "app/ScrollToTop"
import InitWallet from "app/InitWallet"
import InitTheme from "app/InitTheme"
import App from "extension/App"

const connectorOpts = { bridge: BRIDGE }

getChainOptions().then((chainOptions) =>
  render(
    <StrictMode>
      <RecoilRoot>
        <HashRouter>
          <ScrollToTop />
          <NetworksProvider value={convert(chainOptions)}>
            <WalletProvider {...chainOptions} connectorOpts={connectorOpts}>
              <InitWallet>
                <InitTheme />
                <App />
              </InitWallet>
            </WalletProvider>
          </NetworksProvider>
          {debug.query && <ReactQueryDevtools position="bottom-right" />}
        </HashRouter>
      </RecoilRoot>
    </StrictMode>,
    document.getElementById("station")
  )
)
