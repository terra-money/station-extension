import BluetoothTransport from "@ledgerhq/hw-transport-web-ble"
import WebUsbTransport from "@ledgerhq/hw-transport-webusb"
import { LEDGER_TRANSPORT_TIMEOUT } from "config/constants"

export async function isBleAvailable() {
  const n: any = navigator
  return n?.bluetooth && (await n.bluetooth.getAvailability())
}

export async function createTransport(bluetooth?: boolean) {
  return bluetooth
    ? await BluetoothTransport.create(LEDGER_TRANSPORT_TIMEOUT)
    : await WebUsbTransport.create(LEDGER_TRANSPORT_TIMEOUT)
}
