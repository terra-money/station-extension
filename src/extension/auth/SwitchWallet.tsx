import { useAuth } from "auth"
import { clearStoredPassword } from "../storage"
import ExtensionList from "../components/ExtensionList"

const SwitchWallet = () => {
  const { connectedWallet, wallets, connect } = useAuth()

  const list = wallets
    .filter(({ name }) => name !== connectedWallet?.name)
    .map(({ name, address }) => {
      const select = () => {
        connect(name)
        clearStoredPassword()
      }

      return { children: name, description: address, onClick: select }
    })

  return <ExtensionList list={list} />
}

export default SwitchWallet
