import { RawKey, SeedKey } from "@terra-money/feather.js"
import decrypt from "auth/scripts/decrypt"
import validate from "auth/scripts/validate"
import ExtensionPage from "extension/components/ExtensionPage"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  Button,
  ButtonInlineWrapper,
  Grid,
  Input,
  InputWrapper,
  SubmitButton,
  Tabs,
  TextArea,
  Form,
  Banner,
} from "station-ui"
import { addressFromWords, wordsFromAddress } from "utils/bech32"
import { ReactComponent as WalletIcon } from "styles/images/icons/Wallet.svg"
import { truncate } from "@terra-money/terra-utils"

export type MigratedWalletResult =
  | {
      name: string
      seed: Buffer
      words: Record<"330" | "118" | "60", string>
      pubkey: Record<"330" | "118" | "60", string>
      legacy: boolean
      index: number
    }
  | {
      name: string
      privatekey: Buffer
      words: Record<"330", string>
      pubkey: Record<"330", string>
    }
interface Props {
  wallet: {
    name: string
    encrypted?: string
    encryptedSeed?: string
    legacy?: boolean
    index?: number

    address?: string
    words?: Record<"330" | "118" | "60", string>
  }
  onComplete: (result: MigratedWalletResult) => void
  onBack: () => void
}

interface Values {
  mode: "password" | "mnemonic"
  // secret will contain the mnemonic or the passwrord depending on the mode chose by the user
  secret: string
  // index is only needed for mnemonic imports if we don't know the index of the wallet
  index: number
}

const MigrateWalletPage = ({ wallet, onComplete, onBack }: Props) => {
  const { t } = useTranslation()

  const form = useForm<Values>({
    mode: "onChange",
    defaultValues: {
      secret: "",
      index: wallet.index ?? 0,
      // if we have the encrypted seed, use password as default migration mode, otherwise use mnemonic
      mode: wallet.encryptedSeed ? "password" : "mnemonic",
    },
  })

  const { register, watch, handleSubmit, formState, setError, setValue } = form
  const { errors, isValid } = formState
  const { mode, secret, index } = watch()

  function sumbit({ mode, secret, index }: Values) {
    // PASSWORD VALIDATION (if needed)
    if (mode === "password") {
      try {
        decrypt((wallet.encryptedSeed || wallet.encrypted) as string, secret)
      } catch (error) {
        setError("secret", {
          message: t("Invalid password"),
        })
        return
      }
    }

    // LEGACY MIGRATION:
    // only password for wallets without seeds and using password
    // (not recommended, only Terra available)
    if (mode === "password" && !wallet.encryptedSeed) {
      const privatekey = Buffer.from(
        decrypt(wallet.encrypted as string, secret),
        "hex"
      )
      const key = new RawKey(privatekey)

      onComplete({
        name: wallet.name,
        privatekey,
        words: {
          "330": wordsFromAddress(key.accAddress("terra")),
        },
        pubkey: {
          // @ts-expect-error
          "330": key.publicKey.key,
        },
      })
      return
    }

    // DEFAULT MIGRATION:
    // get seed from the mnemonic or decoding the encrypted seed
    const seed =
      mode === "password"
        ? Buffer.from(decrypt(wallet.encryptedSeed as string, secret), "hex")
        : SeedKey.seedFromMnemonic(secret)
    const key330 = new SeedKey({
      seed,
      coinType: wallet.legacy ? 118 : 330,
      index: index || wallet.index || 0,
    })
    const key118 = new SeedKey({
      seed,
      coinType: wallet.legacy ? 118 : 330,
      index: index || wallet.index || 0,
    })
    const key60 = new SeedKey({
      seed,
      coinType: wallet.legacy ? 118 : 330,
      index: index || wallet.index || 0,
    })

    // calculate addresses
    const words = {
      "330": wordsFromAddress(key330.accAddress("terra")),
      "118": wordsFromAddress(key118.accAddress("terra")),
      "60": wordsFromAddress(key60.accAddress("inj")),
    }

    // calculate public keys
    const pubkey = {
      // @ts-expect-error
      "330": key330.publicKey.key,
      // @ts-expect-error
      "118": key118.publicKey.key,
      // @ts-expect-error
      "60": key60.publicKey.key,
    }

    // if words match, complete migration
    if (words["330"] === (wallet?.words?.["330"] ?? wallet.address)) {
      onComplete({
        name: wallet.name,
        seed,
        words,
        pubkey,
        legacy: !!wallet.legacy,
        index: index || wallet.index || 0,
      })
    }
    // if words for cointpe 118 are the same as the words for cointype 330, complete migration as a legacy wallet
    else if (words["118"] === (wallet?.words?.["330"] ?? wallet.address)) {
      onComplete({
        name: wallet.name,
        seed,
        words: {
          ...words,
          "330": words["118"],
        },
        pubkey: {
          ...pubkey,
          "330": pubkey["118"],
        },
        legacy: true,
        index: index || wallet.index || 0,
      })
    }
    // if addresses do not match the seed given is not the one of that wallet, show error
    else {
      setError("secret", {
        message: t(
          typeof wallet.index === "number"
            ? "You entered the wrong mnemonic"
            : // if we gave the user the option to select the index, we also need to tell them that they might have selected the wrong index
              "You entered the wrong mnemonic or selected the wrong index"
        ),
      })
    }
  }

  return (
    <ExtensionPage
      img={<WalletIcon width={40} height={40} />}
      title={wallet.name}
      label={truncate(
        wallet.address || addressFromWords(wallet.words?.["330"] || ""),
        [10, 10]
      )}
      subtitle={t(
        "Enter the password for this wallet to import it into Station v3."
      )}
      fullHeight
    >
      <Form onSubmit={handleSubmit(sumbit)}>
        <Grid gap={18}>
          <Tabs
            activeTabKey={mode}
            tabs={[
              {
                key: "password",
                label: "Password",
                onClick: () => {
                  setValue("secret", "")
                  setError("secret", { message: "" })
                  setValue("mode", "password")
                },
              },
              {
                key: "mnemonic",
                label: "Mnemonic Phrase",
                onClick: () => {
                  setValue("secret", "")
                  setValue("index", wallet.index ?? 0)
                  setError("secret", { message: "" })
                  setValue("mode", "mnemonic")
                },
              },
            ]}
          />
          {mode === "password" ? (
            <>
              <InputWrapper
                label={t("Password")}
                error={errors.secret?.message}
              >
                <Input
                  {...register("secret", {
                    value: "",
                    validate: () => true,
                  })}
                  type="password"
                />
              </InputWrapper>
              {!wallet.encryptedSeed && (
                <Banner
                  variant="warning"
                  title={t(
                    "Importing your wallet using only password means you will experience limited features for this wallet. For best results, import using your seed phrase instead!"
                  )}
                />
              )}
            </>
          ) : (
            <>
              <InputWrapper
                label={t("Mnemonic Phrase")}
                error={errors.secret?.message}
              >
                <TextArea
                  {...register("secret", {
                    value: "",
                    validate: validate.mnemonic,
                  })}
                />
              </InputWrapper>
              {
                // if we don't know the index that the user originally used, we need to ask them for it
                typeof wallet.index !== "number" && (
                  <>
                    <InputWrapper
                      label={t("Index")}
                      error={errors.index?.message}
                    >
                      <Input
                        {...register("index", {
                          value: 0,
                        })}
                        type="number"
                      />
                    </InputWrapper>
                    {
                      // same banner that we have on the create wallet page
                      index !== 0 && (
                        <Banner
                          variant="info"
                          title={t("Default index is 0")}
                        />
                      )
                    }
                  </>
                )
              }
            </>
          )}
          <ButtonInlineWrapper>
            <Button
              variant="secondary"
              label={t("Back")}
              onClick={() => onBack()}
            />
            <SubmitButton
              variant="primary"
              label={t("Import")}
              disabled={!isValid || !secret}
            />
          </ButtonInlineWrapper>
        </Grid>
      </Form>
    </ExtensionPage>
  )
}

export default MigrateWalletPage
