import { useTranslation } from "react-i18next"
import { Card, Grid } from "components/layout"
import styles from "./IdentityAuth.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import OriginCard from "extension/components/OriginCard"
import BottomCard from "extension/components/BottomCard"
import ConfirmButtons from "extension/components/ConfirmButtons"
import { useSearchParams } from "react-router-dom"
import { Fragment, useEffect, useState } from "react"
import { LocalStorageServices, approveMethod } from "identity/services"
import { ExtensionService } from "identity/services/Extension.service"
import { BasicMessage } from "@0xpolygonid/js-sdk"

const RequestType = {
  Auth: "Auth",
  CredentialOffer: "Credential Offer",
  Proof: "Proof",
  Unknown: "unknown",
}

export const IdentityAuth = () => {
  const [searchParams] = useSearchParams({
    type: "",
    payload: "",
  })
  const { t } = useTranslation()
  const { hostname } = new URL(origin)
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState("")
  const [rawMsg, setRawMsg] = useState(new Uint8Array())
  const [error, setError] = useState("")

  const parseType = (msg: BasicMessage) => {
    const { type, body } = msg
    const { scope = [] } = body as any

    if (type.includes("request") && scope.length) {
      return RequestType.Proof
    } else if (type.includes("offer")) {
      return RequestType.CredentialOffer
    } else if (type.includes("request")) {
      return RequestType.Auth
    }
    return RequestType.Unknown
  }

  useEffect(() => {
    const accounts = LocalStorageServices.getAllAccounts()
    if (!accounts || accounts.length === 0) {
      setError("No DID created yet. Please create a DID first.")
      return
    }

    const parsePayload = async () => {
      const es = await ExtensionService.init()
      if (searchParams.get("type") === "base64") {
        const payload = searchParams.get("payload") || ""
        if (!payload) {
          setError("Payload is empty")
        }
        let msgBytes = Buffer.from(payload, "base64")
        setRawMsg(msgBytes)
        const { unpackedMessage } = await es.packageMgr.unpack(msgBytes)
        setMsg(JSON.stringify(unpackedMessage, null, " "))
        setMsgType(parseType(unpackedMessage))
      }
    }
    parsePayload().catch(console.error)
  }, [searchParams])

  const approve = () => {
    approveMethod(rawMsg).then((d) => {
      console.log(d)
      window.close()
    })
  }

  return (
    <ExtensionPage header={<OriginCard hostname={hostname} />}>
      <Grid gap={28}>
        <header className="center">
          <Grid gap={8}>
            <h1 className={styles.title}>{t("Verify Identity")}</h1>
          </Grid>
        </header>

        <Card size="small" bordered className={styles.bytes__card}>
          <header className={styles.header}>
            <p className={styles.title}>{msgType} Request</p>
          </header>
          <Fragment>
            <p className={styles.details}>{msg}</p>
          </Fragment>
        </Card>
        <BottomCard>
          <ConfirmButtons
            buttons={[
              {
                onClick: window.close,
                children: t("Cancel"),
              },
              {
                onClick: approve,
                children: t("Verify"),
              },
            ]}
          />
        </BottomCard>
      </Grid>
    </ExtensionPage>
  )
}
