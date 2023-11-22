import { PropsWithChildren, ReactNode, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import ReactModal from "react-modal"
import CloseIcon from "@mui/icons-material/Close"
import { RenderButton } from "types/components"
import createContext from "utils/createContext"
import { getMaxHeightStyle } from "utils/style"

ReactModal.setAppElement("#station")

interface ModalProps {
  closeIcon?: ReactNode
  icon?: ReactNode

  /* content */
  title?: ReactNode
  footer?: (close: ReactModal.Props["onRequestClose"]) => ReactNode

  /* style */
  confirm?: boolean
  maxHeight?: boolean | number
  scrollable?: boolean
}

export interface Props extends ModalProps, ReactModal.Props {}

const Modal = (props: PropsWithChildren<Props>) => {
  const { title, children, footer } = props
  const { icon, closeIcon, onRequestClose, maxHeight } = props

  return (
    <ReactModal {...props}>
      {onRequestClose && (
        <button type="button" onClick={onRequestClose}>
          {closeIcon ?? <CloseIcon fontSize="inherit" />}
        </button>
      )}

      {(title || icon) && (
        <header>
          <section>{icon}</section>
          <h1>{title}</h1>
        </header>
      )}

      {children && (
        <section style={getMaxHeightStyle(maxHeight, 320)}>{children}</section>
      )}

      {footer && <footer>{footer(onRequestClose)}</footer>}
    </ReactModal>
  )
}

export default Modal

/* helper */
export const [useModal, ModalProvider] = createContext<() => void>("useModal")

interface ModalButtonProps extends ModalProps {
  renderButton: RenderButton
  modalKey?: string
  scrollable?: boolean
}

export const ModalButton = (props: PropsWithChildren<ModalButtonProps>) => {
  const { pathname } = useLocation()
  const { renderButton, modalKey = pathname, ...rest } = props

  const [isModalOpen, setIsModalOpen] = useState(false)
  const open = () => setIsModalOpen(true)
  const close = () => setIsModalOpen(false)

  useEffect(() => {
    close()
  }, [modalKey])

  return (
    <ModalProvider value={close}>
      {renderButton(open)}
      <Modal {...rest} isOpen={isModalOpen} onRequestClose={close} />
    </ModalProvider>
  )
}
