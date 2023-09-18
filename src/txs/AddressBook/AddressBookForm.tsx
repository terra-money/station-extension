import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { useAddressBook } from "data/settings/AddressBook"
import validate from "txs/validate"
import { useEffect } from "react"
import {
  Checkbox,
  Form,
  InputWrapper,
  Input,
  SubmitButton,
  Flex,
} from "station-ui"
import DeleteButton from "components/form/DeleteButton"

interface Props {
  item?: AddressBook
  close: () => void
  index?: number // exsisting item index for edit/remove
}

const AddressBookForm = (props: Props) => {
  const { t } = useTranslation()
  const { edit, add, list, remove } = useAddressBook()
  const { close, index } = props

  /* form */
  const form = useForm<AddressBook>({ mode: "onChange" })
  const { register, handleSubmit, formState } = form
  const { errors } = formState

  useEffect(() => {
    if (index !== undefined) form.reset(list[index])
  }, [index, list, form])

  const submit = (values: AddressBook) => {
    if (index !== undefined) edit(values, index)
    else add(values)
    close()
  }
  const deleteOnClick = () => {
    if (index !== undefined) remove(index)
    close()
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <InputWrapper label={t("Wallet Name")} error={errors.name?.message}>
        <Input
          placeholder="my-wallet"
          {...register("name", {
            required: true,
          })}
        />
      </InputWrapper>

      <InputWrapper label={t("Address")} error={errors.recipient?.message}>
        <Input
          {...register("recipient", { validate: validate.recipient() })}
          placeholder="terra1...fzxf"
        />
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
      <Flex gap={28}>
        {index !== undefined && <DeleteButton onClick={deleteOnClick} />}
        <SubmitButton label={t("Save")} />
      </Flex>
    </Form>
  )
}

export default AddressBookForm
