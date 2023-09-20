import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { ModalButton } from "station-ui"
import NewWalletForm from "./NewWalletForm"

interface Props {
  renderButton: (open: () => void) => ReactNode
}

const CreateWalletModal = (props: Props) => {
  const { renderButton } = props
  const { t } = useTranslation()

  return (
    <ModalButton renderButton={renderButton} title={t("New wallet")}>
      <NewWalletForm />
    </ModalButton>
  )
}

export default CreateWalletModal
