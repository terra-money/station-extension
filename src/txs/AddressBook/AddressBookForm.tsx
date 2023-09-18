import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import PersonIcon from "@mui/icons-material/Person"
import { truncate } from "@terra-money/terra-utils"
import { useAddressBook } from "data/settings/AddressBook"
import { InlineFlex } from "components/layout"
import validate from "txs/validate"
import { useEffect } from "react"
import { Checkbox, Form, InputWrapper, Input, SubmitButton } from "station-ui"

interface Props {
  item?: AddressBook
  close: () => void
  index?: number
}

const AddressBookForm = (props: Props) => {
  const { t } = useTranslation()
  const { edit, add } = useAddressBook()
  const { item, close, index } = props

  /* form */
  const form = useForm<AddressBook>({ mode: "onChange" })
  const { register, handleSubmit, formState } = form
  const { errors } = formState

  useEffect(() => {
    form.reset(item)
  }, [item, form])

  const submit = (values: AddressBook) => {
    if (index !== undefined) edit(values, index)
    else add(values)
    close()
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <InputWrapper label={t("Name")} error={errors.name?.message}>
        <Input
          {...register("name", {
            required: true,
          })}
        />
      </InputWrapper>

      <InputWrapper label={t("Address")} error={errors.recipient?.message}>
        <Input {...register("recipient", { validate: validate.recipient() })} />
      </InputWrapper>

      <InputWrapper
        label={`${t("Memo")} (${t("optional")})`}
        error={errors.memo?.message}
      >
        <Input
          {...register("memo", {
            validate: {
              size: validate.size(256),
              bracket: validate.memo(),
            },
          })}
        />
      </InputWrapper>
      <InputWrapper>
        <Checkbox label="Mark as Favorite" {...register("favorite")} />
      </InputWrapper>

      <SubmitButton
        label={t("Submit")}
        disabled={!!Object.keys(errors).length}
      />
    </Form>
  )
}

export default AddressBookForm
