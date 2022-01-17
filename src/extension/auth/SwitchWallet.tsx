import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { Flex } from "components/layout"
import { isWallet, useAuth } from "auth"
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

      const { name, address, lock } = wallet

      const children = (
        <Flex gap={4} start>
          {isWallet.multisig(wallet) && <MultisigBadge />}
          {name}
          {lock && <LockOutlinedIcon fontSize="inherit" className="muted" />}
        </Flex>
      )

      return lock
        ? { children, to: `/auth/unlock/${name}` }
        : { children, description: address, onClick: select }
    })

  return <ExtensionList list={list} />
}

export default SwitchWallet
