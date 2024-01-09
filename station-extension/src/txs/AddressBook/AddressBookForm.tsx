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
  ButtonInlineWrapper,
  FlexColumn,
} from "@terra-money/station-ui"
import DeleteButton from "components/form/DeleteButton"
import { EmojiButton } from "components/form"
import { useLocation, useNavigate } from "react-router-dom"
import styles from "./AddressBook.module.scss"

interface Props {
  item?: AddressBook
  icon?: string
  index?: number
}

const AddressBookForm = (props: Props) => {
  const { t } = useTranslation()
  const { edit, add, list } = useAddressBook()
  const { state } = useLocation()
  const index = state?.index ?? props.index
  const navigate = useNavigate()

  /* form */
  const form = useForm<AddressBook>({ mode: "onChange" })
  const { register, handleSubmit, formState, watch, setValue } = form
  const { errors } = formState
  const { favorite, icon } = watch()
  const close = () => navigate(`/preferences/address-book`)

  useEffect(() => {
    if (index !== undefined) form.reset(list[index])
  }, [index, list, form])

  const submit = (values: AddressBook) => {
    if (index !== undefined) edit(values, index)
    else add(values)
    close()
  }

  const emojiOnClick = (emoji: string) => {
    setValue("icon", emoji)
  }

  return (
    <form
      className={styles.form__container}
      onSubmit={handleSubmit(submit)}
    >
      <FlexColumn gap={24}>
        <InputWrapper label={t("Wallet Name")} error={errors.name?.message}>
          <Input
            actionIcon={{
              icon: <EmojiButton icon={icon} onClick={emojiOnClick} />,
            }}
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
          <Checkbox
            label="Mark as Favorite"
            checked={favorite}
            {...register("favorite")}
          />
        </InputWrapper>
      </FlexColumn>
      <ButtonInlineWrapper>
        {index !== undefined && (
          <DeleteButton
            onClick={() =>
              navigate("/preferences/address-book/delete", { state: { index } })
            }
          />
        )}
        <SubmitButton label={t("Save")} />
      </ButtonInlineWrapper>
    </form>
  )
}

export default AddressBookForm
