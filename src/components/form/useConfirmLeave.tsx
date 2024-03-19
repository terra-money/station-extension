import { useState } from "react"
import { useNavigate } from "react-router-dom"

const useConfirmLeave = (isDirty: boolean) => {
  const [confirmModal, setConfirmModal] = useState(false)
  const navigate = useNavigate()

  const onClose = () => {
    if (isDirty) {
      setConfirmModal(true)
    } else {
      navigate("/")
    }
  }

  const handleConfirmLeave = () => {
    setConfirmModal(false)
    navigate("/")
  }

  return {
    confirmModal,
    setConfirmModal,
    onClose,
    handleConfirmLeave,
  }
}

export default useConfirmLeave
