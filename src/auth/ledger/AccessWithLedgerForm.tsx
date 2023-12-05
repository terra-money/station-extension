import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { LedgerKey } from "@terra-money/ledger-station-js"
import validate from "../scripts/validate"
import useAuth from "../hooks/useAuth"
import { createBleTransport, isBleAvailable } from "utils/ledger"
import { wordsFromAddress } from "utils/bech32"

import styles from "./AccessWithLedger.module.scss"
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
  SectionHeader,
  FlexColumn,
  Flex,
} from "@terra-money/station-ui"
import CreatedWallet from "auth/modules/create/CreatedWallet"
import { isPasswordValid, passwordExists } from "auth/scripts/keystore"

interface Values {
  index: number
  legacy: boolean
  bluetooth: boolean
  name: string
  password: string
  confirm: string
}

enum Pages {
  form = "form",
  connect = "connect",
  openTerra = "openTerra",
  askCosmos = "askCosmos",
  openCosmos = "openCosmos",
  choosePasswordForm = "choosePasswordForm",
  complete = "complete",
}

const AccessWithLedgerForm = () => {
  const { t } = useTranslation()
  const { connectLedger } = useAuth()
  const [error, setError] = useState<Error>()
  const [page, setPage] = useState(Pages.form)
  const [words, setWords] = useState<{ 330: string; 118?: string }>({ 330: "" })
  const [pubkey, setPubkey] = useState<{ 330: string; 118?: string }>({
    330: "",
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

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

  const { register, watch, formState, setError: setFormError } = form
  const { errors, isValid } = formState
  const { index, bluetooth, name, password, legacy } = watch()

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

      if (legacy) {
        setWords({
          "330": wordsFromAddress(key118.accAddress("terra")),
          "118": wordsFromAddress(key118.accAddress("terra")),
        })
        // @ts-expect-error
        setPubkey({ "330": key118.publicKey.key, "118": key118.publicKey.key })
      } else {
        setWords((w) => ({
          ...w,
          "118": wordsFromAddress(key118.accAddress("terra")),
        }))
        // @ts-expect-error
        setPubkey((p) => ({ ...p, "118": key118.publicKey.key }))
      }
      setPage(Pages.choosePasswordForm)
    } catch (error) {
      setError(error as Error)
      setPage(legacy ? Pages.form : Pages.askCosmos)
    }
  }

  const render = () => {
    switch (page) {
      case Pages.form:
        return (
          <section className={styles.form__container}>
            <FlexColumn gap={18} className={styles.form__details}>
              <InputWrapper
                label={t("Wallet name")}
                error={errors.name?.message}
              >
                <Input
                  {...register("name", { validate: validate.name })}
                  placeholder="e.g. 'my-ledger-wallet'"
                  autoFocus
                />
              </InputWrapper>

              {bleAvailable && (
                <Checkbox
                  {...register("bluetooth")}
                  checked={bluetooth}
                  label={t("Use Bluetooth")}
                />
              )}

              <button
                onClick={(e) => {
                  e.preventDefault()
                  setShowAdvanced((show) => !show)
                }}
              >
                <SectionHeader
                  title={
                    showAdvanced
                      ? t("Hide Advanced Options")
                      : t("Show Advanced Options")
                  }
                  withLine
                />
              </button>

              {showAdvanced && (
                <>
                  <InputWrapper /* do not translate this */
                    label="Index"
                    error={errors.index?.message}
                    extra={
                      <TooltipIcon
                        content={t(
                          "BIP 44 index number. For advanced users only"
                        )}
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

                  <Checkbox
                    {...register("legacy")}
                    checked={legacy}
                    label={t("Use cointype 118 (Cosmos App) on all chains")}
                  />

                  {legacy && (
                    <Banner
                      variant="warning"
                      title={t(
                        "You should select this option only if you used your Ledger to interact with Terra before columbus-3."
                      )}
                    />
                  )}
                </>
              )}
            </FlexColumn>

            <FlexColumn gap={18} className={styles.form__footer}>
              {error && <Banner variant="error" title={error.message} />}

              <Button
                variant="primary"
                onClick={legacy ? connectCosmos : connectTerra}
                disabled={!isValid}
              >
                Connect
              </Button>
            </FlexColumn>
          </section>
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
          <section className={styles.form__container}>
            <FlexColumn gap={18} className={styles.form__details}>
              <p className={`center ${styles.question}`}>
                {t("Do you want to import your Cosmos accounts?")}
              </p>
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
              <Button
                className={styles.mainButton}
                variant="primary"
                onClick={connectCosmos}
              >
                {t("Yes")}
              </Button>
              <p className="center">
                <button
                  className={styles.smallButton}
                  onClick={() => setPage(Pages.choosePasswordForm)}
                >
                  {t("No, I'll use only Terra")}
                </button>
              </p>
            </FlexColumn>
          </section>
        )
      case Pages.openCosmos:
        return (
          <LedgerModal action={LedgerDeviceAction.OPEN_APP} appName="Cosmos" />
        )

      case Pages.choosePasswordForm:
        return (
          <section className={styles.form__container}>
            <FlexColumn gap={18} className={styles.form__details}>
              <InputWrapper
                label={t("Password")}
                error={errors.password?.message}
              >
                <Input
                  {...register("password", {
                    validate: passwordExists() ? undefined : validate.password,
                  })}
                  type="password"
                />
              </InputWrapper>

              {!passwordExists() && (
                <InputWrapper
                  label={t("Confirm password")}
                  error={errors.confirm?.message}
                >
                  <Input
                    {...register("confirm", {
                      validate: (confirm) =>
                        validate.confirm(password, confirm),
                    })}
                    onFocus={() => form.trigger("confirm")}
                    type="password"
                  />
                </InputWrapper>
              )}

              <Button
                disabled={!isValid || !password}
                onClick={() => {
                  if (passwordExists() && !isPasswordValid(password)) {
                    setFormError(
                      "password",
                      { message: t("Invalid password") },
                      { shouldFocus: true }
                    )
                    return
                  }
                  setPage(Pages.complete)
                }}
                variant="primary"
                style={{ marginTop: 22 }}
              >
                {t("Confirm")}
              </Button>
            </FlexColumn>
          </section>
        )

      case Pages.complete:
        return (
          <Flex align="flex-start" className={styles.form__container}>
            <CreatedWallet
              name={name}
              words={words}
              onConfirm={() =>
                connectLedger(
                  password,
                  words,
                  pubkey,
                  index,
                  bluetooth,
                  name,
                  legacy
                )
              }
            />
          </Flex>
        )
    }
  }

  return <Form className={styles.form}>{render()}</Form>
}

export default AccessWithLedgerForm
