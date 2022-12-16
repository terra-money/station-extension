import { Col } from "components/layout"
import { useAuth } from "auth"
import ExtensionPage from "../components/ExtensionPage"
import SwitchWallet from "../auth/SwitchWallet"
import AddWallet from "../auth/AddWallet"
import { useRequest } from "../RequestContainer"
import ConfirmConnect from "./ConfirmConnect"
import ConfirmTx from "./ConfirmTx"
import Welcome from "./Welcome"
import Wallet from "pages/wallet/Wallet"
import WelcomeModal from "app/sections/WelcomeModal"

const Front = () => {
  const { wallet, wallets } = useAuth()
  const { requests } = useRequest()
  const { connect, tx } = requests

  const showWelcomeModal = localStorage.getItem("welcomeModal") === null

  if (!wallet) {
    return (
      <ExtensionPage>
        <Col>
          {wallets.length ? <SwitchWallet /> : <Welcome />}
          <AddWallet />
        </Col>
        {showWelcomeModal && <WelcomeModal />}
      </ExtensionPage>
    )
  }

  if (connect) {
    return <ConfirmConnect {...connect} />
  }

  if (tx) {
    return <ConfirmTx {...tx} />
  }

  return <Wallet />
}

export default Front
