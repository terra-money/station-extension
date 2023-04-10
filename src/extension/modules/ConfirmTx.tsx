import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { getErrorMessage } from "utils/error"
import { useThemeAnimation } from "data/settings/Theme"
import { FlexColumn, Grid } from "components/layout"
import { Form, FormError, FormItem, FormWarning } from "components/form"
import { Input, Checkbox } from "components/form"
import Overlay from "app/components/Overlay"
import useToPostMultisigTx from "pages/multisig/utils/useToPostMultisigTx"
import { isWallet, useAuth } from "auth"
import { PasswordError } from "auth/scripts/keystore"
import { getOpenURL, getStoredPassword } from "../storage"
import { getIsDangerousTx, SignBytesRequest, TxRequest } from "../utils"
import { useRequest } from "../RequestContainer"
import ExtensionPage from "../components/ExtensionPage"
import ConfirmButtons from "../components/ConfirmButtons"
import TxDetails from "./TxDetails"
import OriginCard from "extension/components/OriginCard"

interface Values {
  password: string
}

const ConfirmTx = (props: TxRequest | SignBytesRequest) => {
  const { t } = useTranslation()
  const animation = useThemeAnimation()
  const { wallet, ...auth } = useAuth()
  const { actions } = useRequest()
  const passwordRequired = isWallet.single(wallet)

  /* form */
  const form = useForm<Values>({
    defaultValues: { password: "" },
  })

  const { register, setValue, watch, handleSubmit } = form
  const { password } = watch()

  /* store password */
  const [storePassword, setStorePassword] = useState(false)
  const nextPassword = storePassword ? password : ""

  useEffect(() => {
    getStoredPassword((password) => {
      setValue("password", password)
      setStorePassword(!!password)
    })
  }, [setValue])

  /* submit */
  const [incorrect, setIncorrect] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  const disabled =
    "tx" in props && getIsDangerousTx(props.tx)
      ? t("Dangerous tx")
      : passwordRequired && !password
      ? t("Enter password")
      : ""

  const navigate = useNavigate()
  const toPostMultisigTx = useToPostMultisigTx()
  const submit = async ({ password }: Values) => {
    setSubmitting(true)

    if ("tx" in props) {
      const { requestType, tx, signMode } = props
      const txOptions = tx

      try {
        if (disabled) throw new Error(disabled)

        if (isWallet.multisig(wallet)) {
          const unsignedTx = await auth.create(txOptions)
          const { pathname, search } = toPostMultisigTx(unsignedTx)
          const openURL = getOpenURL([pathname, search].join("?"))
          actions.multisigTx(props)
          if (openURL) openURL()
          else navigate({ pathname, search })
        } else {
          const result = await auth[requestType](txOptions, password, signMode)
          const response = { result, success: true }
          actions.tx(requestType, props, response, nextPassword)
        }
      } catch (error) {
        if (error instanceof PasswordError) {
          setIncorrect(error.message)
        } else {
          const message = getErrorMessage(error)
          const response = { success: false, error: { code: 3, message } }
          actions.tx(requestType, props, response, nextPassword)
        }
      }
    } else {
      // arbitrary data
      const { requestType, bytes } = props

      try {
        if (disabled) throw new Error(disabled)
        const result = await auth.signBytes(bytes, password)
        const response = { result, success: true }
        actions.tx(requestType, props, response, nextPassword)
      } catch (error) {
        if (error instanceof PasswordError) {
          setIncorrect(error.message)
        } else {
          const message = getErrorMessage(error)
          const response = { success: false, error: { code: 3, message } }
          actions.tx(requestType, props, response, nextPassword)
        }
      }
    }

    setSubmitting(false)
  }

  const deny = () => {
    const { requestType } = props
    const message = t("User denied")
    const response = { success: false, error: { code: 1, message } }
    actions.tx(requestType, props, response, nextPassword)
  }

  const warning = {
    post: "",
    sign: t(
      "The Transaction signing is requested. Confirm if it is from a verified origin."
    ),
    signBytes: t("Signing of an arbitrary data is requested"),
  }[props.requestType]

  const error =
    props.requestType === "signBytes" &&
    isWallet.ledger(wallet) &&
    t("Arbitrary data cannot be signed by Ledger")

  const SIZE = { width: 100, height: 100 }
  const label = props.requestType === "post" ? t("Post") : t("Sign")

  return submitting ? (
    <Overlay>
      <FlexColumn gap={20}>
        <img {...SIZE} src={animation} alt={t("Submitting...")} />
        {isWallet.ledger(wallet) && <p>{t("Confirm in ledger")}</p>}
      </FlexColumn>
    </Overlay>
  ) : (
    <ExtensionPage header={<OriginCard hostname={props.origin} />}>
      <Grid gap={20}>
        {"tx" in props && <TxDetails {...props} />}

        {warning && <FormWarning>{warning}</FormWarning>}
        {error && <FormError>{error}</FormError>}

        <Form onSubmit={handleSubmit(submit)}>
          {passwordRequired && (
            <Grid gap={4}>
              <FormItem label={t("Password")} error={incorrect}>
                <Input type="password" {...register("password")} autoFocus />
              </FormItem>

              <Checkbox
                checked={storePassword}
                onChange={() => setStorePassword(!storePassword)}
              >
                {t("Save password")}
              </Checkbox>
            </Grid>
          )}

          <ConfirmButtons
            buttons={[
              { onClick: deny, children: t("Deny") },
              { type: "submit", children: label },
            ]}
          />
        </Form>
      </Grid>
    </ExtensionPage>
  )
}

export default ConfirmTx
