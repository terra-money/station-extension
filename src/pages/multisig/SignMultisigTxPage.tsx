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

  const incorrectWalletErrorPage = (
    <Card>
      <Wrong>{t(`A multisig wallet cannot sign a transaction`)}</Wrong>
    </Card>
  )

  return (
    <ExtensionPage
      backButtonPath={`/manage-wallet/manage/${wallet.name}`}
      title={t("Sign Multisig Tx")}
      subtitle={truncate(addresses?.[chainID], [13, 6])}
      fullHeight
      modal
    >
      {isWallet.multisig(wallet) ? (
        incorrectWalletErrorPage
      ) : (
        <SignMultisigTxForm defaultValues={defaultValues} />
      )}
    </ExtensionPage>
  )
}

export default SignMultisigTxPage
