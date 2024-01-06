import { SeedKey } from "@terra-money/feather.js"
import { useModal } from "@terra-money/station-ui"
import useAuth from "auth/hooks/useAuth"
import {
  getDecryptedKey,
  getStoredWallets,
  storeWallets,
} from "auth/scripts/keystore"
import {
  Form,
  Banner,
  InputWrapper,
  Input,
  SubmitButton,
} from "@terra-money/station-ui"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { wordsFromAddress } from "utils/bech32"

interface Values {
  password: string
}

const CoinTypePasswordForm = () => {
  const { t } = useTranslation()
  const [error, setError] = useState<Error>()
  const { wallet, connect } = useAuth()
  const { closeModal } = useModal()

  const form = useForm<Values>({ mode: "onChange" })
  const { register, handleSubmit, formState } = form
  const { errors, isValid } = formState

  const submit = ({ password }: Values) => {
    try {
      if (!wallet) throw new Error("No wallet connected")

      const pk = getDecryptedKey({ name: wallet.name, password })
      if (!pk) throw new Error("Incorrect password")

      if ("seed" in pk) {
        const key330 = new SeedKey({
          seed: Buffer.from(pk.seed, "hex"),
          coinType: pk.legacy ? 118 : 330,
          index: pk.index || 0,
        })
        const key118 = new SeedKey({
          seed: Buffer.from(pk.seed, "hex"),
          coinType: 118,
          index: pk.index || 0,
        })
        const key60 = new SeedKey({
          seed: Buffer.from(pk.seed, "hex"),
          coinType: 60,
          index: pk.index || 0,
        })

        const words = {
          ...wallet.words,
          "60": wordsFromAddress(key60.accAddress("terra")),
        }
        const pubkey = {
          // @ts-expect-error
          "330": key330.publicKey.key,
          // @ts-expect-error
          "118": key118.publicKey.key,
          // @ts-expect-error
          "60": key60.publicKey.key,
        }
        storeWallets(
          getStoredWallets().map((w) => {
            if (w.name === wallet.name) {
              return {
                ...w,
                words,
                pubkey,
              }
            }
            return w
          })
        )

        connect(wallet.name)
        closeModal()
      }
    } catch (error) {
      setError(error as Error)
    }
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <Banner
        variant="info"
        title={t(
          "Provide your password to generate an injective address for this wallet."
        )}
      />

      <InputWrapper label={t("Password")} error={errors.password?.message}>
        <Input {...register("password", { required: true })} type="password" />
      </InputWrapper>

      {error && <Banner variant="error" title={error.message} />}

      <SubmitButton label={t("Submit")} disabled={!isValid} />
    </Form>
  )
}

export default CoinTypePasswordForm
