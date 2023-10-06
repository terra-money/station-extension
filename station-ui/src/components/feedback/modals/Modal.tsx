import { PropsWithChildren, ReactNode, useEffect, useState } from "react"
import ReactModal from "react-modal"
import classNames from "classnames/bind"
import CloseIcon from "@mui/icons-material/Close"
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace"
import { getMaxHeightStyle } from "utils/style"
import styles from "./Modal.module.scss"

const cx = classNames.bind(styles)

export interface ModalProps extends ReactModal.Props {
  /* content */
  title?: ReactNode
  subtitle?: ReactNode
  footer?: (close: ReactModal.Props["onRequestClose"]) => ReactNode

  /* style */
  confirm?: boolean
  minimal?: boolean
  maxHeight?: boolean | number

  closeIcon?: ReactNode
  icon?: ReactNode
  rootID?: string
  backAction?: () => void
}

const Modal = (props: PropsWithChildren<ModalProps>) => {
  const { title, subtitle, children, footer, rootID = "station" } = props
  const {
    icon,
    closeIcon,
    onRequestClose,
    confirm,
    maxHeight,
    minimal,
    backAction,
  } = props

  const [forceExtension, setForceExtension] = useState(false)

  useEffect(() => {
    const forceExists = document.getElementById('force__extension')
    setForceExtension(!!forceExists)
  }, [])

  return (
    <ReactModal
      {...props}
      className={cx(styles.modal, { minimal, ['force__extension']: forceExtension })}
      overlayClassName={styles.overlay}
      appElement={document.getElementById(rootID)!}
    >
      {onRequestClose && !minimal && (
        <button type="button" className={styles.close} onClick={onRequestClose}>
          {closeIcon ?? <CloseIcon fontSize="inherit" />}
        </button>
      )}

      {(title || icon) && (
        <div className={styles.header__container}>
          {backAction && (
            <button className={styles.back__button} onClick={backAction}>
              <KeyboardBackspaceIcon fontSize="inherit" />
            </button>
          )}
          <header className={styles.header}>
            <section className={styles.icon}>{icon}</section>
            <h1 className={cx(styles.title, { confirm })}>{title}</h1>
            <h3 className={cx(styles.subtitle)}>
              {subtitle}
            </h3>
          </header>
        </div>
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
