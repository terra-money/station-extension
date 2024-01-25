import { useTranslation } from "react-i18next"
import { truncate } from "@terra-money/terra-utils"
import { isWallet, useAuth } from "auth"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import useDefaultValues from "./utils/useDefaultValues"
import SignMultisigTxForm from "./SignMultisigTxForm"
import { Wrong } from "components/feedback"
import { Card } from "components/layout"
import { useChainID } from "data/wallet"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"

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
    <ExtensionPageV2
      backButtonPath={`/manage-wallet/manage/${wallet.name}`}
      title={t("Sign Multisig Tx")}
      subtitle={truncate(addresses?.[chainID], [13, 6])}
    >
      {isWallet.multisig(wallet) ? (
        incorrectWalletErrorPage
      ) : (
        <SignMultisigTxForm defaultValues={defaultValues} />
      )}
    </ExtensionPageV2>
  )
}

export default SignMultisigTxPage
