import is from "./is"
import { decrypt, encrypt } from "./aes"
import { addressFromWords } from "utils/bech32"

enum LocalStorage {
  CONNECTED_WALLET_NAME = "connectedWallet",
  ENCRYPTED_WALLETS = "encryptedWallets",
}

enum SessionStorage {
  WALLETS = "wallets",
}

/* wallet */

// used to determine if it's needed to show the login screen
export const isLoginNeeded = () => {
  const wallets = sessionStorage.getItem(SessionStorage.WALLETS)
  const encryptedWallets = localStorage.getItem(LocalStorage.ENCRYPTED_WALLETS)
  return !!encryptedWallets && !wallets
}

// used to determine if the user still have to set a password
export const passwordExists = () => {
  const encryptedWallets = localStorage.getItem(LocalStorage.ENCRYPTED_WALLETS)
  return !!encryptedWallets
}

// unlocks the wallet when the user inset the password on the login screen
export const unlockWallets = (password: string) => {
  const encryptedWallets = localStorage.getItem(LocalStorage.ENCRYPTED_WALLETS)
  if (!encryptedWallets) return
  const wallets = decrypt(encryptedWallets, password)
  sessionStorage.setItem(SessionStorage.WALLETS, wallets)

  return JSON.parse(wallets) as Wallet[]
}

// checks if the given password is valid
export const isPasswordValid = (password: string) => {
  const encryptedWallets = localStorage.getItem(LocalStorage.ENCRYPTED_WALLETS)

  // if user has not set a password yet, it's valid
  if (!encryptedWallets) return true

  try {
    return !!decrypt(encryptedWallets, password)
  } catch {
    return false
  }
}

// get the active wallet (user must be logged in)
export const getWallet = () => {
  if (isLoginNeeded()) return undefined

  const wallets = sessionStorage.getItem(SessionStorage.WALLETS)
  const walletName = localStorage.getItem(LocalStorage.CONNECTED_WALLET_NAME)

  if (!wallets || !walletName) return
  const parsed = JSON.parse(wallets)

  return parsed.find((wallet: Wallet) => wallet.name === walletName)
}

// set one of the avaiulable wallets as active
export const connectWallet = (name: string) => {
  localStorage.setItem(LocalStorage.CONNECTED_WALLET_NAME, name)
}

// disconnect the active wallet
export const disconnectWallet = () => {
  localStorage.removeItem(LocalStorage.CONNECTED_WALLET_NAME)
}

/* stored wallets */
export const getStoredWallets = () => {
  const wallets = sessionStorage.getItem(SessionStorage.WALLETS)
  if (!wallets) return []
  return JSON.parse(wallets) as ResultStoredWallet[]
}

export const storeWallets = (wallets: StoredWallet[], password: string) => {
  if (!isPasswordValid(password)) throw new Error("Invalid password")

  const walletsString = JSON.stringify(wallets)
  sessionStorage.setItem(SessionStorage.WALLETS, walletsString)
  localStorage.setItem(
    LocalStorage.ENCRYPTED_WALLETS,
    encrypt(walletsString, password)
  )
}

/* stored wallet */
export const getStoredWallet = (name: string): ResultStoredWallet => {
  const wallets = getStoredWallets()
  const wallet = wallets.find((wallet) => wallet.name === name)
  if (!wallet) throw new Error("Wallet does not exist")
  return wallet
}

export const storeConnectedWallet = (name: string) => {
  localStorage.setItem(LocalStorage.CONNECTED_WALLET_NAME, name)
}

interface Params {
  name: string
  password: string
}

type Key =
  | {
      "330": string
      "118"?: string
      "60"?: string
    }
  | { seed: string; index: number; legacy: boolean }

export const getDecryptedKey = ({
  name,
  password,
}: Params): Key | undefined => {
  const wallet = getStoredWallet(name)

  try {
    if ("encrypted" in wallet) {
      if (typeof wallet.encrypted === "string") {
        return {
          "330": decrypt(wallet.encrypted, password),
        }
      } else {
        return {
          "330": decrypt(wallet.encrypted["330"], password),
          // 118 is not available for old wallets
          "118":
            wallet.encrypted["118"] &&
            decrypt(wallet.encrypted["118"], password),
        }
      }
    } else if ("wallet" in wallet) {
      // legacy
      const { privateKey: key } = JSON.parse(decrypt(wallet.wallet, password))
      return { "330": key as string }
    } else if ("encryptedSeed" in wallet) {
      return {
        seed: decrypt(wallet.encryptedSeed, password),
        index: wallet.index,
        legacy: wallet.legacy,
      }
    }
  } catch {
    throw new PasswordError("Incorrect password")
  }
}

export class PasswordError extends Error {}
export const testPassword = (params: Params) => {
  if (!getDecryptedKey(params)) throw new PasswordError("Incorrect password")
  return true
}

type AddWalletParams =
  | {
      words: { "330": string; "118"?: string; "60"?: string }
      seed: Buffer
      name: string
      index: number
      legacy: boolean
      pubkey: { "330": string; "118"?: string; "60"?: string }
    }
  | {
      words: { "330": string; "118"?: string }
      key: { "330": Buffer }
      name: string
      pubkey?: { "330": string; "118"?: string }
    }
  | LedgerWallet
  | MultisigWallet

export const addWallet = (params: AddWalletParams, password: string) => {
  const wallets = getStoredWallets()

  if (wallets.find((wallet) => wallet.name === params.name))
    throw new Error("Wallet already exists")

  const next = wallets.filter((wallet) =>
    "words" in wallet
      ? wallet.words["330"] !== params.words["330"]
      : wallet.address !== addressFromWords(params.words["330"])
  )

  if (is.multisig(params) || is.ledger(params)) {
    storeWallets([...next, params], password)
  } else {
    if ("seed" in params) {
      const { name, words, seed, pubkey, index, legacy } = params
      const encryptedSeed = encrypt(seed.toString("hex"), password)
      storeWallets(
        [...next, { name, words, encryptedSeed, pubkey, index, legacy }],
        password
      )
    } else {
      const { name, words, key, pubkey } = params
      const encrypted = { "330": encrypt(key["330"].toString("hex"), password) }
      storeWallets([...next, { name, words, encrypted, pubkey }], password)
    }
  }
}

interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
}

export const changePassword = (params: ChangePasswordParams) => {
  const { oldPassword, newPassword } = params
  if (!isPasswordValid(oldPassword)) throw new Error("Invalid password")

  const wallets = getStoredWallets()
  if (!wallets) throw new Error("Key does not exist, cannot change password")
  const result = wallets.map((key) => {
    if ("encryptedSeed" in key) {
      const encryptedSeed = encrypt(
        decrypt(key.encryptedSeed, oldPassword),
        newPassword
      )

      return {
        ...key,
        encryptedSeed,
      }
    } else if ("encrypted" in key) {
      const encrypted = {
        "330": encrypt(decrypt(key.encrypted["330"], oldPassword), newPassword),
        "118":
          key.encrypted["118"] &&
          encrypt(decrypt(key.encrypted["118"], oldPassword), newPassword),
      }

      return {
        ...key,
        encrypted,
      }
    }

    // re-encryption of provate keys is not needed for multisig and ledger wallets since we are not storing the private keys
    return key
  })

  storeWallets(result, newPassword)
}

export const deleteWallet = (name: string, password: string) => {
  const wallets = getStoredWallets()
  const next = wallets.filter((wallet) => wallet.name !== name)
  storeWallets(next, password)
}

export const lockWallet = () => {
  sessionStorage.removeItem(SessionStorage.WALLETS)
}
