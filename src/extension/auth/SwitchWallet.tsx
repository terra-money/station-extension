import { isWallet, useAuth } from "auth"
import { Flex } from "components/layout"
import MultisigBadge from "auth/components/MultisigBadge"
import { clearStoredPassword } from "../storage"
import ExtensionList from "../components/ExtensionList"

const SwitchWallet = () => {
  const { connectedWallet, wallets, connect } = useAuth()

  const list = wallets
    .filter(({ name }) => name !== connectedWallet?.name)
    .map((wallet) => {
      const select = () => {
        connect(name)
        clearStoredPassword()
      }

      const { name, address } = wallet
      return {
        children: (
          <Flex gap={4} start>
            {isWallet.multisig(wallet) && <MultisigBadge />}
            {name}
          </Flex>
        ),
        description: address,
        onClick: select,
      }
    })

  return <ExtensionList list={list} />
}

export default SwitchWallet
