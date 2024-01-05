import { AccAddress } from "@terra-money/feather.js"
import browser from "webextension-polyfill"
import { ChainID, InterchainNetwork, TerraNetwork } from "types/network"

/* network */
export const storeNetwork = (
  network: TerraNetwork,
  networks: Record<ChainID, InterchainNetwork>
) => {
  browser.storage?.local.set({ network, networks, networkName: network.name })
}

/* theme */
export const storeTheme = (theme: string) => {
  browser.storage?.local.set({
    theme,
  })
}

/* wallet */
export const storeWalletAddress = (wallet: {
  address: AccAddress
  addresses: Record<ChainID, AccAddress>
  name?: string
  ledger?: boolean
  pubkey?: { "330": string; "118"?: string }
  network: string
}) => {
  browser.storage?.local.set({
    wallet,
  })
}

export const clearWalletAddress = () => {
  browser.storage?.local.remove("wallet")
}

/* open */
export const getOpenURL = (url = "") => {
  // test environment
  if (!browser?.runtime?.getURL) return () => (window.location.href = `#${url}`)

  // extension environment, open url in new tab
  return () =>
    window.open(browser.runtime.getURL(["index.html", url].join("#")))
}

export const openURL = (url = "", params?: Record<string, string>) => {
  const urlParams = params ? "?" + new URLSearchParams(params).toString() : ""
  getOpenURL(url + urlParams)()
}
