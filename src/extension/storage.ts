import { AccAddress } from "@terra-rebels/terra.js"
import extension from "extensionizer"
import decrypt from "auth/scripts/decrypt"

/* network */
export const storeNetwork = (network: TerraNetwork) => {
  extension.storage?.local.set({ network })
}

/* wallet */
export const storeWalletAddress = (address: AccAddress) => {
  extension.storage?.local.set({ wallet: { address } })
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
