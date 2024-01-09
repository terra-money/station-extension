import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { Grid } from "components/layout"
import { Form, Value } from "components/form"
import validate from "auth/scripts/validate"
import { TooltipIcon } from "components/display"
import { useCreateWallet, Values as DefaultValues } from "./CreateWalletWizard"
import {
  Banner,
  Copy,
  InputWrapper,
  Input,
  Checkbox,
  SectionHeader,
  Paste,
  Tabs,
  FlexColumn,
  SubmitButton,
} from "@terra-money/station-ui"
import styles from "./CreateWalletForm.module.scss"
import { decrypt } from "auth/scripts/aes"
import legacyDecrypt from "auth/scripts/decrypt"

interface Values extends DefaultValues {
  confirm: string
  checked?: boolean
  seedPassword?: string
}

enum ImportOptions {
  MNEMONIC = "mnemonic",
  SEED_KEY = "seed-key",
}

const CreateWalletForm = () => {
  const { t } = useTranslation()
  const { setStep, generated, values, setValues } = useCreateWallet()

  const [importOption, setImportOption] = useState<ImportOptions>(
    ImportOptions.MNEMONIC
  )
  const [showAdvanced, setShowAdvanced] = useState(false)

  /* form */
  const form = useForm<Values>({
    mode: "onChange",
    defaultValues: { ...values, confirm: "", checked: false },
  })

  const {
    register,
    watch,
    handleSubmit,
    formState,
    reset,
    setValue,
    setError,
  } = form
  const { errors, isValid } = formState
  const formValues = watch()
  const { mnemonic, index, checked } = formValues

  useEffect(() => {
    return () => reset()
  }, [reset])

  const submit = ({ name, mnemonic, index, seedPassword }: Values) => {
    if (importOption === ImportOptions.SEED_KEY) {
      if (!seedPassword || !validateSeedPassword(mnemonic, seedPassword)) {
        setError("seedPassword", { message: t("Invalid password") })
        return
      }

      const { seed, index, legacy, encrypted_key } = JSON.parse(
        Buffer.from(mnemonic, "base64").toString("ascii")
      )

      setValues({
        name,
        mnemonic: seed || encrypted_key,
        index,
        coinType: legacy ? 118 : 330,
        seedPassword,
        legacySeedKey: !seed,
      })
      setStep(2)
    } else {
      setValues({ name, mnemonic: mnemonic.trim(), index })
      setStep(2)
    }
  }

  function validateSeed(value?: string) {
    if (!value) return t("Invalid seed key")
    try {
      const { seed, encrypted_key } = JSON.parse(
        Buffer.from(value, "base64").toString("ascii")
      )

      if (typeof seed !== "string" && typeof encrypted_key !== "string") {
        return t("Invalid seed key")
      }

      return true
    } catch {
      return t("Invalid seed key")
    }
  }

  function validateSeedPassword(value: string, password: string) {
    try {
      const { seed, encrypted_key } = JSON.parse(
        Buffer.from(value, "base64").toString("ascii")
      )

      if (seed) {
        decrypt(seed, password)

        return true
      } else {
        legacyDecrypt(encrypted_key, password)

        return true
      }
    } catch {
      return false
    }
  }

  function renderImportOption() {
    switch (importOption) {
      case ImportOptions.MNEMONIC:
        return (
          <>
            <InputWrapper
              label={t("Recovery phrase")}
              error={errors.mnemonic?.message}
              extra={
                <Paste
                  withIcon
                  onPaste={(lines) =>
                    setValue("mnemonic", lines, { shouldValidate: true })
                  }
                />
              }
            >
              <Input
                {...register("mnemonic", { validate: validate.mnemonic })}
              />
            </InputWrapper>

            <button
              onClick={(e) => {
                e.preventDefault()
                setShowAdvanced((show) => !show)
              }}
            >
              <SectionHeader
                title={
                  showAdvanced
                    ? t("Hide Advanced Options")
                    : t("Show Advanced Options")
                }
                withLine
              />
            </button>

            {showAdvanced && (
              <InputWrapper
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
                  <Banner variant="info" title={t("Default index is 0")} />
                )}
              </InputWrapper>
            )}
          </>
        )
      case ImportOptions.SEED_KEY:
        return (
          <>
            <InputWrapper
              label={t("Seed key")}
              error={errors.mnemonic?.message}
              extra={
                <Paste
                  withIcon
                  onPaste={(lines) =>
                    setValue("mnemonic", lines, { shouldValidate: true })
                  }
                />
              }
            >
              <Input {...register("mnemonic", { validate: validateSeed })} />
            </InputWrapper>

            <InputWrapper
              label={t("Password")}
              error={errors.seedPassword?.message}
            >
              <Input
                {...register("seedPassword", {
                  value: "",
                })}
                type="password"
              />
            </InputWrapper>

            <Banner
              variant="info"
              title={t(
                "Only keys exported directly from Station wallet are supported. You will need the key as well as the password used on the previous wallet to complete the import."
              )}
            />
          </>
        )
    }
  }

  return (
    <Form onSubmit={handleSubmit(submit)} className={styles.form}>
      <FlexColumn gap={18} className={styles.form__content}>
        <InputWrapper label={t("Wallet Name")} error={errors.name?.message}>
          <Input
            {...register("name", { validate: validate.name })}
            autoFocus
            placeholder="e.g. 'my-wallet'"
          />
        </InputWrapper>

        {generated ? (
          <>
            <InputWrapper
              label={t("Recovery phrase")}
              error={errors.mnemonic?.message}
              extra={generated && <Copy copyText={mnemonic} />}
            >
              <Value>{mnemonic}</Value>
            </InputWrapper>

            <Grid gap={4}>
              <Banner
                variant="warning"
                title={t(
                  "Never share the recovery phrase with others or enter it in unverified sites"
                )}
              />
            </Grid>

            <Checkbox
              {...register("checked", { required: true })}
              checked={!!checked}
              label={t("I have written down the recovery phrase")}
            />
          </>
        ) : (
          <>
            <SectionHeader title={t("Import Wallet Options")} withLine />

            <Tabs
              tabs={[
                {
                  key: ImportOptions.MNEMONIC,
                  label: t("Recovery Phrase"),
                  onClick: () => {
                    importOption !== ImportOptions.MNEMONIC &&
                      setError("mnemonic", {})
                    setValue("mnemonic", "")
                    setImportOption(ImportOptions.MNEMONIC)
                  },
                },
                {
                  key: ImportOptions.SEED_KEY,
                  label: t("Seed Key"),
                  onClick: () => {
                    importOption !== ImportOptions.SEED_KEY &&
                      setError("mnemonic", {})
                    setValue("mnemonic", "")
                    setImportOption(ImportOptions.SEED_KEY)
                  },
                },
              ]}
              activeTabKey={importOption}
            />

            {renderImportOption()}
          </>
        )}

        <SubmitButton
          disabled={!isValid}
          variant={"primary"}
          className={styles.submit__button}
        >
          {generated ? t("Create Wallet") : t("Import")}
        </SubmitButton>
      </FlexColumn>
    </Form>
  )
}

export default CreateWalletForm
