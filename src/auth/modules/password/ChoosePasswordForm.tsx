import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { Form } from "components/form"
import { isWallet } from "auth"
import { deleteWallet } from "../../scripts/keystore"
import useAuth from "../../hooks/useAuth"
import { Banner, Input, InputWrapper, SubmitButton } from "station-ui"

interface Values {
  password: string
  confirm: string
}

const ChoosePasswordForm = () => {
  const { t } = useTranslation()
  const { wallet, disconnect, validatePassword } = useAuth()
  const walletName = isWallet.local(wallet) ? wallet.name : undefined
  const [name, setName] = useState(walletName)

  /* form */
  const form = useForm<Values>()
  const { register, handleSubmit, formState } = form
  const { isValid, errors } = formState

  /* submit */
  const submit = (values: Values) => {
    if (!name) return
    disconnect()
    deleteWallet(name, values.password)
    setName(undefined)
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <InputWrapper label={t("Password")} error={errors.password?.message}>
        <Input
          {...register("password", { validate: validatePassword })}
          type="password"
        />
      </InputWrapper>

      <Banner
        variant="error"
        title={t(
          "This action can not be undone. You will need a private key or a mnemonic seed phrase to restore this wallet to the app."
        )}
      />

      <SubmitButton disabled={!isValid} />
    </Form>
  )
}

export default ChoosePasswordForm
