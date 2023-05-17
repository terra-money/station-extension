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
import { RefetchOptions, queryKey } from "data/query"
import { useQuery } from "react-query"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { useNetwork } from "data/wallet"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { Fee } from "@terra-money/feather.js"
import { es } from "date-fns/locale"

interface Values {
  password: string
}

const ConfirmTx = (props: TxRequest | SignBytesRequest) => {
  const { t } = useTranslation()
  const animation = useThemeAnimation()
  const { wallet, ...auth } = useAuth()
  const { actions } = useRequest()
  const passwordRequired = isWallet.single(wallet)
  const addresses = useInterchainAddresses()
  const network = useNetwork()
  const lcd = useInterchainLCDClient()

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

  const { data: estimatedGas, ...estimatedGasState } = useQuery(
    [queryKey.tx.create, props],
    async () => {
      if (!("tx" in props)) return 0
      const { tx } = props

      try {
        if (!addresses || !addresses[tx.chainID] || !network[tx.chainID])
          return 0
        const { baseAsset, gasPrices } = network[tx.chainID]

        const feeDenom =
          baseAsset in gasPrices ? baseAsset : Object.keys(gasPrices)[0]

        const unsignedTx = await lcd.tx.create(
          [{ address: addresses[tx.chainID] }],
          {
            ...tx,
            feeDenoms: [feeDenom],
          }
        )

        return unsignedTx.auth_info.fee.gas_limit
      } catch (error) {
        console.error(error)
        return 200_000
      }
    },
    {
      ...RefetchOptions.INFINITY,
      // To handle sequence mismatch
      retry: 3,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      enabled: "tx" in props && !props.tx.fee?.gas_limit,
    }
  )

  const navigate = useNavigate()
  const toPostMultisigTx = useToPostMultisigTx()
  const submit = async ({ password }: Values) => {
    setSubmitting(true)

    if ("tx" in props) {
      const { requestType, tx, signMode } = props
      const txOptions = tx

      if (!txOptions.fee?.gas_limit && network[tx.chainID]) {
        const { baseAsset, gasPrices, gasAdjustment } = network[tx.chainID]
        const gas = (estimatedGas ?? 0) * gasAdjustment

        const feeDenom =
          baseAsset in gasPrices ? baseAsset : Object.keys(gasPrices)[0]

        txOptions.fee = new Fee(gas, { [feeDenom]: gasPrices[feeDenom] * gas })
      }
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

  if (estimatedGasState.isLoading) {
    return (
      <Overlay>
        <FlexColumn gap={20}>
          <img {...SIZE} src={animation} alt={t("Estimating fees...")} />
          <p>{t("Estimating fees...")}</p>
        </FlexColumn>
      </Overlay>
    )
  }

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
