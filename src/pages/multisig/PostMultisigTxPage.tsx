import {
  LegacyAminoMultisigPublicKey,
  SimplePublicKey,
} from "@terra-money/feather.js"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import useDefaultValues from "./utils/useDefaultValues"
import PostMultisigTxForm from "./PostMultisigTxForm"
import { truncate } from "@terra-money/terra-utils"
import { useAccountInfo } from "data/queries/auth"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Wrong } from "components/feedback"
import { isWallet, useAuth } from "auth"
import { useChainID } from "data/wallet"
import { Card } from "components/layout"
import { Modal } from "station-ui"

const PostMultisigTxPage = () => {
  const { t } = useTranslation()
  const addresses = useInterchainAddresses()
  const chainID = useChainID()
  const { wallet } = useAuth()
  const navigate = useNavigate()

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
    <Modal
      {...state}
      isOpen
      onRequestClose={() => {
        navigate("/", { replace: true })
      }}
      backAction={() => {
        navigate(`/manage-wallet/manage/${wallet.name}`)
      }}
      title={t("Post a multisig tx")}
      subtitle={truncate(addresses?.[chainID], [13, 6])}
    >
      {render()}
    </Modal>
  )
}

export default PostMultisigTxPage
