import { ReactNode, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { RawKey, SeedKey } from "@terra-money/feather.js"
import createContext from "utils/createContext"
import { addWallet } from "../../scripts/keystore"
import CreateWalletForm from "./CreateWalletForm"
import CreatedWallet from "./CreatedWallet"
import { wordsFromAddress } from "utils/bech32"
import PasswordForm from "./PasswordForm"
import { decrypt } from "auth/scripts/aes"
import legacyDecrypt from "auth/scripts/decrypt"

export interface Values {
  name: string
  mnemonic: string
  index: number
  coinType?: Bip
  seedPassword?: string
  legacySeedKey?: boolean
}

/* context */
interface CreateWallet {
  /* step */
  setStep: (index: number) => void

  /* form values */
  generated: boolean
  values: Values
  setValues: (values: Values) => void

  /* create wallet */
  createdWallet?: SingleWallet
  createWallet: (password: string) => void
}

export const [useCreateWallet, CreateWalletProvider] =
  createContext<CreateWallet>("useCreateWallet")

interface Props {
  defaultMnemonic?: string
  beforeCreate: ReactNode
}

const DefaultValues = { name: "", mnemonic: "", index: 0 }

const CreateWalletWizard = ({ defaultMnemonic = "", beforeCreate }: Props) => {
  /* step */
  const location = useLocation()
  const navigate = useNavigate()
  const step = Number(location.hash.replace("#", "")) || 1
  const setStep = (index: number) => navigate({ hash: String(index) })

  /* form values */
  const initial = { ...DefaultValues, mnemonic: defaultMnemonic }
  const [values, setValues] = useState<Values>(initial)

  /* create wallet */
  const [createdWallet, setCreatedWallet] = useState<SingleWallet>()
  const createWallet = (password: string) => {
    const { name, mnemonic, coinType, index, seedPassword, legacySeedKey } =
      values

    const seed = seedPassword
      ? legacySeedKey
        ? Buffer.from(legacyDecrypt(mnemonic, seedPassword), "hex")
        : Buffer.from(decrypt(mnemonic, seedPassword), "base64")
      : SeedKey.seedFromMnemonic(mnemonic)

    if (!legacySeedKey) {
      const key330 = new SeedKey({ seed, coinType: coinType ?? 330, index })
      const key118 = new SeedKey({ seed, coinType: 118, index })
      const key60 = new SeedKey({ seed, coinType: 60, index })
      const words = {
        "330": wordsFromAddress(key330.accAddress("terra")),
        "118": wordsFromAddress(key118.accAddress("terra")),
        "60": wordsFromAddress(key60.accAddress("inj")),
      }

      const pubkey = {
        // @ts-expect-error
        "330": key330.publicKey.key,
        // @ts-expect-error
        "118": key118.publicKey.key,
        // @ts-expect-error
        "60": key60.publicKey.key,
      }

      try {
        addWallet(
          {
            name,
            words,
            mnemonic: seedPassword ? undefined : mnemonic,
            seed,
            pubkey,
            index,
            legacy: coinType === 118,
          },
          password
        )
      } catch (e) {}
      setCreatedWallet({ name, words, pubkey })
    } else {
      const key330 = new RawKey(seed)
      const words = {
        "330": wordsFromAddress(key330.accAddress("terra")),
      }

      const pubkey = {
        // @ts-expect-error
        "330": key330.publicKey.key,
      }
      try {
        addWallet(
          {
            name,
            words,
            key: { "330": seed },
            pubkey,
          },
          password
        )
      } catch (e) {}
      setCreatedWallet({ name, words, pubkey })
    }

    setStep(4)
  }

  /* effect: reset memory on unmount */
  useEffect(() => {
    return () => {
      setValues(DefaultValues)
      setCreatedWallet(undefined)
    }
  }, [setValues])

  /* render */
  const render = () => {
    switch (step) {
      case 1:
        return <CreateWalletForm />

      case 2:
        if (!values.mnemonic) setStep(1)
        if (values.legacySeedKey) setStep(3)
        return beforeCreate

      case 3:
        return <PasswordForm />

      case 4:
        if (!createdWallet) return null
        return <CreatedWallet {...createdWallet} />
    }
  }

  const generated = !!defaultMnemonic
  const value = {
    setStep,
    generated,
    values,
    setValues,
    createdWallet,
    createWallet,
  }

  return <CreateWalletProvider value={value}>{render()}</CreateWalletProvider>
}

export default CreateWalletWizard
