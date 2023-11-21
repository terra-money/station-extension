import { useTranslation } from "react-i18next"
import {
  LegacyAminoMultisigPublicKey,
  SimplePublicKey,
} from "@terra-money/feather.js"
import { useChainID } from "data/wallet"
import { useAccountInfo } from "data/queries/auth"
import { Card, Page } from "components/layout"
import { Wrong } from "components/feedback"
import { isWallet, useAuth } from "auth"
import useDefaultValues from "./utils/useDefaultValues"
import PostMultisigTxForm from "./PostMultisigTxForm"
import { useInterchainAddresses } from "auth/hooks/useAddress"

const PostMultisigTxPage = () => {
  const { t } = useTranslation()
  const addresses = useInterchainAddresses()
  const chainID = useChainID()
  const { wallet } = useAuth()

  /* account info */
  const { data: account, ...state } = useAccountInfo()

  /* render */
  const defaultValues = useDefaultValues()
  const render = () => {
    if (!(account && addresses?.[chainID])) return null

    if (!isWallet.multisig(wallet))
      return (
        <Card>
          <Wrong>{t("Connect a multisig wallet to post a multisig tx")}</Wrong>
        </Card>
      )

    const publicKey = new LegacyAminoMultisigPublicKey(
      wallet.threshold,
      wallet.pubkeys.map((pubkey) =>
        SimplePublicKey.fromAmino(JSON.parse(pubkey))
      )
    )

    const sequence = account.getSequenceNumber()

    const signatures = publicKey.pubkeys.map((pubKey) => {
      const address = pubKey.address("terra")
      const publicKey = pubKey.toData()
      return { address, publicKey, signature: "" }
    })

    return (
      <PostMultisigTxForm
        publicKey={publicKey}
        sequence={sequence}
        defaultValues={{
          ...defaultValues,
          address: addresses[chainID],
          signatures,
        }}
      />
    )
  }

  return (
    <Page {...state} title={t("Post a multisig tx")}>
      {render()}
    </Page>
  )
}

export default PostMultisigTxPage
