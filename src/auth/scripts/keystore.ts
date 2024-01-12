import is from "./is"
import { decrypt, encrypt } from "./aes"
import { addressFromWords } from "utils/bech32"
import browser from "webextension-polyfill"

enum LocalStorage {
  CONNECTED_WALLET_NAME = "connectedWallet",
  WALLETS = "wallets",
  LEGACY_WALLETS = "keys",
  PASSWORD_CHALLENGE = "passwordChallenge",
  SHOULD_STORE_PASS = "storePassword",
  IS_MIGRATION_DONE = "isMigrationDone",
}

const CHALLENGE_TEXT = "STATION_PASSWORD_CHALLENGE"

/* helper functions */
const getSessionItems = async (
  args: string[]
): Promise<Record<string, string | null>> => {
  if (browser.storage?.session) {
    return await browser.storage?.session.get(args)
  } else {
    return Object.fromEntries(
      args.map((arg) => {
        return [arg, sessionStorage.getItem(arg)]
      })
    )
  }
}

const setSessionItems = (args: Record<string, string | null>) => {
  if (browser.storage?.session) {
    browser.storage?.session.set(args)
  } else {
    Object.entries(args).forEach(([key, value]) => {
      if (value) sessionStorage.setItem(key, value)
      else sessionStorage.removeItem(key)
    })
  }
}

/* password */
const PASSWORD_ITERATIONS = 100

export const shouldStorePassword = () => {
  const storePassword = localStorage.getItem(LocalStorage.SHOULD_STORE_PASS)
  return storePassword !== "false"
}

export const setShouldStorePassword = (value: boolean) => {
  if (!value) clearStoredPassword()

  localStorage.setItem(LocalStorage.SHOULD_STORE_PASS, String(value))
}

export const getStoredPassword = async () => {
  if (!shouldStorePassword()) {
    clearStoredPassword()
    return
  }

  const { encrypted, timestamp } = await getSessionItems([
    "encrypted",
    "timestamp",
  ])
  if (!(encrypted && timestamp)) return
  const password = decrypt(encrypted, String(timestamp), PASSWORD_ITERATIONS)

  return password
}

export const storePassword = async (password: string) => {
  if (!shouldStorePassword()) return
  // make sure the password is valid
  if (!isPasswordValid(password)) return

  const timestamp = String(Date.now())

  setSessionItems({
    encrypted: encrypt(password, timestamp, PASSWORD_ITERATIONS),
    timestamp,
  })
}

export const clearStoredPassword = () => {
  setSessionItems({ encrypted: null, timestamp: null })
}

export const isLoggedIn = async (): Promise<boolean> => {
  const { loggedIn } = await getSessionItems(["loggedIn"])

  return loggedIn === "true"
}

export const setLogin = (value: boolean) => {
  setSessionItems({ loggedIn: String(value) })
}

/* wallet */
// used to determine if it's needed to show the login screen
export const isLoginNeeded = async () => {
  const wallets = localStorage.getItem(LocalStorage.WALLETS)
  if (!wallets) return false

  if (shouldStorePassword()) {
    return !(await isLoggedIn()) && !(await getStoredPassword())
  } else {
    return !(await isLoggedIn())
  }
}

// used to determine if the user still have to set a password
export const passwordExists = () => {
  const passwordChallenge = localStorage.getItem(
    LocalStorage.PASSWORD_CHALLENGE
  )
  return !!passwordChallenge
}

// checks if the given password is valid
export const isPasswordValid = (password: string) => {
  const passwordChallenge = localStorage.getItem(
    LocalStorage.PASSWORD_CHALLENGE
  )

  // [RECOVERY]: if password challenge has not been set
  if (!passwordChallenge) {
    const walletChallenge = getStoredWallets()
      .map((w) => {
        if ("encryptedSeed" in w) {
          return w.encryptedSeed
        } else if ("encrypted" in w) {
          return w.encrypted[330]
        }
      })
      .filter((w): w is string => !!w)

    if (!walletChallenge.length) return false

    try {
      const isValid = !!decrypt(walletChallenge[0], password)
      if (isValid) storePasswordChallenge(password)
      return isValid
    } catch {
      return false
    }
  }

  try {
    return decrypt(passwordChallenge, password) === CHALLENGE_TEXT
  } catch {
    return false
  }
}

// get the active wallet
export const getWallet = (name?: string) => {
  //if (isLoginNeeded()) return undefined

  const wallets = localStorage.getItem(LocalStorage.WALLETS)
  const walletName =
    name ?? localStorage.getItem(LocalStorage.CONNECTED_WALLET_NAME)

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
  const wallets = localStorage.getItem(LocalStorage.WALLETS)
  if (!wallets) return []
  return JSON.parse(wallets) as ResultStoredWallet[]
}

export const getStoredLegacyWallets = () => {
  const wallets = localStorage.getItem(LocalStorage.LEGACY_WALLETS)
  if (!wallets) return []
  return JSON.parse(wallets).filter(
    (w: any) => !w.ledger || w.pubkey
  ) as ResultStoredWallet[]
}

export const isMigrationCompleted = () => {
  const isMigrationDone = localStorage.getItem(LocalStorage.IS_MIGRATION_DONE)
  return isMigrationDone === "true"
}

export const setMigrationCompleted = () => {
  localStorage.setItem(LocalStorage.IS_MIGRATION_DONE, "true")
}

export const storeWallets = (wallets: StoredWallet[]) => {
  const walletsString = JSON.stringify(wallets)
  localStorage.setItem(LocalStorage.WALLETS, walletsString)
}

/* stored wallet */
export const getStoredWallet = (name: string): ResultStoredWallet => {
  const wallets = getStoredWallets()
  const wallet = wallets.find((wallet) => wallet.name === name)
  if (!wallet) throw new Error("Wallet does not exist")
  return wallet
}

export const createNewPassword = (password: string) => {
  if (passwordExists()) throw new Error("Password already exists")

  storePasswordChallenge(password)
}

const storePasswordChallenge = (password: string) => {
  localStorage.setItem(
    LocalStorage.PASSWORD_CHALLENGE,
    encrypt(CHALLENGE_TEXT, password)
  )
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
    throw new Error("Incorrect password")
  }
}

type AddWalletParams =
  | {
      words: { "330": string; "118"?: string; "60"?: string }
      seed: Buffer
      mnemonic?: string
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
  if (passwordExists() && !isPasswordValid(password))
    throw new Error("Invalid password")
  const wallets = getStoredWallets()

  if (wallets.find((wallet) => wallet.name === params.name))
    throw new Error("Wallet already exists")

  const next = wallets.filter((wallet) =>
    "words" in wallet
      ? wallet.words["330"] !== params.words["330"]
      : wallet.address !== addressFromWords(params.words["330"])
  )

  if (!passwordExists()) storePasswordChallenge(password)

  if (is.multisig(params) || is.ledger(params)) {
    storeWallets([...next, params])
  } else {
    if ("seed" in params) {
      const { name, words, seed, pubkey, index, legacy, mnemonic } = params
      const encryptedSeed = encrypt(seed.toString("hex"), password)
      const encryptedMnemonic = mnemonic && encrypt(mnemonic, password)
      storeWallets([
        ...next,
        {
          name,
          words,
          encryptedSeed,
          pubkey,
          index,
          legacy,
          encryptedMnemonic,
        },
      ])
    } else {
      const { name, words, key, pubkey } = params
      const encrypted = { "330": encrypt(key["330"].toString("hex"), password) }
      storeWallets([...next, { name, words, encrypted, pubkey }])
    }
  }
}

export const addLedgerWallet = (params: LedgerWallet) => {
  const wallets = getStoredWallets()

  if (wallets.find((wallet) => wallet.name === params.name))
    throw new Error("Wallet already exists")

  const next = wallets.filter((wallet) =>
    "words" in wallet
      ? wallet.words["330"] !== params.words["330"]
      : wallet.address !== addressFromWords(params.words["330"])
  )

  storeWallets([...next, params])
}

export const addMultisigWallet = (params: MultisigWallet) => {
  const wallets = getStoredWallets()

  if (wallets.find((wallet) => wallet.name === params.name))
    throw new Error("Wallet already exists")

  const next = wallets.filter((wallet) =>
    "words" in wallet
      ? wallet.words["330"] !== params.words["330"]
      : wallet.address !== addressFromWords(params.words["330"])
  )

  storeWallets([...next, params])
}

interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
}

export const changePassword = (params: ChangePasswordParams) => {
  const { oldPassword, newPassword } = params
  if (!isPasswordValid(oldPassword)) throw new Error("Invalid password")

  const wallets = getStoredWallets()
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

  storePasswordChallenge(newPassword)
  // remove the currently stored password
  clearStoredPassword()
  storeWallets(result)
}

export const deleteWallet = (name: string) => {
  const wallets = getStoredWallets()
  const next = wallets.filter((wallet) => wallet.name !== name)
  storeWallets(next)
}

export const lockWallet = () => {
  clearStoredPassword()
  setLogin(false)
}
