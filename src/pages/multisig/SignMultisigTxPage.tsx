import { useInterchainAddresses } from "auth/hooks/useAddress"
import ExtensionPage from "extension/components/ExtensionPage"
import useDefaultValues from "./utils/useDefaultValues"
import SignMultisigTxForm from "./SignMultisigTxForm"
import { truncate } from "@terra-money/terra-utils"
import { useTranslation } from "react-i18next"
import { Wrong } from "components/feedback"
import { isWallet, useAuth } from "auth"
import { useChainID } from "data/wallet"
import { Card } from "components/layout"

const SignMultisigTxPage = () => {
  const { t } = useTranslation()
  const { wallet } = useAuth()
  const defaultValues = useDefaultValues()
  const chainID = useChainID()
  const addresses = useInterchainAddresses()

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
      subtitle={truncate(addresses?.[chainID], [13, 6])}
      fullHeight
    >
      {render()}
    </ExtensionPage>
  )
}

export default SignMultisigTxPage
