import { Col } from "components/layout"
import { useAuth } from "auth"
import ExtensionPage from "../components/ExtensionPage"
import SwitchWallet from "../auth/SwitchWallet"
import AddWallet from "../auth/AddWallet"
import { useRequest } from "../RequestContainer"
import ConfirmConnect from "./ConfirmConnect"
import ConfirmTx from "./ConfirmTx"
import Assets from "./Assets"
import Welcome from "./Welcome"

const Front = () => {
  const { wallet, wallets } = useAuth()
  const { requests } = useRequest()
  const { connect, tx } = requests

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

  if (connect) return <ConfirmConnect {...connect} />
  if (tx) return <ConfirmTx {...tx} />

  return <Assets />
}

export default Front
