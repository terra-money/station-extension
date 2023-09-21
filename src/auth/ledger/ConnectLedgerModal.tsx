import { useTranslation } from "react-i18next"
import AccessWithLedgerForm from "./AccessWithLedgerForm"
import { ModalButton } from "station-ui"
import { ReactNode } from "react"

interface Props {
  renderButton: (open: () => void) => ReactNode
}

const ConnectLedgerModal = (props: Props) => {
  const { renderButton } = props
  const { t } = useTranslation()

  return (
    <ModalButton renderButton={renderButton} title={t("Access with ledger")}>
      <AccessWithLedgerForm />
    </ModalButton>
  )
}

export default ConnectLedgerModal
