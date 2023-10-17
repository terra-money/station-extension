import { useEffect } from "react"
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
} from "station-ui"
import styles from "./CreateWalletForm.module.scss"
import { isPasswordValid, passwordExists } from "auth/scripts/keystore"

interface Values {
  password: string
  confirm: string
}

const PasswordForm = () => {
  const { t } = useTranslation()
  const { values, createWallet, setStep } = useCreateWallet()

  /* form */
  const form = useForm<Values>({
    mode: "onChange",
    defaultValues: { ...values, confirm: "" },
  })

  const { register, watch, handleSubmit, formState, reset, setError } = form
  const { errors, isValid } = formState
  const { password } = watch()

  useEffect(() => {
    return () => reset()
  }, [reset])

  const submit = ({ password }: Values) => {
    if (passwordExists() && !isPasswordValid(password)) {
      setError(
        "password",
        { message: t("Invalid password") },
        { shouldFocus: true }
      )
      return
    }
    createWallet(password)
  }

  return (
    <Form onSubmit={handleSubmit(submit)} className={styles.form}>
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
        <Flex gap={12} style={{ marginTop: 22 }}>
          <Button variant="secondary" onClick={() => setStep(2)} block>
            {t("Back")}
          </Button>
          <SubmitButton disabled={!isValid}>{t("Confirm")}</SubmitButton>
        </Flex>
      </FlexColumn>
    </Form>
  )
}

export default PasswordForm
