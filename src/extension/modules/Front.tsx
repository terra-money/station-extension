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
          origin: "https://station.terra.money",
          id: 0,
          chain: {
            chainID: "phoenix-1",
            lcd: "https://phoenix-lcd.terra.dev",
            gasAdjustment: 1.75,
            gasPrices: { uluna: 0.015 },
            prefix: "terra",
            coinType: "330",
            baseAsset: "uluna",
            name: "Terra",
            icon: "https://station-assets.terra.money/img/chains/Terra.svg",
            // doesn't require IBC channels since it's already on all the other chains
            explorer: {
              address: "https://terrasco.pe/mainnet/address/{}",
              tx: "https://terrasco.pe/mainnet/tx/{}",
              validator: "https://terrasco.pe/mainnet/validator/{}",
              block: "https://terrasco.pe/mainnet/block/{}",
            },
            tokens: [
              {
                token: "uluna",
                symbol: "LUNA",
                name: "Terra Luna",
                icon: "https://station-assets.terra.money/img/coins/Luna.svg",
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
