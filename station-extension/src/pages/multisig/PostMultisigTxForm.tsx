import {
  Copy,
  Input,
  InputWrapper,
  ProgressBar,
  SectionHeader,
  SubmitButton,
  TextArea,
} from "@terra-money/station-ui"
import {
  LegacyAminoMultisigPublicKey,
  MultiSignature,
  SignatureV2,
  SimplePublicKey,
} from "@terra-money/feather.js"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { AccAddress, isTxError } from "@terra-money/feather.js"
import { Form, FormError, FormGroup } from "components/form"
import { useFieldArray, useForm } from "react-hook-form"
import { SAMPLE_ENCODED_TX } from "./utils/placeholder"
import { truncate } from "@terra-money/terra-utils"
import { SAMPLE_ADDRESS } from "config/constants"
import styles from "./MultisigTxForm.module.scss"
import { latestTxState } from "data/queries/tx"
import { useTranslation } from "react-i18next"
import validate from "auth/scripts/validate"
import { useSetRecoilState } from "recoil"
import { useChainID } from "data/wallet"
import { useState } from "react"
import ReadTx from "./ReadTx"

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
  const { register, control, watch, handleSubmit, formState, setValue } = form
  const { isValid } = formState
  const { tx } = watch()
  const { signatures } = watch()
  const signaturesWithTextCount = signatures.filter(
    (sig) => sig.signature.trim() !== ""
  ).length

  const isSignatureThreshold = signaturesWithTextCount >= publicKey.threshold
  const isFormValid = isValid && isSignatureThreshold

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
        extra={tx ? <Copy copyText={tx} /> : null}
      >
        <TextArea
          value={tx}
          onChange={(e) => setValue("tx", e.target.value)}
          placeholder={SAMPLE_ENCODED_TX}
          rows={4}
        />
      </InputWrapper>

      <ReadTx tx={tx.trim()}>
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

        <ProgressBar
          labelOverride="Threshold"
          data={[
            {
              type: "yes",
              percent: `${100 * (signaturesWithTextCount / fields.length)}%`,
            },
          ]}
          threshold={100 * (publicKey.threshold / fields.length)}
        />

        {error && <FormError>{error.message}</FormError>}
      </ReadTx>

      <SectionHeader title={t("Confirm")} withLine />

      <SubmitButton
        label={"Submit"}
        loading={submitting}
        disabled={!isFormValid}
      />
    </Form>
  )
}

export default PostMultisigTxForm
