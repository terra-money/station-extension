// nanos
import nanosConnect from "./nanos/connect.json"
import nanosUnlock from "./nanos/unlock.json"
import nanosOpenApp from "./nanos/openApp.json"
import nanosConfirm from "./nanos/confirm.json"

// nanosp
import nanospConnect from "./nanosp/connect.json"
import nanospUnlock from "./nanosp/unlock.json"
import nanospOpenApp from "./nanosp/openApp.json"
import nanospConfirm from "./nanosp/confirm.json"

// nanox
import nanoxConnect from "./nanox/connect.json"
import nanoxUnlock from "./nanox/unlock.json"
import nanoxOpenApp from "./nanox/openApp.json"
import nanoxConfirm from "./nanox/confirm.json"

export enum LedgerDeviceModel {
  NANOX = "nanox",
  NANOS = "nanos",
  NANOSP = "nanosp",
}

export enum LedgerDeviceAction {
  CONNECT = "connect",
  OPEN_APP = "openApp",
  CONFIRM = "confirm",
  UNLOCK = "unlock",
}

export default {
  [LedgerDeviceModel.NANOS]: {
    [LedgerDeviceAction.CONNECT]: nanosConnect,
    [LedgerDeviceAction.UNLOCK]: nanosUnlock,
    [LedgerDeviceAction.OPEN_APP]: nanosOpenApp,
    [LedgerDeviceAction.CONFIRM]: nanosConfirm,
  },
  [LedgerDeviceModel.NANOSP]: {
    [LedgerDeviceAction.CONNECT]: nanospConnect,
    [LedgerDeviceAction.UNLOCK]: nanospUnlock,
    [LedgerDeviceAction.OPEN_APP]: nanospOpenApp,
    [LedgerDeviceAction.CONFIRM]: nanospConfirm,
  },
  [LedgerDeviceModel.NANOX]: {
    [LedgerDeviceAction.CONNECT]: nanoxConnect,
    [LedgerDeviceAction.UNLOCK]: nanoxUnlock,
    [LedgerDeviceAction.OPEN_APP]: nanoxOpenApp,
    [LedgerDeviceAction.CONFIRM]: nanoxConfirm,
  },
}
