import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { InputWrapper, Input, Form } from "@terra-money/station-ui"
import validate from "auth/scripts/validate"
import { useForm } from "react-hook-form"
import { getStoredWallets, storeWallets } from "auth/scripts/keystore"
import { useAuth } from "auth"

type Values = {
  name: string
}

const WalletNameInput = () => {
  const { t } = useTranslation()
  const { wallet } = useParams()
  const { connect } = useAuth()
  const { formState, register, handleSubmit, setValue } = useForm<Values>({
    mode: "onChange",
    defaultValues: { name: wallet },
  })
  const navigate = useNavigate()

  const submit = (values: Values) => {
    const { name } = values
    const validationResult = validate.name.exists(name)

    if (typeof validationResult === "string") {
      // Revert the name to the previously stored wallet name
      setValue("name", wallet ?? "")
      return
    }

    const wallets = getStoredWallets()
    const updatedWallets = wallets.map((w: ResultStoredWallet) =>
      w.name === wallet ? { ...w, name } : w
    )
    storeWallets(updatedWallets)
    navigate(`/manage-wallet/manage/${name}`)
    connect(name)
  }

  return (
    <Form onChange={handleSubmit(submit)}>
      <InputWrapper
        label={t("Wallet Name")}
        error={formState.errors.name?.message}
      >
        <Input
          {...register("name", {
            validate: validate.name,
          })}
          data-testid="wallet-name-input"
        />
      </InputWrapper>
    </Form>
  )
}

export default WalletNameInput
