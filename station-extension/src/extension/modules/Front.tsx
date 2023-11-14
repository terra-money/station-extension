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
//import { MsgSend } from "@terra-money/feather.js"
//import { TxRequest } from "extension/utils"

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
    /*
    const connect = {
      origin: "https://station.money",
    }
    */
    return <ConfirmConnect {...connect} />
  }

  if (tx) {
    /*
    const txRequest: TxRequest = {
      id: 100,
      origin: "https://station.money",
      timestamp: new Date(),
      requestType: "post",
      tx: {
        chainID: "phoenix-1",
        msgs: [
          new MsgSend(
            "terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v",
            "terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v",
            { uluna: "1000000" }
          ),
        ],
        memo: "test memo",
      },
    }

    const signBytesRequest = {
      id: "1",
      origin: "https://station.money",
      timestamp: new Date(),
      bytes: Buffer.from(
        'sadas{ "message": "Hello", "number": 3, "address": "terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v" }',
        "utf8"
      ),
      requestType: "signBytes",
    }
    */
    return <ConfirmTx {...tx} />
  }

  if (pubkey) {
    //return <ConfirmPubkey origin={pubkey} />
  }

  if (chain) {
    return <ConfirmNewChain {...chain} />
  }

  if (network) {
    return <ConfirmSwitchNetwork {...network} />
  }

  return <WalletRouter />
}

export default Front
