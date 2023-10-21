import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
// import { Input } from "components/form"
import { changePassword } from "../../scripts/keystore"
import validate from "auth/scripts/validate"
import useAuth from "../../hooks/useAuth"
import ConfirmModal from "./ConfirmModal"
import { Form, InputWrapper, SubmitButton, Input } from "station-ui"

interface Values {
  current: string
  password: string
  confirm: string
}

const ChangePasswordForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { validatePassword } = useAuth()

  /* form */
  const form = useForm<Values>({ mode: "onChange" })
  const { register, watch, handleSubmit, formState } = form
  const { errors } = formState
  const { password } = watch()

  const [done, setDone] = useState(false)
  const submit = ({ current, password }: Values) => {
    changePassword({ oldPassword: current, newPassword: password })
    setDone(true)
  }

  return (
    <>
      {done && (
        <ConfirmModal onRequestClose={() => navigate("/")}>
          {t("Password changed successfully")}
        </ConfirmModal>
      )}

      <Form onSubmit={handleSubmit(submit)}>
        <InputWrapper
          label={t("Current password")}
          error={errors.current?.message}
        >
          <Input
            {...register("current", { validate: validatePassword })}
            type="password"
            autoFocus
          />
        </InputWrapper>

        <InputWrapper
          label={t("New password")}
          error={errors.password?.message}
        >
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
            onFocus={() => form.trigger("confirm")}
            type="password"
          />
        </InputWrapper>
        <SubmitButton
          label={t("Submit")}
          disabled={!!Object.values(errors).length}
        />
      </Form>
    </>
  )
}

export default ChangePasswordForm
