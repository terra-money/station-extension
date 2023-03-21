import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { LedgerKey } from "@terra-money/ledger-station-js"
import useAuth from "../hooks/useAuth"
import { createBleTransport } from "utils/ledger"
import { wordsFromAddress } from "utils/bech32"

import Lottie from "lottie-react"
import connectAnimation from "./assets/connect.json"
import openApp from "./assets/openApp.json"
import DoneAllIcon from "@mui/icons-material/DoneAll"

import { Grid } from "components/layout"
import { isWallet } from "auth"
import BottomCard from "extension/components/BottomCard"
import ConfirmButtons from "extension/components/ConfirmButtons"
import { FormError } from "components/form"
import { useRequest } from "extension/RequestContainer"
import { storePubKey } from "auth/scripts/keystore"

enum Pages {
  confirm = "confirm",
  connect = "connect",
  openTerra = "openTerra",
  askCosmos = "askCosmos",
  openCosmos = "openCosmos",
  complete = "complete",
}

const RetrieveLedgerPubKeyForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { wallet, connect } = useAuth()
  const { actions } = useRequest()
  const [error, setError] = useState<Error>()
  const [page, setPage] = useState(Pages.confirm)
  const [pubkey, setPubkey] = useState<{ 330: string; 118?: string }>({
    330: "",
  })

  if (!isWallet.ledger(wallet)) {
    navigate("/", { replace: true })
    return null
  }

  const { index, bluetooth, name: walletName } = wallet as LedgerWallet

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

      if (
        wordsFromAddress(key330.accAddress("terra")) !== wallet.words["330"]
      ) {
        throw new Error(
          "The Ledger device does not have the same key as the stored wallet."
        )
      }

      // @ts-expect-error
      setPubkey({ "330": key330.publicKey.key })
      setPage(wallet.words["118"] ? Pages.askCosmos : Pages.complete)
    } catch (error) {
      setError(error as Error)
      setPage(Pages.confirm)
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

      if (
        wordsFromAddress(key118.accAddress("terra")) !== wallet.words["118"]
      ) {
        throw new Error(
          "The Ledger device does not have the same key as the stored wallet."
        )
      }

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
      case Pages.confirm:
        return (
          <>
            <BottomCard>
              {error && <FormError>{error.message}</FormError>}
              <ConfirmButtons
                buttons={[
                  {
                    onClick: () => {
                      actions.pubkey()
                    },
                    children: t("Cancel"),
                  },
                  {
                    onClick: connectTerra,
                    children: t("Next"),
                  },
                ]}
              />
            </BottomCard>
          </>
        )
      case Pages.connect:
        return (
          <>
            <section className="center">
              <Lottie animationData={connectAnimation} />
              <p>{t("Connect and unlock your device")}</p>
            </section>
          </>
        )
      case Pages.openTerra:
        return (
          <>
            <>
              <section className="center">
                <Lottie animationData={openApp} />
                <p>
                  Open the <strong>Terra app</strong> on the Ledger device.
                </p>
              </section>
            </>
          </>
        )
      case Pages.askCosmos:
        return (
          <Grid gap={20}>
            <section className="center">
              <Lottie animationData={openApp} />
              <p>
                Open the <strong>Cosmos app</strong> on the Ledger device, then
                click "Next".
              </p>
            </section>

            <BottomCard>
              {error && <FormError>{error.message}</FormError>}
              <ConfirmButtons
                buttons={[
                  {
                    onClick: () => {
                      actions.pubkey()
                    },
                    children: t("Cancel"),
                  },
                  {
                    onClick: connectCosmos,
                    children: t("Next"),
                  },
                ]}
              />
            </BottomCard>
          </Grid>
        )
      case Pages.openCosmos:
        return (
          <section className="center">
            <Lottie animationData={openApp} />
            <p>
              Open the <strong>Cosmos app</strong> on the Ledger device.
            </p>
          </section>
        )
      case Pages.complete:
        return (
          <>
            <section className="center">
              <DoneAllIcon className="success" style={{ fontSize: 56 }} />
              <h1>{t("Public key retrieved successfully")}</h1>
            </section>
            <BottomCard>
              <ConfirmButtons
                buttons={[
                  {
                    onClick: () => {
                      storePubKey({ name: walletName, pubkey })
                      connect(walletName)
                      actions.pubkey()
                    },
                    children: t("Complete"),
                  },
                ]}
              />
            </BottomCard>
          </>
        )
    }
  }

  return <section>{render()}</section>
}

export default RetrieveLedgerPubKeyForm
