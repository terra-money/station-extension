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
import { isPasswordValid, passwordExists } from "auth/scripts/keystore"

interface Values extends DefaultValues {
  confirm: string
  checked?: boolean
}

enum ImportOptions {
  MNEMONIC = "mnemonic",
  PRIVATE_KEY = "private-key",
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
  const { password, mnemonic, index, checked } = watch()

  useEffect(() => {
    return () => reset()
  }, [reset])

  const submit = ({ name, password, mnemonic, index }: Values) => {
    if (passwordExists() && !isPasswordValid(password)) {
      setError(
        "password",
        { message: t("Invalid password") },
        { shouldFocus: true }
      )
      return
    }
    setValues({ name, password, mnemonic: mnemonic.trim(), index })
    setStep(2)
  }

  function renderPasswordInput() {
    return (
      <>
        <InputWrapper label={t("Password")} error={errors.password?.message}>
          <Input
            {...register("password", {
              validate: passwordExists() ? undefined : validate.password,
            })}
            type="password"
          />
        </InputWrapper>
        {!passwordExists() && (
          <InputWrapper
            label={t("Confirm password")}
            error={errors.confirm?.message}
          >
            <Input
              {...register("confirm", {
                validate: (confirm) => validate.confirm(password, confirm),
              })}
              onFocus={() => form.trigger("confirm")}
              type="password"
            />
          </InputWrapper>
        )}
      </>
    )
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

            {renderPasswordInput()}

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
      case ImportOptions.PRIVATE_KEY:
        return (
          <>
            <InputWrapper
              label={t("Private key")}
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

            {renderPasswordInput()}
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
            {renderPasswordInput()}

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
                  onClick: () => setImportOption(ImportOptions.MNEMONIC),
                },
                {
                  key: ImportOptions.PRIVATE_KEY,
                  label: t("Private Key"),
                  onClick: () => setImportOption(ImportOptions.PRIVATE_KEY),
                },
              ]}
              activeTabKey={importOption}
            />

            {renderImportOption()}
          </>
        )}
      </FlexColumn>
      <section className={styles.form__footer}>
        {generated ? (
          <SubmitButton disabled={!isValid} variant="secondary">
            {t("Create Wallet")}
          </SubmitButton>
        ) : (
          <SubmitButton disabled={!isValid}>{t("Import")}</SubmitButton>
        )}
      </section>
    </Form>
  )
}

export default CreateWalletForm
