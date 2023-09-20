import { PropsWithChildren, ReactNode } from "react"
import ReactModal from "react-modal"
import classNames from "classnames/bind"
import CloseIcon from "@mui/icons-material/Close"
import { getMaxHeightStyle } from "utils/style"
import styles from "./Modal.module.scss"

const cx = classNames.bind(styles)

export interface ModalProps extends ReactModal.Props {
  /* content */
  title?: ReactNode
  footer?: (close: ReactModal.Props["onRequestClose"]) => ReactNode

  /* style */
  confirm?: boolean
  minimal?: boolean
  maxHeight?: boolean | number

  closeIcon?: ReactNode
  icon?: ReactNode
  rootID?: string
}

const Modal = (props: PropsWithChildren<ModalProps>) => {
  const { title, children, footer, rootID = "station" } = props
  const { icon, closeIcon, onRequestClose, confirm, maxHeight, minimal } = props

  return (
    <ReactModal
      {...props}
      className={cx(styles.modal, { minimal })}
      overlayClassName={styles.overlay}
      appElement={document.getElementById(rootID)!}
    >
      {onRequestClose && !minimal && (
        <button type="button" className={styles.close} onClick={onRequestClose}>
          {closeIcon ?? <CloseIcon fontSize="inherit" />}
        </button>
      )}

      {(title || icon) && (
        <header className={styles.header}>
          <section className={styles.icon}>{icon}</section>
          <h1 className={cx(styles.title, { confirm })}>{title}</h1>
        </header>
      )}

      {children && (
        <section
          className={styles.main}
          style={getMaxHeightStyle(maxHeight, 320)}
        >
          {children}
        </section>
      )}

      {footer && (
        <footer className={styles.footer}>{footer(onRequestClose)}</footer>
      )}
    </ReactModal>
  )
}

export default Modal
