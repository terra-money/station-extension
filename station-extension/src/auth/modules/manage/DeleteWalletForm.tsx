import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import { Form } from "components/form"
import { isWallet } from "auth"
import { deleteWallet, isPasswordValid } from "../../scripts/keystore"
import useAuth from "../../hooks/useAuth"
import ConfirmModal from "./ConfirmModal"
import { Banner, Input, InputWrapper, SubmitButton } from "station-ui"

interface Values {
  password: string
}

const DeleteWalletForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
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
    if (!isPasswordValid(values.password))
      throw new Error(t("Invalid password"))

    disconnect()
    deleteWallet(name)
    setName(undefined)
  }

  return (
    <>
      {!name ? (
        <ConfirmModal
          icon={<DoneAllIcon className="success" fontSize="inherit" />}
          onRequestClose={() => navigate("/", { replace: true })}
        >
          {t("Wallet deleted successfully")}
        </ConfirmModal>
      ) : (
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
      )}
    </>
  )
}

export default DeleteWalletForm
