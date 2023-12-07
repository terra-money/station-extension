import { useNetwork } from "data/wallet"
import { convertAddress } from "utils/chain"
import { useLocation } from "react-router-dom"
import AddressWalletList from "./AddressWalletList"

export const WalletAddresses = () => {
  const { state: address } = useLocation()
  const network = useNetwork()

  const items = Object.values(network).map((c) => ({
    recipient: convertAddress(address, c.prefix),
    name: c.name,
    id: c.chainID,
    icon: network[c.chainID].icon,
  }))

  return <AddressWalletList items={items} />
}

export default WalletAddresses
