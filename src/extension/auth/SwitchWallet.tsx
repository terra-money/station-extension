import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { Flex, Grid } from "components/layout"
import { isWallet, useAuth } from "auth"
import MultisigBadge from "auth/components/MultisigBadge"
import SelectPreconfigured from "auth/modules/select/SelectPreconfigured"
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

  return (
    <Grid gap={8}>
      <SelectPreconfigured />
      <ExtensionList list={list} />
    </Grid>
  )
}

export default SwitchWallet
