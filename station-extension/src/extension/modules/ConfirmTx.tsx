import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { getErrorMessage } from "utils/error"
import { useThemeAnimation } from "data/settings/Theme"
import { FlexColumn } from "components/layout"
import Overlay from "app/components/Overlay"
import useToPostMultisigTx from "pages/multisig/utils/useToPostMultisigTx"
import { isWallet, useAuth } from "auth"
import { getOpenURL } from "../storage"
import { getIsDangerousTx, SignBytesRequest, TxRequest } from "../utils"
import { useRequest } from "../RequestContainer"
import ExtensionPage from "../components/ExtensionPage"
import TxDetails from "./TxDetails"
import OriginCard from "extension/components/OriginCard"
import { RefetchOptions, queryKey } from "data/query"
import { useQuery, useQueryClient } from "react-query"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { useChainID, useNetwork } from "data/wallet"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { Fee } from "@terra-money/feather.js"
import SignBytesDetails from "./SignBytesDetails"
import {
  Banner,
  Button,
  ButtonInlineWrapper,
  Checkbox,
  Form,
  Input,
  InputWrapper,
  SubmitButton,
  SummaryHeader,
} from "@terra-money/station-ui"
import styles from "./ConfirmTx.module.scss"
import {
  getStoredPassword,
  setShouldStorePassword,
  shouldStorePassword,
  storePassword,
} from "auth/scripts/keystore"
import { useNetworks } from "app/InitNetworks"

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
  const { networksLoading } = useNetworks()
  const lcd = useInterchainLCDClient()
  const terraChainID = useChainID()
  const queryClient = useQueryClient()
  const chainID =
    "tx" in props ? props.tx?.chainID ?? terraChainID : terraChainID

  const [isRelaoding, setReloading] = useState(false)
  /* form */
  const form = useForm<Values>({
    defaultValues: { password: "" },
  })

  const { register, setValue, watch, handleSubmit } = form
  const { password } = watch()

  /* store password */
  const [rememberPassword, setStorePassword] = useState(shouldStorePassword())
  const [areFeesReady, setFeesReady] = useState(!("tx" in props))
  const [showPasswordInput, setShowPasswordInput] = useState(false)

  useEffect(() => {
    getStoredPassword().then((password) => {
      setValue("password", password ?? "")
      setShowPasswordInput(!password)
    })
  }, [setValue])

  /* submit */
  const [incorrect, setIncorrect] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  const { data: estimatedGas, ...estimatedGasState } = useQuery(
    [
      queryKey.tx.create,
      "tx" in props &&
        props.tx.msgs.map((m) => m.toData(network[chainID]?.isClassic)),
      addresses?.[chainID],
      network[chainID],
    ],
    async () => {
      if (!("tx" in props)) return 0
      const { tx } = props

      try {
        if (!addresses || !addresses[tx?.chainID] || !network[tx?.chainID])
          return 0
        const { baseAsset, gasPrices } = network[tx?.chainID]

        const feeDenom =
          baseAsset in gasPrices ? baseAsset : Object.keys(gasPrices ?? {})[0]

        const unsignedTx = await lcd.tx.create(
          [{ address: addresses[tx?.chainID] }],
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
      //retry: 3,
      //retryDelay: 1000,
      refetchOnWindowFocus: false,
      enabled:
        "tx" in props && !props.tx.fee?.gas_limit && !!addresses?.[chainID],
    }
  )

  let fee: Fee | undefined

  if ("tx" in props && network[props.tx?.chainID]) {
    const { tx } = props
    fee = tx.fee
    if (!tx.fee?.gas_limit) {
      const { baseAsset, gasPrices, gasAdjustment } = network[tx?.chainID]
      const gas = Math.ceil((estimatedGas ?? 0) * gasAdjustment)

      const feeDenom =
        baseAsset in gasPrices ? baseAsset : Object.keys(gasPrices ?? {})[0]

      fee = new Fee(gas, { [feeDenom]: Math.ceil(gasPrices[feeDenom] * gas) })
    }
  }

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
    let failed = false

    if ("tx" in props) {
      const { requestType, tx, signMode } = props
      const txOptions = { ...tx, fee }

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
          actions.tx(requestType, props, response)
        }
      } catch (error) {
        const message = (error as any)?.message
        const isPasswordError =
          typeof message === "string" &&
          message.toLowerCase().includes("password")
        if (isPasswordError) {
          failed = true
          setIncorrect(message)
        } else {
          const message = getErrorMessage(error)
          const response = { success: false, error: { code: 3, message } }
          actions.tx(requestType, props, response)
        }
      }
    } else {
      // arbitrary data
      const { requestType, bytes } = props

      try {
        if (disabled) throw new Error(disabled)
        const result = await auth.signBytes(bytes, password)
        const response = { result, success: true }
        actions.tx(requestType, props, response)
      } catch (error) {
        const message = (error as any)?.message
        const isPasswordError =
          typeof message === "string" &&
          message.toLowerCase().includes("password")
        if (isPasswordError) {
          failed = true
          setIncorrect(message)
        } else {
          const message = getErrorMessage(error)
          const response = { success: false, error: { code: 3, message } }
          actions.tx(requestType, props, response)
        }
      }
    }

    if (passwordRequired && !failed) {
      if (rememberPassword) {
        setShouldStorePassword(true)
        storePassword(password)
      } else {
        setShouldStorePassword(false)
      }
    }

    setSubmitting(false)
  }

  const deny = (msg?: string) => {
    const { requestType } = props
    const message = msg ?? t("User denied")
    const response = { success: false, error: { code: 1, message } }
    actions.tx(requestType, props, response)
  }

  const warning = {
    post: "",
    sign: "",
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

  if (submitting || (networksLoading && !network[chainID])) {
    return (
      <Overlay>
        <FlexColumn gap={20}>
          <img {...SIZE} src={animation} alt={t("Loading...")} />
          {networksLoading && t("Loading...")}
        </FlexColumn>
      </Overlay>
    )
  }

  if (!networksLoading && !network[chainID]) {
    return (
      <ExtensionPage>
        <article className={styles.error__container}>
          <SummaryHeader
            statusLabel={t("Error")}
            statusMessage={t(
              "The requested network ({{chainID}}) is temporarily disabled.",
              { chainID }
            )}
            status={"alert"}
          />
          <ButtonInlineWrapper>
            <Button
              variant="secondary"
              onClick={() => {
                queryClient.invalidateQueries(queryKey.tendermint.nodeInfo)
                setReloading(true)
                setTimeout(() => setReloading(false), 3_000)
              }}
              loading={isRelaoding}
              label={isRelaoding ? t("Loading...") : t("Try again")}
            />
            <Button
              variant="warning"
              onClick={() => deny(t("Network unavailable, user denied."))}
              label={t("Reject tx")}
            />
          </ButtonInlineWrapper>
        </article>
      </ExtensionPage>
    )
  }

  return (
    <ExtensionPage>
      <article className={styles.container}>
        <div>
          <OriginCard hostname={props.origin} />

          {"tx" in props && (
            <TxDetails
              {...props}
              tx={{ ...props.tx, fee }}
              onFeesReady={(state) => setFeesReady(state)}
            />
          )}
          {"bytes" in props && <SignBytesDetails {...props} />}
        </div>

        <FlexColumn gap={24} className={styles.buttons__container}>
          {warning && <Banner variant="warning" title={warning} />}
          {error && <Banner variant="error" title={error} />}

          <Form onSubmit={handleSubmit(submit)}>
            {passwordRequired && showPasswordInput && !incorrect && (
              <>
                <InputWrapper label={t("Password")} error={incorrect}>
                  <Input type="password" {...register("password")} autoFocus />
                </InputWrapper>

                <Checkbox
                  checked={rememberPassword}
                  onChange={() => setStorePassword(!rememberPassword)}
                  label={t("Save password")}
                />
              </>
            )}
            <ButtonInlineWrapper>
              <Button
                variant="secondary"
                onClick={() => deny()}
                label={t("Reject")}
              />
              <SubmitButton
                variant="primary"
                label={label}
                disabled={!areFeesReady}
              />
            </ButtonInlineWrapper>
          </Form>
        </FlexColumn>
      </article>
    </ExtensionPage>
  )
}

export default ConfirmTx
