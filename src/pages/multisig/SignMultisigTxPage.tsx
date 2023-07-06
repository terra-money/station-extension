import useDefaultValues from "./utils/useDefaultValues"
import SignMultisigTxForm from "./SignMultisigTxForm"
import { useTranslation } from "react-i18next"
import { Card, Page } from "components/layout"
import { Wrong } from "components/feedback"
import { isWallet, useAuth } from "auth"

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
    <Page title={t("Sign a multisig tx")} backButtonPath="/">
      {render()}
    </Page>
  )
}

export default SignMultisigTxPage
