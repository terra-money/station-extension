import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { Form } from "components/form"
import validate from "auth/scripts/validate"
import { useCreateWallet } from "./CreateWalletWizard"
import {
  InputWrapper,
  Input,
  FlexColumn,
  SubmitButton,
  Flex,
  Button,
  Checkbox,
} from "@terra-money/station-ui"
import styles from "./CreateWalletForm.module.scss"
import {
  getStoredPassword,
  isPasswordValid,
  passwordExists,
  setShouldStorePassword,
  shouldStorePassword,
  storePassword,
} from "auth/scripts/keystore"
import ExtensionPage from "extension/components/ExtensionPage"

interface Values {
  password: string
  confirm: string
  rememberPassword: boolean
}

const PasswordForm = () => {
  const { t } = useTranslation()
  const { values, createWallet, setStep } = useCreateWallet()
  // loading while checking if there is a stored password
  const [isLoading, setLoading] = useState(true)

  // check if there is a stored password
  useEffect(() => {
    getStoredPassword().then((password) => {
      if (password) {
        createWallet(password)
      } else {
        setLoading(false)
      }
    })
  }, []) // eslint-disable-line

  /* form */
  const form = useForm<Values>({
    mode: "onChange",
    defaultValues: {
      ...values,
      confirm: "",
      rememberPassword: shouldStorePassword(),
    },
  })

  const { register, watch, handleSubmit, formState, reset, setError } = form
  const { errors, isValid } = formState
  const { password, rememberPassword } = watch()

  useEffect(() => {
    return () => reset()
  }, [reset])

  const submit = ({ password, rememberPassword }: Values) => {
    if (passwordExists() && !isPasswordValid(password)) {
      setError(
        "password",
        { message: t("Invalid password") },
        { shouldFocus: true }
      )
      return
    }

    if (rememberPassword) {
      setShouldStorePassword(true)
      storePassword(password)
    } else {
      setShouldStorePassword(false)
    }

    createWallet(password)
  }

  // don't show the form while checking for stored passwords
  if (isLoading) return null

  return (
    <Form onSubmit={handleSubmit(submit)} className={styles.form}>
      <ExtensionPage
        title={t("Set a Password")}
        subtitle={t(
          "Set a global password for your wallet on this device. Choose a strong password with more than 10 characters."
        )}
      >
        <FlexColumn gap={18}>
          <InputWrapper label={t("Password")} error={errors.password?.message}>
            <Input
              {...register("password", {
                validate: passwordExists() ? undefined : validate.password,
                value: "",
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

          <InputWrapper>
            <Checkbox
              label={t("Save password")}
              checked={rememberPassword}
              {...register("rememberPassword")}
            />
          </InputWrapper>
          <Flex gap={12} style={{ marginTop: 22 }}>
            <Button variant="secondary" onClick={() => setStep(2)} block>
              {t("Back")}
            </Button>
            <SubmitButton disabled={!isValid}>{t("Confirm")}</SubmitButton>
          </Flex>
        </FlexColumn>
      </ExtensionPage>
    </Form>
  )
}

export default PasswordForm
