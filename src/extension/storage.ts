import { AccAddress } from "@terra-money/feather.js"
import browser from "webextension-polyfill"
import decrypt from "auth/scripts/decrypt"
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

/* replace keplr */
export const storeReplaceKeplr = (replaceKeplr: boolean) => {
  browser.storage?.local.set({
    replaceKeplr,
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

/* password */
export const getStoredPassword = (callback: (password: string) => void) => {
  browser.storage?.local
    .get(["encrypted", "timestamp"])
    .then(({ encrypted, timestamp }) => {
      if (!(encrypted && timestamp)) return ""
      const decrypted = decrypt(encrypted, String(timestamp))
      callback(decrypted)
    })
}

export const clearStoredPassword = () => {
  browser.storage?.local.set({ encrypted: null, timestamp: null })
}

/* open */
export const getOpenURL = (url = "") => {
  if (!browser.runtime) return
  if (!browser.runtime.getURL) return
  return () =>
    window.open(browser.runtime.getURL(["index.html", url].join("#")))
}
