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
} from "station-ui"
import styles from "./CreateWalletForm.module.scss"
import { decrypt } from "auth/scripts/aes"

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

      const { seed, index, legacy } = JSON.parse(
        Buffer.from(mnemonic, "base64").toString("ascii")
      )

      setValues({
        name,
        mnemonic: seed,
        index,
        coinType: legacy ? 118 : 330,
        seedPassword,
      })
      setStep(3)
    } else {
      setValues({ name, mnemonic: mnemonic.trim(), index })
      setStep(2)
    }
  }

  function validateSeed(value?: string) {
    if (!value) return t("Invalid seed key")
    try {
      const { name, seed } = JSON.parse(
        Buffer.from(value, "base64").toString("ascii")
      )

      if (typeof seed !== "string") {
        return typeof name === "string"
          ? t("this key has been exported from an old version of Station")
          : t("Invalid seed key")
      }

      return true
    } catch {
      return t("Invalid seed key")
    }
  }

  function validateSeedPassword(value: string, password: string) {
    try {
      const { seed } = JSON.parse(
        Buffer.from(value, "base64").toString("ascii")
      )

      decrypt(seed, password)

      return true
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
              label={t("Mnemonic phrase")}
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
                type="password"
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
              <Input
                type="password"
                {...register("mnemonic", { validate: validateSeed })}
              />
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
                "This is the password you use on the device from where you exported the key."
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
              label={t("Mnemonic phrase")}
              error={errors.mnemonic?.message}
              extra={generated && <Copy copyText={mnemonic} />}
            >
              <Value>{mnemonic}</Value>
            </InputWrapper>

            <Grid gap={4}>
              <Banner
                variant="warning"
                title={t(
                  "Never share the mnemonic with others or enter it in unverified sites"
                )}
              />
            </Grid>

            <Checkbox
              {...register("checked", { required: true })}
              checked={!!checked}
              label={t("I have written down the mnemonic")}
            />
          </>
        ) : (
          <>
            <SectionHeader title={t("Import Wallet Options")} withLine />

            <Tabs
              tabs={[
                {
                  key: ImportOptions.MNEMONIC,
                  label: t("Mnemonic Phrase"),
                  onClick: () => {
                    setValues({ ...formValues, mnemonic: "" })
                    setImportOption(ImportOptions.MNEMONIC)
                  },
                },
                {
                  key: ImportOptions.SEED_KEY,
                  label: t("Seed Key"),
                  onClick: () => {
                    setValues({ ...formValues, mnemonic: "" })
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
          variant={generated ? "primary" : "secondary"}
          className={styles.submit__button}
        >
          {generated ? t("Create Wallet") : t("Import")}
        </SubmitButton>
      </FlexColumn>
    </Form>
  )
}

export default CreateWalletForm
