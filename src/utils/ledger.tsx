import { PropsWithChildren, useState } from "react"
import createContext from "./createContext"
import Overlay from "../app/components/Overlay"
import BluetoothTransport from "@ledgerhq/hw-transport-web-ble"
import { LEDGER_TRANSPORT_TIMEOUT } from "config/constants"
import {
  FlexColumn,
  LedgerAnimation,
  LedgerDeviceAction,
} from "@terra-money/station-ui"
import { LedgerKey } from "@terra-money/ledger-station-js"
import styles from "./Ledger.module.scss"
import { useTranslation } from "react-i18next"
import { useAuth } from "auth"
import is from "auth/scripts/is"

interface LedgerState {
  action?: LedgerDeviceAction
  appName?: string
}

const [useLedgerContext, LedgerContextProvider] = createContext<{
  state: LedgerState
  setState: (s: LedgerState) => void
}>("useLedgerContext")

export const LedgerProvider = (props: PropsWithChildren<{}>) => {
  const [state, setState] = useState<LedgerState>({})

  return (
    <LedgerContextProvider
      value={{
        state,
        setState,
      }}
    >
      {props.children}
      <LedgerActionOverlay />
    </LedgerContextProvider>
  )
}

const LedgerActionOverlay = () => {
  const {
    state: { action, appName },
  } = useLedgerContext()
  const { t } = useTranslation()

  if (!action) return null

  function renderText() {
    switch (action) {
      case LedgerDeviceAction.CONNECT:
        return t("Connect and unlock your Ledger")
      case LedgerDeviceAction.UNLOCK:
        return t("Turn on and unlock your Ledger")
      case LedgerDeviceAction.OPEN_APP:
        return t("Open the {{appName}} app on your Ledger", {
          appName: appName ?? "Terra",
        })
      case LedgerDeviceAction.CONFIRM:
        return t("Confirm the transaction on yout Ledger")
    }
  }

  return (
    <Overlay>
      <FlexColumn gap={36}>
        <LedgerAnimation action={action} className={styles.ledger__animation} />
        <p className={styles.ledger__text}>{renderText()}</p>
      </FlexColumn>
    </Overlay>
  )
}

export const useLedgerKey = () => {
  const { setState } = useLedgerContext()
  const { t } = useTranslation()

  function parseLedgerError(e: any, appName: string) {
    if (typeof e?.message !== "string") return "Unknown Ledger error"

    switch (e.message as string) {
      case "Unknown Status Code: 28161":
        return t(
          "Make sure you have the {{appName}} app installed and open on your Ledger.",
          { appName }
        )

      case "Failed to execute 'claimInterface' on 'USBDevice': Unable to claim interface.":
        return t(
          "Your Ledger is being used in another tab, close it and try again."
        )

      case "Ledger device: UNKNOWN_ERROR (0x5515)":
        return t("Make sure your Ledger is unlocked and try again.")

      // TODO: parse other errors
      // TODO: add links to troubleshoot docs

      default:
        return e.message
    }
  }

  return async ({
    bluetooth,
    coinType,
    index,
  }: {
    bluetooth?: boolean
    index: number
    coinType: number
  }) => {
    const appName = coinType === 330 ? "Terra" : "Cosmos"

    setState({
      action: bluetooth
        ? LedgerDeviceAction.UNLOCK
        : LedgerDeviceAction.CONNECT,
    })

    try {
      const key = await LedgerKey.create({
        transport: bluetooth ? createBleTransport : undefined,
        index,
        coinType,
        onConnect: () =>
          setState({
            action: LedgerDeviceAction.OPEN_APP,
            appName,
          }),
      })

      const legacySign = key.sign.bind(key)

      key.sign = async (m: Buffer) => {
        setState({ action: LedgerDeviceAction.CONFIRM })
        try {
          const res = await legacySign(m)
          setState({})
          return res
        } catch (e) {
          console.log(e)
          throw e
        } finally {
          setState({})
        }
      }

      setState({})
      return key
    } catch (e: any) {
      console.log(e.message)
      throw new Error(parseLedgerError(e, appName))
    } finally {
      setState({})
    }
  }
}

export const useIsLedger = () => {
  const { wallet } = useAuth()
  return is.ledger(wallet)
}

// general helpers
export async function isBleAvailable() {
  const n: any = navigator
  return n?.bluetooth && (await n.bluetooth.getAvailability())
}

export async function createBleTransport() {
  return await BluetoothTransport.create(LEDGER_TRANSPORT_TIMEOUT)
}
