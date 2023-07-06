import { AccAddress } from "@terra-money/feather.js"
import extension from "extensionizer"
import decrypt from "auth/scripts/decrypt"
import { ChainID, InterchainNetwork, TerraNetwork } from "types/network"

/* network */
export const storeNetwork = (
  network: TerraNetwork,
  networks: Record<ChainID, InterchainNetwork>
) => {
  extension.storage?.local.set({ network, networks, networkName: network.name })
}

/* wallet */
export const storeWalletAddress = (wallet: {
  address: AccAddress
  addresses: Record<ChainID, AccAddress>
  name?: string
  ledger?: boolean
  pubkey?: { "330": string; "118"?: string }
  network: string
  theme: string
}) => {
  extension.storage?.local.set({
    wallet,
  })
}

export const clearWalletAddress = () => {
  extension.storage?.local.remove("wallet")
}

/* password */
export const getStoredPassword = (callback: (password: string) => void) => {
  extension.storage?.local.get(
    ["encrypted", "timestamp"],
    ({ encrypted, timestamp }: { encrypted: string; timestamp: number }) => {
      if (!(encrypted && timestamp)) return ""
      const decrypted = decrypt(encrypted, String(timestamp))
      callback(decrypted)
    }
  )
}

export const clearStoredPassword = () => {
  extension.storage?.local.set({ encrypted: null, timestamp: null })
}

/* open */
export const getOpenURL = (url = "") => {
  if (!extension.runtime) return
  if (!extension.runtime.getURL) return
  return () =>
    window.open(extension.runtime.getURL(["index.html", url].join("#")))
}
