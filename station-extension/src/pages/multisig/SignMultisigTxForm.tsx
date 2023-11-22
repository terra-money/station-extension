import {
  Copy,
  Input,
  InputWrapper,
  ModalButton,
  SectionHeader,
  SubmitButton,
  SummaryHeader,
  TextArea,
} from "station-ui"
import { AccAddress, SignatureV2 } from "@terra-money/feather.js"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { SAMPLE_ENCODED_TX } from "./utils/placeholder"
import { Form, FormError } from "components/form"
import { SAMPLE_ADDRESS } from "config/constants"
import styles from "./MultisigTxForm.module.scss"
import { useTranslation } from "react-i18next"
import validate from "auth/scripts/validate"
import { useForm } from "react-hook-form"
import { isWallet, useAuth } from "auth"
import { useChainID } from "data/wallet"
import { useState } from "react"
import ReadTx from "./ReadTx"

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
    setSignature(undefined)
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

  const submittingLabel = isWallet.ledger(wallet)
    ? t("Confirm in ledger")
    : "Generate Signature"

  const submitButton = (
    <SubmitButton loading={submitting} disabled={!isValid}>
      {submittingLabel}
    </SubmitButton>
  )

  return (
    <Form onSubmit={handleSubmit(submit)} className={styles.form}>
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
          rows={4}
        />
      </InputWrapper>
      <ReadTx tx={tx.trim()} />

      <SectionHeader title="Confirm" withLine />

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

      <ModalButton
        isOpen={!!signature}
        closeIcon={undefined}
        renderButton={(open) => submitButton}
        footer={(close) => (
          <SubmitButton className={styles.donebutton} onClick={close}>
            {"Done"}
          </SubmitButton>
        )}
      >
        <div className={styles.signaturemodal}>
          <SummaryHeader
            statusLabel={"Success!"}
            statusMessage={"Signature generated"}
            status={"success"}
          />
          <br />
          {signature && (
            <InputWrapper
              label={t("Signature")}
              extra={<Copy copyText={toBytes(signature)} />}
            >
              <TextArea readOnly={true} value={toBytes(signature)} rows={10} />
            </InputWrapper>
          )}
        </div>
      </ModalButton>
    </Form>
  )
}

export default SignMultisigTxForm

/* utils */
const toBytes = (signature: SignatureV2) => {
  const string = JSON.stringify(signature.toData())
  return Buffer.from(string).toString("base64")
}
