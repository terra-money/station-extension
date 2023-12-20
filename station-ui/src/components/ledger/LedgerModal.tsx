import { PropsWithChildren } from "react"
import styles from "./LedgerModal.module.scss"
import { Modal } from "../feedback/modals"
import { LedgerDeviceModel, LedgerDeviceAction } from "./animations"
import LedgerAnimation from "./LedgerAnimation"

export interface LedgerModalProps {
  device?: LedgerDeviceModel
  action: LedgerDeviceAction
  appName: string
  onRequestClose?: () => void
}

interface Props extends LedgerModalProps {}

const LedgerModal = (props: PropsWithChildren<Props>) => {
  const {
    device = LedgerDeviceModel.NANOX,
    action,
    appName,
    onRequestClose,
  } = props

  function renderText() {
    switch (action) {
      case LedgerDeviceAction.CONNECT:
        return <p>Connect and unlock your Ledger device.</p>
      case LedgerDeviceAction.UNLOCK:
        return <p>Turn on and unlock your Ledger device.</p>
      case LedgerDeviceAction.OPEN_APP:
        return (
          <p>
            Open the <b>{appName}</b> app on your Ledger device.
          </p>
        )
      case LedgerDeviceAction.CONFIRM:
        return <p>Confirm the transaction on your Ledger device.</p>
    }
  }

  return (
    <Modal isOpen={true} onRequestClose={onRequestClose}>
      <section className={styles.ledger__modal}>
        <div className={styles.ledger__container}>
          <LedgerAnimation
            device={device}
            action={action}
            className={styles.animation}
          />
          {renderText()}
        </div>
      </section>
    </Modal>
  )
}

export default LedgerModal
