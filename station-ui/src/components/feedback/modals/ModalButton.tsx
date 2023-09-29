/* eslint-disable react-refresh/only-export-components */
import Modal, { ModalProps } from "./Modal"
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react"

/* helper */
interface ModalContextValue {
  openModal: () => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }

  return context
}

export interface ModalButtonProps extends Omit<ModalProps, "isOpen"> {
  renderButton: (openModal: () => void) => ReactNode
  minimal?: boolean
  children?: ReactNode
  isOpen?: boolean
}

const ModalButton = (props: ModalButtonProps) => {
  const { renderButton, isOpen, ...rest } = props
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  useEffect(() => {
    if (isOpen) openModal()
  }, [isOpen])

  const modalContextValue: ModalContextValue = {
    openModal: openModal,
    closeModal: closeModal,
  }

  return (
    <ModalContext.Provider value={modalContextValue}>
      {renderButton(openModal)}
      {isModalOpen && (
        <Modal {...rest} isOpen={isModalOpen} onRequestClose={closeModal} />
      )}
    </ModalContext.Provider>
  )
}

export default ModalButton
