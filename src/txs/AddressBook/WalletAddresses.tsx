import { useNetwork } from "data/wallet"
import { useLocation } from "react-router-dom"
import AddressWalletList from "./AddressWalletList"
import { getWallet } from "auth/scripts/keystore"
import { addressFromWords } from "utils/bech32"

export const WalletAddresses = () => {
  const { state: name } = useLocation()
  const network = useNetwork()
  const { words } = getWallet(name)

  const items = Object.values(network).map((c) => ({
    recipient: addressFromWords(words[c.coinType], c.prefix),
    name: c.name,
    id: c.chainID,
    icon: network[c.chainID].icon,
  }))

  return <AddressWalletList items={items} />
}

export default WalletAddresses
