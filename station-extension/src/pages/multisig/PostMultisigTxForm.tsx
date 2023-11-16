import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useFieldArray, useForm } from "react-hook-form"
import { useSetRecoilState } from "recoil"
import { AccAddress, isTxError } from "@terra-money/feather.js"
import { LegacyAminoMultisigPublicKey } from "@terra-money/feather.js"
import { SimplePublicKey } from "@terra-money/feather.js"
import { SignatureV2, MultiSignature } from "@terra-money/feather.js"
import { SAMPLE_ADDRESS } from "config/constants"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { latestTxState } from "data/queries/tx"
import { Form, FormError, FormGroup, FormItem } from "components/form"
import {
  Copy,
  Input,
  TextArea,
  InputWrapper,
  SubmitButton,
  SectionHeader,
} from "station-ui"
import { Submit } from "components/form"
import { SAMPLE_ENCODED_TX, SAMPLE_SIGNATURE } from "./utils/placeholder"
import ReadTx from "./ReadTx"
import { useChainID } from "data/wallet"
import validate from "auth/scripts/validate"
import { truncate } from "@terra-money/terra-utils"
import styles from "./MultisigTxForm.module.scss"

interface Values {
  address: AccAddress
  tx: string
  signatures: SignatureValue[]
}

interface SignatureValue {
  address: string
  publicKey: SimplePublicKey.Data
  signature: string
}

interface Props {
  publicKey: LegacyAminoMultisigPublicKey
  sequence: number
  defaultValues: Values
}

const PostMultisigTxForm = ({ publicKey, sequence, ...props }: Props) => {
  // TODO: multisig is available only on terra, we need to handle it
  const { defaultValues } = props
  const { t } = useTranslation()
  const chainID = useChainID()

  /* form */
  const form = useForm<Values>({ mode: "onChange", defaultValues })
  const { register, control, watch, handleSubmit, formState } = form
  const { isValid } = formState
  const { tx } = watch()

  const fieldArray = useFieldArray({ control, name: "signatures" })
  const { fields } = fieldArray

  /* submit */
  const lcd = useInterchainLCDClient()
  const setLatestTx = useSetRecoilState(latestTxState)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<Error>()

  const getSignature = (signature: string) => {
    const data = JSON.parse(Buffer.from(signature.trim(), "base64").toString())
    return SignatureV2.fromData(data)
  }

  const submit = async ({ signatures, tx: encoded }: Values) => {
    setSubmitting(true)
    setError(undefined)

    try {
      const tx = lcd.tx.decode(encoded.trim())
      if (!tx) throw new Error("Invalid tx")

      // signatures
      const multisig = new MultiSignature(publicKey)
      const values = signatures
        .filter(({ signature }) => signature)
        .map(({ signature }) => signature)

      multisig.appendSignatureV2s(values.map(getSignature))

      // signatures >> tx
      const descriptor = multisig.toSignatureDescriptor()
      tx.appendSignatures([new SignatureV2(publicKey, descriptor, sequence)])

      // broadcast
      const result = await lcd.tx.broadcastSync(tx, chainID)
      if (isTxError(result)) throw new Error(result.raw_log)
      setLatestTx({ txhash: result.txhash, chainID: "phoenix-1" })
    } catch (error) {
      setError(error as Error)
    }

    setSubmitting(false)
  }

  console.log(SAMPLE_ENCODED_TX)

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
      <InputWrapper
        label={t("Hashed Transaction")}
        extra={<Copy copyText={tx} />}
      >
        <TextArea
          {...register("tx", { required: true })}
          placeholder={SAMPLE_ENCODED_TX}
          rows={4}
        />
      </InputWrapper>

      <SectionHeader title={t("Signatures")} withLine />

      {fields.map(({ address, id }, index) => (
        <FormGroup key={id}>
          <InputWrapper label={truncate(address, [13, 6])}>
            <TextArea
              {...register(`signatures.${index}.signature`)}
              rows={2}
              autoFocus={!index}
            />
          </InputWrapper>
        </FormGroup>
      ))}

      {error && <FormError>{error.message}</FormError>}

      <ReadTx tx={tx.trim()} />

      <SectionHeader title={t("Confirm")} withLine />

      <SubmitButton label={"Submit"} loading={submitting} disabled={!isValid} />
    </Form>
  )
}

export default PostMultisigTxForm
