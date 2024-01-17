import {
  createNewPassword,
  getStoredPassword,
  isPasswordValid,
  passwordExists,
  setShouldStorePassword,
  shouldStorePassword,
  storePassword,
} from "auth/scripts/keystore"
import validate from "auth/scripts/validate"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Checkbox,
  Flex,
  FlexColumn,
  Form,
  Input,
  InputWrapper,
  LoadingCircular,
  SubmitButton,
} from "@terra-money/station-ui"
import { useForm } from "react-hook-form"

interface Values {
  password: string
  confirm: string
  rememberPassword: boolean
}

interface Props {
  onComplete: (password: string) => void
  // for ledger wallets, should show the form only to choose a new password if it doesn't exists
  onCompleteLedger?: () => void
}

const PasswordForm = ({ onComplete, onCompleteLedger }: Props) => {
  const { t } = useTranslation()
  // loading while checking if there is a stored password
  const [isLoading, setLoading] = useState(true)

  // check if there is a stored password
  useEffect(() => {
    if (onComplete) {
      getStoredPassword().then((password) => {
        if (password) {
          onComplete(password)
        } else {
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }

    if (onCompleteLedger && passwordExists()) {
      onCompleteLedger()
    }
  }, []) // eslint-disable-line

  /* form */
  const form = useForm<Values>({
    mode: "onChange",
    defaultValues: {
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
    } else if (!passwordExists()) {
      createNewPassword(password)
    }

    if (rememberPassword) {
      setShouldStorePassword(true)
      storePassword(password)
    } else {
      setShouldStorePassword(false)
    }

    onComplete && onComplete(password)
  }

  // don't show the form while checking for stored passwords
  if (isLoading)
    return (
      <Flex align="center" justify="center">
        <LoadingCircular />
      </Flex>
    )

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
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
          <SubmitButton
            disabled={!isValid}
            label={t("Submit")}
            onClick={(e) => {
              e.preventDefault()
              handleSubmit(submit)()
            }}
          />
        </Flex>
      </FlexColumn>
    </Form>
  )
}

export default PasswordForm
