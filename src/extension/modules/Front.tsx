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
import ConfirmPubkey from "./ConfirmPubkey"
import ConfirmNewChain from "./ConfirmNewChain"

const Front = () => {
  const { wallet, wallets } = useAuth()
  const { requests } = useRequest()
  const { connect, tx, pubkey, chain } = requests

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
    return <ConfirmPubkey origin={pubkey} />
  }

  if (true) {
    return (
      <ConfirmNewChain
        {...{
          network: "mainnet",
          origin: "https://e-money.com/",
          id: 0,
          chain: {
            chainID: "emoney-3",
            lcd: "https://emoney.validator.network/api/",
            gasAdjustment: 1.75,
            gasPrices: { ungm: 0.1 },
            prefix: "emoney",
            coinType: "118",
            baseAsset: "ungm",
            name: "eMoney",
            icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/emoney/images/ngm.png",
            // doesn't require IBC channels since it's already on all the other chains
            explorer: {
              address: "https://www.mintscan.io/emoney/account/{}",
              tx: "https://www.mintscan.io/emoney/txs/{}",
              validator: "https://www.mintscan.io/emoney/validators/{}",
              block: "https://www.mintscan.io/emoney/blocks/id/{}",
            },
            tokens: [
              {
                token: "ungm",
                symbol: "NGM",
                name: "NGM",
                icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/emoney/images/ngm.png",
                decimals: 6,
              },
            ],
          },
        }}
      />
    )
  }
  /*
  if (tx) {
    return <ConfirmTx {...tx} />
  }*/

  return <Wallet />
}

export default Front
