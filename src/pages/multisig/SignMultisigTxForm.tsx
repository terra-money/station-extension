import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { AccAddress, SignatureV2 } from "@terra-money/feather.js"
import { SAMPLE_ADDRESS } from "config/constants"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { Pre } from "components/general"
import { Form, FormError, FormItem } from "components/form"
import { Modal } from "components/feedback"
import { isWallet, useAuth } from "auth"
import { SAMPLE_ENCODED_TX } from "./utils/placeholder"
import ReadTx from "./ReadTx"
import { useChainID } from "data/wallet"
import validate from "auth/scripts/validate"
import {
  // Dropdown,
  Input,
  TextArea,
  // Form,
  InputWrapper,
  // ButtonInlineWrapper,
  SubmitButton,
} from "station-ui"

interface TxValues {
  address: AccAddress
  tx: string
}

interface Props {
  defaultValues: TxValues
}

const SignMultisigTxForm = ({ defaultValues }: Props) => {
  const { t } = useTranslation()
  const { wallet, createSignature } = useAuth()
  const lcd = useInterchainLCDClient()
  const chainID = useChainID()

  /* form */
  const form = useForm<TxValues>({ mode: "onChange", defaultValues })
  const { register, watch, handleSubmit, formState } = form
  const { isValid } = formState
  const { tx } = watch()

  /* submit */
  const passwordRequired = isWallet.single(wallet)
  const [password, setPassword] = useState("")
  const [incorrect, setIncorrect] = useState<string>()

  const [signature, setSignature] = useState<SignatureV2>()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<Error>()

  const submit = async ({ address, tx }: TxValues) => {
    setSubmitting(true)

    try {
      const decoded = lcd.tx.decode(tx.trim())
      if (!decoded) throw new Error("Invalid tx")
      const signature = await createSignature(
        decoded,
        chainID,
        address,
        password
      )
      setSignature(signature)
    } catch (error) {
      if (error instanceof Error) setIncorrect(error.message)
      else setError(error as Error)
    }

    setSubmitting(false)
  }

  const submittingLabel = isWallet.ledger(wallet) ? t("Confirm in ledger") : ""
  console.log(SAMPLE_ENCODED_TX)

  return (
    <>
      <Form onSubmit={handleSubmit(submit)}>
        <InputWrapper label={t("Multisig Address")}>
          <Input
            {...register("address", {
              validate: validate.address,
            })}
            placeholder={SAMPLE_ADDRESS}
            autoFocus
          />
        </InputWrapper>
        <InputWrapper label={t("Hashed Transaction")}>
          <TextArea
            {...register("tx", { required: true })}
            placeholder={SAMPLE_ENCODED_TX}
            rows={6}
          />
        </InputWrapper>
        <ReadTx tx={tx.trim()} />
        {passwordRequired && (
          <InputWrapper label={t("Password")} error={incorrect}>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setIncorrect(undefined)
                setPassword(e.target.value)
              }}
            />
          </InputWrapper>
        )}

        {error && <FormError>{error.message}</FormError>}

        <SubmitButton disabled={!isValid}>{"Sign Transaction"}</SubmitButton>
      </Form>

      {signature && (
        <Modal
          title={t("Signature")}
          isOpen
          onRequestClose={() => setSignature(undefined)}
        >
          <Pre normal break copy>
            {toBytes(signature)}
          </Pre>
        </Modal>
      )}
    </>
  )
}

export default SignMultisigTxForm

/* utils */
const toBytes = (signature: SignatureV2) => {
  const string = JSON.stringify(signature.toData())
  return Buffer.from(string).toString("base64")
}
