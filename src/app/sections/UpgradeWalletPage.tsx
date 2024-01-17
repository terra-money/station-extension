import { SeedKey } from "@terra-money/feather.js"
import useAuth from "auth/hooks/useAuth"
import {
  addWallet,
  deleteWallet,
  getDecryptedKey,
  getStoredPassword,
} from "auth/scripts/keystore"
import validate from "auth/scripts/validate"
import { TooltipIcon } from "components/display"
import {
  Form,
  Banner,
  InputWrapper,
  Input,
  SubmitButton,
} from "@terra-money/station-ui"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { wordsFromAddress } from "utils/bech32"
import { useNavigate, useParams } from "react-router-dom"
import ExtensionPage from "extension/components/ExtensionPage"
import is from "auth/scripts/is"

interface Values {
  index: number
  mnemonic: string
  password: string
}

const UpgradeWalletPage = () => {
  const { t } = useTranslation()
  const [error, setError] = useState<Error>()
  const { wallets, connect } = useAuth()
  const { walletName } = useParams()
  const navigate = useNavigate()

  const wallet: any = wallets.find(({ name }) => name === walletName)

  if (wallet?.words?.["60"] || is.ledger(wallet) || is.multisig(wallet)) {
    navigate(`/manage-wallet/manage/${walletName}`)
  }

  const form = useForm<Values>({
    mode: "onChange",
    defaultValues: { index: 0 },
  })
  const { register, handleSubmit, formState, watch } = form
  const { errors, isValid } = formState
  const { index } = watch()
  const [isLoading, setLoading] = useState(true)
  const [storedPassword, setPassword] = useState<string | undefined>()

  // check if there is a stored password
  useEffect(() => {
    getStoredPassword().then((password) => {
      if (password) {
        setPassword(password)
      }
      setLoading(false)
    })
  }, []) // eslint-disable-line

  const submit = ({ password: formPassword, mnemonic, index }: Values) => {
    const password = storedPassword || formPassword
    try {
      if (!wallet) throw new Error("No wallet connected")

      const pk = getDecryptedKey({ name: wallet.name, password })
      if (!pk) throw new Error("Incorrect password")

      const seed = SeedKey.seedFromMnemonic(mnemonic)
      const key330 = new SeedKey({
        seed,
        coinType: 330,
        index,
      })
      const key118 = new SeedKey({
        seed,
        coinType: 118,
        index,
      })
      const key60 = new SeedKey({
        seed,
        coinType: 60,
        index,
      })

      const isLegacy =
        wordsFromAddress(key118.accAddress("terra")) === wallet.words["330"]

      if (
        !isLegacy &&
        wordsFromAddress(key330.accAddress("terra")) !== wallet.words["330"]
      ) {
        throw new Error("Wrong mnemonic or index")
      }

      deleteWallet(wallet.name)
      addWallet(
        {
          name: wallet.name,
          index,
          legacy: isLegacy,
          words: {
            "330": wordsFromAddress(
              (isLegacy ? key118 : key330).accAddress("terra")
            ),
            "118": wordsFromAddress(key118.accAddress("terra")),
            "60": wordsFromAddress(key60.accAddress("terra")),
          },
          pubkey: {
            // @ts-expect-error
            "330": (isLegacy ? key118 : key330).publicKey.key,
            // @ts-expect-error
            "118": key118.publicKey.key,
            // @ts-expect-error
            "60": key60.publicKey.key,
          },
          seed,
          mnemonic,
        },
        password
      )
      connect(wallet.name)
      navigate("/")
    } catch (error) {
      setError(error as Error)
    }
  }

  return (
    <ExtensionPage
      modal
      backButtonPath={`/manage-wallet/manage/${walletName}`}
      title={t("Upgrade wallet")}
    >
      <Form onSubmit={handleSubmit(submit)}>
        <Banner
          variant="info"
          title={t(
            "This wallet needs to be upgraded to allow for full cross-chain support. Enter your recovery phrase to proceed with the upgrade."
          )}
        />

        <InputWrapper
          label={t("Recovery phrase")}
          error={errors.mnemonic?.message}
        >
          <Input {...register("mnemonic", { validate: validate.mnemonic })} />
        </InputWrapper>

        <InputWrapper /* do not translate this */
          label="Index"
          error={errors.index?.message}
          extra={
            <TooltipIcon
              content={t("BIP 44 index number. For advanced users only")}
            />
          }
        >
          <Input
            {...register("index", {
              valueAsNumber: true,
              validate: validate.index,
            })}
          />
          {index !== 0 && (
            <Banner variant="warning" title={t("Default index is 0")} />
          )}
        </InputWrapper>

        {error && <Banner variant="error" title={error.message} />}

        {!isLoading && !storedPassword && (
          <InputWrapper label={t("Password")} error={errors.password?.message}>
            <Input
              {...register("password", {
                required: !isLoading && !storedPassword,
              })}
              type="password"
            />
          </InputWrapper>
        )}

        <SubmitButton label={t("Submit")} disabled={!isValid} />
      </Form>
    </ExtensionPage>
  )
}

export default UpgradeWalletPage
