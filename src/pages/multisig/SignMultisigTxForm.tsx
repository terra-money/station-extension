import {
  Checkbox,
  Copy,
  Grid,
  Input,
  InputWrapper,
  SectionHeader,
  SubmitButton,
  SummaryHeader,
  TextArea,
} from "@terra-money/station-ui"
import { getStoredPassword, shouldStorePassword } from "auth/scripts/keystore"
import { AccAddress, SignatureV2 } from "@terra-money/feather.js"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { SAMPLE_ENCODED_TX } from "./utils/placeholder"
import { Form, FormError } from "components/form"
import { SAMPLE_ADDRESS } from "config/constants"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import validate from "auth/scripts/validate"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { isWallet, useAuth } from "auth"
import { useChainID } from "data/wallet"
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
  const navigate = useNavigate()

  /* form */
  const form = useForm<TxValues>({ mode: "onChange", defaultValues })
  const { register, watch, handleSubmit, formState } = form
  const { isValid } = formState
  const { tx } = watch()

  /* submit */
  const passwordRequired = isWallet.single(wallet)
  const [password, setPassword] = useState("")
  const [rememberPassword, setRememberPassword] = useState(
    shouldStorePassword()
  )
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [incorrect, setIncorrect] = useState<string>()

  // autofill stored password if exists
  useEffect(() => {
    getStoredPassword().then((password) => {
      setPassword(password ?? "")
      setShowPasswordInput(!password)
    })
  }, []) // eslint-disable-line

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

  if (signature) {
    return (
      <Grid gap={40} style={{ marginTop: 20 }}>
        <SummaryHeader
          statusLabel={"Success!"}
          statusMessage={"Signature generated"}
          status={"success"}
        />
        {signature && (
          <InputWrapper
            label={t("Signature")}
            extra={<Copy copyText={toBytes(signature)} />}
          >
            <TextArea readOnly={true} value={toBytes(signature)} rows={10} />
          </InputWrapper>
        )}
        <SubmitButton onClick={() => navigate("/")}>{"Done"}</SubmitButton>
      </Grid>
    )
  }

  return (
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
          rows={4}
        />
      </InputWrapper>
      <ReadTx tx={tx.trim()} />

      <SectionHeader title="Confirm" withLine />

      {passwordRequired && showPasswordInput && !incorrect && (
        <>
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

          <InputWrapper>
            <Checkbox
              label={t("Save password")}
              checked={rememberPassword}
              onChange={() => setRememberPassword((r) => !r)}
            />
          </InputWrapper>
        </>
      )}

      {error && <FormError>{error.message}</FormError>}

      <SubmitButton loading={submitting} disabled={!isValid}>
        {submittingLabel}
      </SubmitButton>
    </Form>
  )
}

export default SignMultisigTxForm

/* utils */
const toBytes = (signature: SignatureV2) => {
  const string = JSON.stringify(signature.toData())
  return Buffer.from(string).toString("base64")
}
