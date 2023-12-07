import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  changePassword,
  isPasswordValid,
  setShouldStorePassword,
  shouldStorePassword,
  storePassword,
} from "../../scripts/keystore"
import validate from "auth/scripts/validate"
import {
  Form,
  InputWrapper,
  SubmitButton,
  Input,
  Checkbox,
  SummaryHeader,
  Grid,
  Button,
} from "@terra-money/station-ui"

interface Values {
  current: string
  password: string
  confirm: string
  rememberPassword: boolean
}

const ChangePasswordForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  /* form */
  const form = useForm<Values>({
    mode: "onChange",
    defaultValues: { rememberPassword: shouldStorePassword() },
  })
  const { register, watch, handleSubmit, formState, setError } = form
  const { errors } = formState
  const { current, password, rememberPassword, confirm } = watch()

  const [done, setDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const submit = ({ current, password, rememberPassword }: Values) => {
    setIsLoading(true)
    if (!isPasswordValid(current)) {
      setError("current", { message: t("Invalid password") })
      setIsLoading(false)
      return
    }

    changePassword({ oldPassword: current, newPassword: password })
    if (rememberPassword) {
      setShouldStorePassword(true)
      storePassword(password)
    } else {
      setShouldStorePassword(false)
    }
    setIsLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <Grid gap={24}>
        <SummaryHeader
          statusLabel={t("Success!")}
          statusMessage={t("Password changed successfully")}
          status={"success"}
        />
        <Button
          variant="primary"
          onClick={() => navigate("/preferences/security")}
        >
          {t("Done")}
        </Button>
      </Grid>
    )
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <InputWrapper
        label={t("Current password")}
        error={errors.current?.message}
      >
        <Input {...register("current")} type="password" />
      </InputWrapper>

      <InputWrapper label={t("New password")} error={errors.password?.message}>
        <Input
          {...register("password", { validate: validate.password })}
          type="password"
        />
      </InputWrapper>

      <InputWrapper
        label={t("Confirm new password")}
        error={errors.confirm?.message}
      >
        <Input
          {...register("confirm", {
            validate: (value) => validate.confirm(password, value),
          })}
          type="password"
        />
      </InputWrapper>
      <InputWrapper>
        <Checkbox
          label={t("Save password")}
          checked={rememberPassword}
          {...register("rememberPassword")}
        />
      </InputWrapper>
      <SubmitButton
        label={t("Submit")}
        disabled={
          isLoading ||
          !!Object.values(errors).find(({ message }) => !!message) ||
          !(current && password && confirm)
        }
        loading={isLoading}
      />
    </Form>
  )
}

export default ChangePasswordForm
