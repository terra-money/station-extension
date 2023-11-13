import useDefaultValues from "./utils/useDefaultValues"
import SignMultisigTxForm from "./SignMultisigTxForm"
import { useTranslation } from "react-i18next"
import { Wrong } from "components/feedback"
import { isWallet, useAuth } from "auth"
import { Card } from "components/layout"
import { Modal } from "station-ui"
import { Link, useNavigate } from "react-router-dom"
import CloseIcon from "@mui/icons-material/Close"

const SignMultisigTxPage = () => {
  const { t } = useTranslation()
  const { wallet } = useAuth()
  const navigate = useNavigate()
  const defaultValues = useDefaultValues()

  const render = () => {
    if (isWallet.multisig(wallet))
      return (
        <Card>
          <Wrong>{t("Multisig wallet cannot sign a tx")}</Wrong>
        </Card>
      )

    return <SignMultisigTxForm defaultValues={defaultValues} />
  }

  return (
    <Modal
      isOpen
      onRequestClose={() => {
        navigate("/", { replace: true })
      }}
      backAction={() => {
        navigate("/", { replace: true })
      }}
      title={t("Sign Multisig Tx")}
      subtitle={wallet.address}
    >
      {render()}
    </Modal>
  )
}

export default SignMultisigTxPage
