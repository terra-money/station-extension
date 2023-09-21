import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import UsbIcon from "@mui/icons-material/Usb"
import BluetoothIcon from "@mui/icons-material/Bluetooth"
import { LedgerKey } from "@terra-money/ledger-station-js"
import { Submit } from "components/form"
import validate from "../scripts/validate"
import useAuth from "../hooks/useAuth"
import { createBleTransport, isBleAvailable } from "utils/ledger"
import { wordsFromAddress } from "utils/bech32"

import styles from "./AccessWithLedger.module.scss"
import { FlexColumn } from "components/layout"
import { TooltipIcon } from "components/display"
import {
  Banner,
  LedgerDeviceAction,
  LedgerModal,
  Checkbox,
  InputWrapper,
  Input,
  Button,
  Form,
} from "station-ui"

interface Values {
  index: number
  bluetooth: boolean
  name: string
}

enum Pages {
  form = "form",
  connect = "connect",
  openTerra = "openTerra",
  askCosmos = "askCosmos",
  openCosmos = "openCosmos",
  selectName = "selectName",
  complete = "complete",
}

const AccessWithLedgerForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { connectLedger } = useAuth()
  const [error, setError] = useState<Error>()
  const [page, setPage] = useState(Pages.form)
  const [words, setWords] = useState<{ 330: string; 118?: string }>({ 330: "" })
  const [pubkey, setPubkey] = useState<{ 330: string; 118?: string }>({
    330: "",
  })

  /* check bluetooth availability */
  const [bleAvailable, setBleAvailable] = useState(false)
  useEffect(() => {
    isBleAvailable().then(setBleAvailable)
  }, [])

  /* form */
  const form = useForm<Values>({
    mode: "onChange",
    defaultValues: { index: 0, bluetooth: false },
  })

  const { register, watch, handleSubmit, formState } = form
  const { errors, isValid, isSubmitting } = formState
  const { index, bluetooth } = watch()

  const submit = async ({ index, bluetooth, name }: Values) => {
    setError(undefined)

    connectLedger(words, pubkey, index, bluetooth, name)
    navigate("/", { replace: true })
  }

  const connectTerra = async () => {
    setError(undefined)
    try {
      // wait until ledger is connected
      setPage(Pages.connect)
      // TODO: might want to use 118 on terra too
      const key330 = await LedgerKey.create({
        transport: bluetooth ? createBleTransport : undefined,
        index,
        onConnect: () => setPage(Pages.openTerra),
      })
      setWords({ "330": wordsFromAddress(key330.accAddress("terra")) })
      // @ts-expect-error
      setPubkey({ "330": key330.publicKey.key })
      setPage(Pages.askCosmos)
    } catch (error) {
      setError(error as Error)
      setPage(Pages.form)
    }
  }

  const connectCosmos = async () => {
    setError(undefined)
    try {
      // wait until ledger is connected
      setPage(Pages.connect)
      // TODO: might want to use 118 on terra too
      const key118 = await LedgerKey.create({
        transport: bluetooth ? createBleTransport : undefined,
        index,
        coinType: 118,
        onConnect: () => setPage(Pages.openCosmos),
      })
      setWords((w) => ({
        ...w,
        "118": wordsFromAddress(key118.accAddress("terra")),
      }))
      // @ts-expect-error
      setPubkey((p) => ({ ...p, "118": key118.publicKey.key }))
      setPage(Pages.complete)
    } catch (error) {
      setError(error as Error)
      setPage(Pages.askCosmos)
    }
  }

  const render = () => {
    switch (page) {
      case Pages.form:
        return (
          <>
            <section className="center">
              {bluetooth ? (
                <>
                  <BluetoothIcon style={{ fontSize: 56 }} />
                  <p>{t("Turn on your Ledger device")}</p>
                </>
              ) : (
                <>
                  <UsbIcon style={{ fontSize: 56 }} />
                  <p>{t("Plug in a Ledger device")}</p>
                </>
              )}
            </section>

            <InputWrapper /* do not translate this */
              label="Index"
              error={errors.index?.message}
              extra={
                <TooltipIcon
                  content={t("BIP 44 index number. For advanced users only")}
                />
              }
            >
              <Input
                {...register("index", {
                  valueAsNumber: true,
                  validate: validate.index,
                })}
              />
            </InputWrapper>

            {index !== 0 && (
              <Banner variant="warning" title={t("Default index is 0")} />
            )}

            {bleAvailable && (
              <Checkbox
                {...register("bluetooth")}
                checked={bluetooth}
                label={t("Use Bluetooth")}
              />
            )}

            {error && <Banner variant="error" title={error.message} />}

            <Button variant="primary" onClick={connectTerra}>
              Connect
            </Button>
          </>
        )
      case Pages.connect:
        return (
          <LedgerModal
            action={
              bluetooth ? LedgerDeviceAction.UNLOCK : LedgerDeviceAction.CONNECT
            }
            appName="Terra"
          />
        )
      case Pages.openTerra:
        return (
          <LedgerModal action={LedgerDeviceAction.OPEN_APP} appName="Terra" />
        )
      case Pages.askCosmos:
        return (
          <section className="center">
            <p>{t("Do you want to import your Cosmos accounts?")}</p>
            <FlexColumn gap={4} className={styles.warningContainer}>
              <Banner
                variant="info"
                title={`${t(
                  "You will need the Cosmos app installed on your Ledger."
                )} ${t(
                  "The device will try to open the cosmos app automatically."
                )}`}
              />
              {error && (
                <Banner
                  variant="error"
                  title={`${error.message}, try again.`}
                />
              )}
            </FlexColumn>

            <Button
              className={styles.mainButton}
              variant="primary"
              onClick={connectCosmos}
            >
              {t("Yes")}
            </Button>
            <p>
              <button
                className={styles.smallButton}
                onClick={() => setPage(Pages.complete)}
              >
                {t("No, I'll use only Terra")}
              </button>
            </p>
          </section>
        )
      case Pages.openCosmos:
        return (
          <LedgerModal action={LedgerDeviceAction.OPEN_APP} appName="Cosmos" />
        )
      case Pages.complete:
        return (
          <section className="center">
            <InputWrapper label={t("Wallet name")} error={errors.name?.message}>
              <Input
                {...register("name", { validate: validate.name })}
                placeholder="Ledger"
                autoFocus
              />
            </InputWrapper>

            <Submit disabled={!isValid} submitting={isSubmitting}>
              {t("Done")}
            </Submit>
          </section>
        )
    }
  }

  return <Form onSubmit={handleSubmit(submit)}>{render()}</Form>
}

export default AccessWithLedgerForm
