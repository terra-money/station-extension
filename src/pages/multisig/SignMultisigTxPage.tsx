import ExtensionPage from "extension/components/ExtensionPage"
import useDefaultValues from "./utils/useDefaultValues"
import SignMultisigTxForm from "./SignMultisigTxForm"
import { useTranslation } from "react-i18next"
import { Wrong } from "components/feedback"
import { isWallet, useAuth } from "auth"
import { Card } from "components/layout"

const SignMultisigTxPage = () => {
  const { t } = useTranslation()
  const { wallet } = useAuth()
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
    <ExtensionPage
      backButtonPath={`/manage-wallet/manage/${wallet.name}`}
      title={t("Sign Multisig Tx")}
      subtitle={defaultValues.address}
      fullHeight
    >
      {render()}
    </ExtensionPage>
  )
}

export default SignMultisigTxPage
