import { useCallback, useEffect, useMemo } from "react"
import { atom, useRecoilState } from "recoil"
import { encode } from "js-base64"
import {
  CreateTxOptions,
  Tx,
  isTxError,
  SeedKey,
} from "@terra-money/feather.js"
import { AccAddress, SignDoc } from "@terra-money/feather.js"
import { RawKey, SignatureV2 } from "@terra-money/feather.js"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import is from "../scripts/is"
import {
  disconnectWallet,
  isPasswordValid,
  connectWallet,
  addLedgerWallet,
} from "../scripts/keystore"
import { getDecryptedKey } from "../scripts/keystore"
import { getWallet, lockWallet } from "../scripts/keystore"
import { getStoredWallet, getStoredWallets } from "../scripts/keystore"
import legacyEncrypt from "../scripts/encrypt"
import { encrypt } from "../scripts/aes"
import useAvailable from "./useAvailable"
import { addressFromWords } from "utils/bech32"
import { useNetwork } from "./useNetwork"
import { useLedgerKey } from "utils/ledger"
import { useLogin } from "extension/modules/Login"

export const walletState = atom({
  key: "interchain-wallet",
  default: getWallet(),
})

const useAuth = () => {
  const lcd = useInterchainLCDClient()
  const networks = useNetwork()
  const available = useAvailable()
  const { isLoggedIn } = useLogin()

  const [wallet, setWallet] = useRecoilState(walletState)

  useEffect(() => {
    if (!isLoggedIn) {
      setWallet(undefined)
    } else if (!wallet) {
      setWallet(getWallet())
    }
  }, [isLoggedIn]) // eslint-disable-line

  const wallets = getStoredWallets()
  const getLedger = useLedgerKey()

  /* connect */
  const connect = (name: string) => {
    const storedWallet = getStoredWallet(name)
    setWallet(storedWallet)
    connectWallet(name)
  }

  const connectLedger = (
    words: { "330": string; "118"?: string },
    pubkey: { "330": string; "118"?: string },
    index = 0,
    bluetooth = false,
    name = "Ledger",
    legacy: boolean
  ) => {
    const wallet = {
      words,
      pubkey,
      ledger: true as const,
      index,
      bluetooth,
      lock: false as const,
      name,
      legacy,
    }
    addLedgerWallet(wallet)
    connectWallet(name)
    setWallet(wallet)
  }

  /* connected */
  const connectedWallet = useMemo(() => {
    if (!is.local(wallet)) return
    return wallet
  }, [wallet])

  const getConnectedWallet = useCallback(() => {
    if (!connectedWallet) throw new Error("Wallet is not defined")
    return connectedWallet
  }, [connectedWallet])

  /* disconnected */
  const disconnect = () => {
    disconnectWallet()
    setWallet(undefined)
  }

  const lock = () => {
    lockWallet()
  }

  /* helpers */
  const getKey = (password: string) => {
    const { name } = getConnectedWallet()
    return getDecryptedKey({ name, password })
  }

  const getLedgerKey = async (coinType: string) => {
    if (!is.ledger(wallet)) throw new Error("Ledger device is not connected")
    const { index, bluetooth, legacy } = wallet

    const ct = legacy && coinType === "330" ? "118" : coinType

    return getLedger({
      bluetooth,
      index,
      coinType: Number(ct),
    })
  }

  /* manage: export */
  // TODO: export both 119 and 330 key
  const encodeEncryptedWallet = (walletName: string, password: string) => {
    const { words } = getWallet(walletName)
    const key = getDecryptedKey({ name: walletName, password })
    if (!key) throw new Error("Key do not exist")
    if ("seed" in key) {
      const seed = new SeedKey({
        seed: Buffer.from(key.seed, "hex"),
        coinType: key.legacy ? 118 : 330,
        index: key.index || 0,
      })

      const data = {
        name: walletName,
        address: seed.accAddress("terra"),
        // needed to import into old versions of station
        encrypted_key: legacyEncrypt(seed.privateKey.toString("hex"), password),
        // import into new versions
        seed: encrypt(
          // encode in base64 to use less chars
          Buffer.from(key.seed, "hex").toString("base64"),
          password
        ),
        index: key.index,
        legacy: key.legacy,
      }
      return encode(JSON.stringify(data))
    }

    const data = {
      name: walletName,
      address: addressFromWords(words["330"], "terra"),
      encrypted_key: legacyEncrypt(key["330"], password),
    }
    return encode(JSON.stringify(data))
  }

  /* form */
  const validatePassword = (password: string) => {
    try {
      return isPasswordValid(password) ? false : "Incorrect password"
    } catch (error) {
      return "Incorrect password"
    }
  }

  /* tx */
  const create = async (txOptions: CreateTxOptions) => {
    if (!wallet) throw new Error("Wallet is not defined")
    const { words } = wallet
    const address = addressFromWords(
      words[networks[txOptions?.chainID].coinType] ?? "",
      networks[txOptions?.chainID]?.prefix
    )

    return await lcd.tx.create([{ address }], txOptions)
  }

  const createSignature = async (
    tx: Tx,
    chainID: string,
    address: AccAddress,
    password = ""
  ) => {
    if (!wallet) throw new Error("Wallet is not defined")

    const accountInfo = await lcd.auth.accountInfo(address)
    if (!accountInfo) throw new Error("Couldn't retrieve account info")

    const doc = new SignDoc(
      chainID,
      accountInfo.getAccountNumber(),
      accountInfo.getSequenceNumber(),
      tx.auth_info,
      tx.body
    )

    if (is.ledger(wallet)) {
      const key = await getLedgerKey(networks[chainID].coinType)
      return await key.createSignatureAmino(doc)
    } else {
      const pk = getKey(password)
      if (!pk) throw new Error("Incorrect password")

      if ("seed" in pk) {
        const key = new SeedKey({
          seed: Buffer.from(pk.seed, "hex"),
          coinType:
            pk.legacy && parseInt(networks[chainID].coinType) === 330
              ? 118
              : parseInt(networks[chainID].coinType),
          index: pk.index || 0,
        })
        return await key.createSignatureAmino(doc)
      } else {
        if (!pk[networks[chainID].coinType])
          throw new Error("Incorrect password")
        const key = new RawKey(
          Buffer.from(pk[networks[chainID].coinType] ?? "", "hex")
        )
        return await key.createSignatureAmino(doc)
      }
    }
  }

  const getPubkey = async (coinType: "330" | "118", password = "") => {
    if (!wallet) throw new Error("Wallet is not defined")

    if (is.ledger(wallet)) {
      const key = await getLedgerKey(coinType)
      // @ts-expect-error
      return key.publicKey.key
    } else {
      const pk = getKey(password)
      if (!pk) throw new Error("Incorrect password")

      if ("seed" in pk) {
        const key = new SeedKey({
          seed: Buffer.from(pk.seed, "hex"),
          coinType: pk.legacy ? 118 : parseInt(coinType),
          index: pk.index || 0,
        })
        // @ts-expect-error
        return key.publicKey.key
      } else {
        if (!pk[coinType]) throw new Error("Incorrect password")
        const key = new RawKey(Buffer.from(pk[coinType] ?? "", "hex"))
        // @ts-expect-error
        return key.publicKey.key
      }
    }
  }

  const sign = async (
    txOptions: CreateTxOptions,
    password = "",
    signMode?: SignatureV2.SignMode
  ) => {
    if (!wallet) throw new Error("Wallet is not defined")

    if (is.ledger(wallet)) {
      const key = await getLedgerKey(networks[txOptions?.chainID].coinType)
      const wallet = lcd.wallet(key)
      return await wallet.createAndSignTx({
        ...txOptions,
        signMode: SignatureV2.SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
      })
    } else {
      const pk = getKey(password)
      if (!pk) throw new Error("Incorrect password")

      if ("seed" in pk) {
        const key = new SeedKey({
          seed: Buffer.from(pk.seed, "hex"),
          coinType:
            pk.legacy && parseInt(networks[txOptions?.chainID].coinType) === 330
              ? 118
              : parseInt(networks[txOptions?.chainID].coinType),
          index: pk.index || 0,
        })
        const w = lcd.wallet(key)
        return await w.createAndSignTx({ ...txOptions, signMode })
      } else {
        if (!pk[networks[txOptions?.chainID].coinType])
          throw new Error("Incorrect password")
        const key = new RawKey(
          Buffer.from(pk[networks[txOptions?.chainID].coinType] ?? "", "hex")
        )
        const w = lcd.wallet(key)
        return await w.createAndSignTx(txOptions)
      }
    }
  }

  const signBytes = (bytes: Buffer, password = "") => {
    if (!wallet) throw new Error("Wallet is not defined")

    if (is.ledger(wallet)) {
      throw new Error("Ledger can not sign arbitrary data")
    } else {
      const pk = getKey(password)
      if (!pk) throw new Error("Incorrect password")

      if ("seed" in pk) {
        const key = new SeedKey({
          seed: Buffer.from(pk.seed, "hex"),
          coinType: pk.legacy ? 118 : 330,
          index: pk.index || 0,
        })
        const { signature, recid } = key.ecdsaSign(bytes)
        if (!signature) throw new Error("Signature is undefined")
        return {
          recid,
          signature: Buffer.from(signature).toString("base64"),
          public_key: key.publicKey?.toAmino().value as string,
        }
      } else {
        const key = new RawKey(Buffer.from(pk["330"], "hex"))
        const { signature, recid } = key.ecdsaSign(bytes)
        if (!signature) throw new Error("Signature is undefined")
        return {
          recid,
          signature: Buffer.from(signature).toString("base64"),
          public_key: key.publicKey?.toAmino().value as string,
        }
      }
    }
  }

  const post = async (
    txOptions: CreateTxOptions,
    password = "",
    signMode?: SignatureV2.SignMode,
    broadcastBlock?: boolean
  ) => {
    if (!wallet) throw new Error("Wallet is not defined")
    const signedTx = await sign(txOptions, password, signMode)
    const result = await lcd.tx.broadcastSync(signedTx, txOptions?.chainID)
    if (isTxError(result)) throw new Error(result.raw_log)
    if (broadcastBlock) {
      while (true) {
        await new Promise((r) => setTimeout(r, 1000))
        try {
          const txResult = await lcd.tx.txInfo(
            result.txhash,
            txOptions?.chainID
          )
          if (isTxError(result)) throw new Error(result.raw_log)
          return txResult
        } catch (e) {}
      }
    }
    return result
  }

  return {
    wallet,
    wallets,
    getConnectedWallet,
    getLedgerKey,
    connectedWallet,
    connect,
    connectLedger,
    disconnect,
    lock,
    available,
    encodeEncryptedWallet,
    validatePassword,
    createSignature,
    create,
    signBytes,
    sign,
    post,
    getPubkey,
  }
}

export default useAuth
