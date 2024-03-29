import { useTranslation } from "react-i18next"
import {
  Button,
  ButtonInlineWrapper,
  Modal,
  ModalProps,
} from "@terra-money/station-ui"
import styles from "./ConfirmLeaveModal.module.scss"

interface ConfirmLeaveModalProps extends ModalProps {
  onConfirm: () => void
}

const ConfirmLeaveModal = (props: ConfirmLeaveModalProps) => {
  const { t } = useTranslation()
  const { isOpen, onRequestClose, onConfirm } = props

  const Footer = () => {
    return (
      <ButtonInlineWrapper>
        <Button variant="secondary" onClick={onRequestClose}>
          {t("Cancel")}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {t("Yes, Leave")}
        </Button>
      </ButtonInlineWrapper>
    )
  }

  return (
    <Modal
      title={t("Leave")}
      centerTitle
      isOpen={isOpen}
      footer={Footer}
      smallBottom
    >
      <div className={styles.text__content}>
        {t(
          "Are you sure you want to stop what you're currently doing and return to the portfolio page? Your progress will not be saved."
        )}
      </div>
    </Modal>
  )
}

export default ConfirmLeaveModal
