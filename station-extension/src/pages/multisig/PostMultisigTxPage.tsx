import { useState } from "react"
import { useTranslation } from "react-i18next"
import { LegacyAminoMultisigPublicKey } from "@terra-money/feather.js"
import { useChainID } from "data/wallet"
import { useAccountInfo } from "data/queries/auth"
import { Card, Grid } from "components/layout"
import ExtensionPage from "extension/components/ExtensionPage"
import { Wrong } from "components/feedback"
import { isWallet, useAuth } from "auth"
import CreateMultisigWalletForm from "auth/modules/create/CreateMultisigWalletForm"
import ConfirmModal from "auth/modules/manage/ConfirmModal"
import useDefaultValues from "./utils/useDefaultValues"
import PostMultisigTxForm from "./PostMultisigTxForm"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { Banner, Modal } from "station-ui"
import { useNavigate } from "react-router-dom"

const PostMultisigTxPage = () => {
  const { t } = useTranslation()
  const addresses = useInterchainAddresses()
  const chainID = useChainID()
  const { wallet } = useAuth()
  const navigate = useNavigate()

  console.log("wallet", wallet, wallet.threshold)

  /* account info */
  const { data: account, ...state } = useAccountInfo()

  /* public key from network */
  const [publicKeyFromNetwork, setPublicKeyFromNetwork] =
    useState<LegacyAminoMultisigPublicKey>()
  const [errorMessage, setErrorMessage] = useState<string>()

  const onCreated = (publicKey: LegacyAminoMultisigPublicKey) => {
    if (publicKey.address("terra") !== addresses?.[chainID])
      setErrorMessage(t("Data does not match the connected wallet"))
    else setPublicKeyFromNetwork(publicKey)
  }

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

    const publicKey = account.getPublicKey() ?? publicKeyFromNetwork
    const sequence = account.getSequenceNumber()

    if (!(publicKey instanceof LegacyAminoMultisigPublicKey))
      return (
        <>
          <Grid gap={4}>
            <Banner
              variant="info"
              title={t(
                "This multisig wallet has no transaction history. The addresses and the threshold must be submitted again until a transaction history exists for this wallet."
              )}
            />
            <CreateMultisigWalletForm onPubkey={onCreated} />
          </Grid>

          {errorMessage && (
            <ConfirmModal onRequestClose={() => setErrorMessage(undefined)}>
              {errorMessage}
            </ConfirmModal>
          )}
        </>
      )

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

  const publicKey = account?.getPublicKey() ?? publicKeyFromNetwork
  return (
    <Modal
      isOpen
      onRequestClose={() => {
        navigate("/", { replace: true })
      }}
      backAction={() => {
        navigate(`/manage-wallet/manage/${wallet.name}`)
      }}
      title={t("Post a multisig tx")}
      subtitle={wallet.address}
    >
      {render()}
    </Modal>
  )
}

export default PostMultisigTxPage
