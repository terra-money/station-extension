import { Col } from "components/layout"
import { useAuth } from "auth"
import ExtensionPage from "../components/ExtensionPage"
import SwitchWallet from "../auth/SwitchWallet"
import AddWallet from "../auth/AddWallet"
import { useRequest } from "../RequestContainer"
import ConfirmConnect from "./ConfirmConnect"
import ConfirmTx from "./ConfirmTx"
import Welcome from "./Welcome"
import WalletRouter from "pages/wallet/WalletRouter"
import ConfirmNewChain from "./ConfirmNewChain"
import ConfirmSwitchNetwork from "./ConfirmSwitchNetwork"

const Front = () => {
  const { wallet, wallets } = useAuth()
  const { requests } = useRequest()
  const { connect, tx, pubkey, chain, network } = requests

  if (!wallet) {
    return (
      <ExtensionPage>
        <Col>
          {wallets.length ? <SwitchWallet /> : <Welcome />}
          <AddWallet />
        </Col>
      </ExtensionPage>
    )
  }

  if (connect) {
    return <ConfirmConnect {...connect} />
  }

  if (pubkey) {
    //return <ConfirmPubkey origin={pubkey} />
  }

  if (chain) {
    return <ConfirmNewChain {...chain} />
  }
  if (tx) {
    return <ConfirmTx {...tx} />
  }
  if (network) {
    return <ConfirmSwitchNetwork {...network} />
  }

  return <WalletRouter />
}

export default Front
