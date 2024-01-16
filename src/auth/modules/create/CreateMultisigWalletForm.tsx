import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useFieldArray, useForm } from "react-hook-form"
import axios from "axios"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { AccAddress, SimplePublicKey } from "@terra-money/feather.js"
import { LegacyAminoMultisigPublicKey } from "@terra-money/feather.js"
import { SAMPLE_ADDRESS } from "config/constants"
import { getErrorMessage } from "utils/error"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { Form } from "components/form"
import validate from "auth/scripts/validate"
import {
  MultiInputWrapper,
  Input,
  Button,
  InputWrapper,
  Banner,
  SubmitButton,
  ButtonInlineWrapper,
} from "@terra-money/station-ui"
import { wordsFromAddress } from "utils/bech32"
import { truncate } from "@terra-money/terra-utils"
import { addMultisigWallet } from "auth/scripts/keystore"

interface Values {
  name: string
  addresses: { value: AccAddress }[]
  threshold: number
}

interface Props {
  onCreated?: (publicKey: MultisigWallet) => void
  onPubkey?: (data: {
    pubkeys: string[]
    threshold: number
    words: { "330": string }
  }) => void
  onBack?: () => void
}

const CreateMultisigWalletForm = ({ onCreated, onPubkey, onBack }: Props) => {
  const { t } = useTranslation()
  const lcd = useInterchainLCDClient()

  /* form */
  const defaultValues = {
    addresses: [{ value: "" }, { value: "" }, { value: "" }],
    threshold: 2,
  }

  const form = useForm<Values>({ mode: "onChange", defaultValues })

  const { register, control, handleSubmit, formState } = form
  const { errors, isValid } = formState

  const fieldArray = useFieldArray({ control, name: "addresses" })
  const { fields, append, remove } = fieldArray

  const [error, setError] = useState<Error>()

  /* query */
  const getPublicKey = async (address: AccAddress) => {
    const accountInfo = await lcd.auth.accountInfo(address)
    const publicKey = accountInfo.getPublicKey()
    if (!publicKey) throw new Error(`Public key is null: ${address}`)
    return publicKey
  }

  const getPublicKeys = async (addresses: AccAddress[]) => {
    const results = await Promise.allSettled(addresses.map(getPublicKey))

    return results.map((result) => {
      if (result.status === "rejected") {
        const message = axios.isAxiosError(result.reason)
          ? getErrorMessage(result.reason)
          : result.reason

        throw new Error(message)
      }

      return result.value as SimplePublicKey
    })
  }

  /* submit */
  const [submitting, setSubmitting] = useState(false)

  const submit = async ({ addresses, threshold, name }: Values) => {
    setSubmitting(true)

    try {
      const values = addresses.map(({ value }) => value)
      const pubkeys = await getPublicKeys(values)
      const publicKey = new LegacyAminoMultisigPublicKey(threshold, pubkeys)
      const address = publicKey.address("terra")
      const words = { "330": wordsFromAddress(address) }
      onPubkey?.({
        pubkeys: pubkeys.map((k) => k.toAminoJSON()),
        threshold,
        words,
      })

      if (!onCreated) {
        setSubmitting(false)
        return
      }
      const wallet = {
        name,
        words,
        multisig: true as const,
        pubkeys: pubkeys.map((k) => k.toAminoJSON()),
        threshold,
      }
      addMultisigWallet(wallet)
      onCreated(wallet)
    } catch (error) {
      setError(error as Error)
    }

    setSubmitting(false)
  }

  /* render */
  const length = fields.length
  return (
    <Form onSubmit={handleSubmit(submit)}>
      {onCreated && (
        <InputWrapper label={t("Wallet Name")} error={errors.name?.message}>
          <Input
            {...register("name", { validate: validate.name })}
            autoFocus
            placeholder="e.g. 'my-multisig-wallet'"
          />
        </InputWrapper>
      )}
      {!onPubkey && (
        <Banner
          variant="warning"
          title={t(
            "All wallets must have enough coins or tokens to cover gas fees."
          )}
        />
      )}

      <MultiInputWrapper label={t("Wallets")} layout="vertical">
        {fields.map(({ id }, index) => (
          <Input
            {...register(`addresses.${index}.value`, {
              validate: validate.address,
            })}
            placeholder={truncate(SAMPLE_ADDRESS, [14, 5])}
            key={id}
            actionIcon={
              fields.length > 2
                ? {
                    icon: <DeleteOutlineIcon />,
                    onClick: () => remove(index),
                  }
                : undefined
            }
          />
        ))}

        <Button variant="dashed" onClick={() => append({ value: "" })}>
          {t("Add Wallet Address")}
        </Button>
      </MultiInputWrapper>

      <InputWrapper label={t("Threshold")} error={errors.threshold?.message}>
        <Input
          {...register("threshold", {
            valueAsNumber: true,
            validate: validate.index,
          })}
          placeholder={String(Math.ceil(length / 2))}
        />
      </InputWrapper>

      {error && <Banner variant="error" title={error.message} />}

      <ButtonInlineWrapper>
        {!!onBack && (
          <Button
            variant="secondary"
            label={t("Back")}
            onClick={() => onBack()}
          />
        )}
        <SubmitButton
          loading={submitting}
          disabled={!isValid}
          label={t("Create")}
        />
      </ButtonInlineWrapper>
    </Form>
  )
}

export default CreateMultisigWalletForm
