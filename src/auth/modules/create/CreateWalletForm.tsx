import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { Grid } from "components/layout"
import { Form, Submit, Value } from "components/form"
import validate from "auth/scripts/validate"
import { TooltipIcon } from "components/display"
import { useCreateWallet, Values as DefaultValues } from "./CreateWalletWizard"
import { Banner, Copy, InputWrapper, Input, Checkbox } from "station-ui"

interface Values extends DefaultValues {
  confirm: string
  checked?: boolean
}

const CreateWalletForm = () => {
  const { t } = useTranslation()
  const { setStep, generated, values, setValues } = useCreateWallet()

  /* form */
  const form = useForm<Values>({
    mode: "onChange",
    defaultValues: { ...values, confirm: "", checked: false },
  })

  const { register, watch, handleSubmit, formState, reset } = form
  const { errors, isValid } = formState
  const { password, mnemonic, index, checked } = watch()

  useEffect(() => {
    return () => reset()
  }, [reset])

  const submit = ({ name, password, mnemonic, index }: Values) => {
    setValues({ name, password, mnemonic: mnemonic.trim(), index })
    setStep(2)
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <InputWrapper label={t("Wallet Name")} error={errors.name?.message}>
        <Input {...register("name", { validate: validate.name })} autoFocus />
      </InputWrapper>

      <InputWrapper label={t("Password")} error={errors.password?.message}>
        <Input
          {...register("password", { validate: validate.password })}
          type="password"
        />
      </InputWrapper>

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

      <InputWrapper
        label={t("Mnemonic seed")}
        error={errors.mnemonic?.message}
        extra={generated && <Copy copyText={mnemonic} />}
      >
        {generated ? (
          <Value>{mnemonic}</Value>
        ) : (
          <Input
            type="password"
            {...register("mnemonic", { validate: validate.mnemonic })}
          />
        )}
      </InputWrapper>

      {!generated && (
        <InputWrapper /* do not translate this */
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

      {generated && (
        <>
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
      )}

      <Submit disabled={!isValid} variant="secondary">
        {t("Create Wallet")}
      </Submit>
    </Form>
  )
}

export default CreateWalletForm
