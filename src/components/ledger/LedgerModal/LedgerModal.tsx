import { PropsWithChildren } from 'react'
import Lottie from 'lottie-react'
import styles from './LedgerModal.module.scss'
import { Modal } from 'components/feedback/modals'
import animations from './animations'

enum LedgerModel {
  NANOX = 'nanox',
  NANOS = 'nanos',
  NANOSP = 'nanosp',
}

enum Action {
  CONNECT = 'connect',
  OPEN_APP = 'openApp',
  CONFIRM = 'confirm',
  UNLOCK = 'unlock',
}

export interface LedgerModalProps {
  device?: LedgerModel
  action: Action
  appName: string
  onRequestClose?: () => void
}

interface Props extends LedgerModalProps {}

const LedgerModal = (props: PropsWithChildren<Props>) => {
  const { device = LedgerModel.NANOX, action, appName, onRequestClose } = props

  function renderText() {
    switch (action) {
      case Action.CONNECT:
        return <p>Connect and unlock your Ledger device.</p>
      case Action.UNLOCK:
        return <p>Turn on and unlock your Ledger device.</p>
      case Action.OPEN_APP:
        return (
          <p>
            Open the <b>{appName}</b> app on your Ledger device.
          </p>
        )
      case Action.CONFIRM:
        return <p>Confirm the transaction on your Ledger device.</p>
    }
  }

  return (
    <Modal isOpen={true} closeIcon={<></>} onRequestClose={onRequestClose}>
      <section className={styles.ledger__modal}>
        <Lottie
          animationData={animations[device][action]}
          className={styles.animation}
        />
        {renderText()}
      </section>
    </Modal>
  )
}

export default LedgerModal
