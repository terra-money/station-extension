import { useTranslation } from "react-i18next"
import { Grid } from "components/layout"
import ConfirmButtons from "../components/ConfirmButtons"
import { useRequest } from "../RequestContainer"
import styles from "./ConfirmConnect.module.scss"
import { isWallet, useAuth } from "auth"
import ExtensionPage from "extension/components/ExtensionPage"
import { Form, FormItem, Input } from "components/form"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { getStoredPassword } from "extension/storage"
import { PasswordError, storePubKey } from "auth/scripts/keystore"
import OriginCard from "extension/components/OriginCard"
import BottomCard from "extension/components/BottomCard"
import RetrieveLedgerPubKeyForm from "auth/ledger/RetrieveLedgerPubKeyForm"

interface Values {
  password: string
}

const ConfirmPubkey = ({ origin }: { origin: string }) => {
  const { t } = useTranslation()
  const { actions } = useRequest()
  const { wallet, getPubkey, connect } = useAuth()
  const isLedger = isWallet.ledger(wallet)
  const { hostname } = new URL(origin)

  /* form */
  const form = useForm<Values>({
    defaultValues: { password: "" },
  })

  const { register, setValue, handleSubmit } = form

  /* store password */
  useEffect(() => {
    getStoredPassword((password) => {
      setValue("password", password)
    })
  }, [setValue])

  /* submit */
  const [incorrect, setIncorrect] = useState<string>()

  const submit = async ({ password }: Values) => {
    try {
      if (!wallet) throw new Error("No wallet connected")
      // unlock the wallet
      const pubkey: {
        "330": string
        "118"?: string
      } = { "330": await getPubkey("330", password) }

      if (wallet.words["118"]) {
        pubkey["118"] = await getPubkey("118", password)
      }

      storePubKey({
        name: wallet.name,
        pubkey,
      })
      connect(wallet?.name)

      actions.pubkey()
    } catch (error) {
      if (error instanceof PasswordError) {
        setIncorrect(error.message)
      } else {
        actions.pubkey()
      }
    }
  }

  if (!wallet) {
    actions.pubkey()
    return null
  }

  return (
    <ExtensionPage header={<OriginCard hostname={hostname} />}>
      <Grid gap={20}>
        <header className="center">
          <Grid gap={8}>
            <h1 className={styles.title}>{t("Retrieve your Public Key")}</h1>
            <p className="muted">
              {t("This website needs your public key to work correctly.")}
            </p>
          </Grid>
        </header>
        {isLedger ? (
          <RetrieveLedgerPubKeyForm />
        ) : (
          <Form onSubmit={handleSubmit(submit)}>
            <BottomCard>
              <Grid gap={4}>
                <FormItem label={t("Password")} error={incorrect}>
                  <Input type="password" {...register("password")} autoFocus />
                </FormItem>
              </Grid>

              <ConfirmButtons
                buttons={[
                  { onClick: () => actions.pubkey(), children: t("Cancel") },
                  { type: "submit", children: t("Confirm") },
                ]}
              />
            </BottomCard>
          </Form>
        )}
      </Grid>
    </ExtensionPage>
  )
}

export default ConfirmPubkey
