type Bip = 118 | 330

type LocalWallet = SingleWallet | MultisigWallet // | LegacySingleWallet// wallet with name

type Wallet = LedgerWallet | SingleWallet //| LegacyWallet
type StoredWallet =
  | InterchainStoredWallet
  | LegacyStoredWallet
  | StoredWalletLegacy
  | MultisigWallet
  | LedgerWallet
  | SeedStoredWallet

type ResultStoredWallet =
  | MultisigWallet
  | StoredWallet
  | SeedStoredWallet
  | LegacyStoredWallet
  | LedgerWallet

// interchain types
interface SingleWallet {
  words: {
    "330": string
    "118"?: string
    "60"?: string
  }
  pubkey?: {
    "330": string
    "118"?: string
    "60"?: string
  }
  name: string
  icon?: string
  lock?: boolean
}
interface LedgerWallet {
  name: string
  words: {
    "330": string
    "118"?: string
  }
  pubkey?: {
    "330": string
    "118"?: string
  }
  ledger: true
  index: number
  bluetooth: boolean
  legacy: boolean
  icon?: string
  lock?: boolean
}

interface MultisigWallet extends SingleWallet {
  multisig: true
  pubkeys: string[]
  threshold: number
}

interface InterchainStoredWallet extends SingleWallet {
  encrypted: {
    "330": string
    "118"?: string
  }
}

interface SeedStoredWallet extends SingleWallet {
  encryptedSeed: string
  encryptedMnemonic?: string
  index: number
  legacy: boolean
}

// legacy types (pre-interchain)
interface LegacySingleWallet {
  address: string
  name: string
  lock?: boolean
}

interface LegacyMultisigWallet extends LegacySingleWallet {
  multisig: true
}

interface LegacyStoredWallet extends SingleWallet {
  encrypted: string
}

interface PreconfiguredWallet extends SingleWallet {
  mnemonic: string
}

// super old legacy wallet
interface StoredWalletLegacy extends LegacySingleWallet {
  wallet: string
  icon?: string
}
