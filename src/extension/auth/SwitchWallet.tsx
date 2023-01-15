import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { Flex, Grid } from "components/layout"
import { isWallet, useAuth } from "auth"
import MultisigBadge from "auth/components/MultisigBadge"
import UsbIcon from "@mui/icons-material/Usb"
import BluetoothIcon from "@mui/icons-material/Bluetooth"
import SelectPreconfigured from "auth/modules/select/SelectPreconfigured"
import { clearStoredPassword } from "../storage"
import ExtensionList from "../components/ExtensionList"
import { addressFromWords } from "utils/bech32"

const SwitchWallet = ({ manage }: { manage?: () => void }) => {
  const { wallet, wallets, connect, connectedWallet } = useAuth()

  const list = [
    wallet && {
      children: (
        <Flex gap={4} start>
          {isWallet.multisig(wallet) && <MultisigBadge />}
          {isWallet.ledger(wallet) &&
            (wallet.bluetooth ? (
              <BluetoothIcon fontSize="small" />
            ) : (
              <UsbIcon fontSize="small" />
            ))}
          {"name" in wallet ? wallet.name : "Ledger"}
        </Flex>
      ),
      description: wallet.words,
      active: true,
      onClick: () => {},
      manage,
    },
    ...wallets
      .filter(({ name }) => name !== connectedWallet?.name)
      .sort((a, b) => {
        if (a.name === connectedWallet?.name) return -1
        if (b.name === connectedWallet?.name) return 1
        return 0
      })
      .map((wallet) => {
        const select = () => {
          connect(name)
          clearStoredPassword()
        }

        const { name, lock } = wallet

        const address =
          "address" in wallet
            ? wallet.address
            : addressFromWords(wallet.words["330"])

        const children = (
          <Flex gap={4} start>
            {isWallet.multisig(wallet) && <MultisigBadge />}
            {isWallet.ledger(wallet) &&
              (wallet.bluetooth ? (
                <BluetoothIcon fontSize="small" />
              ) : (
                <UsbIcon fontSize="small" />
              ))}
            {name}
            {lock && <LockOutlinedIcon fontSize="inherit" className="muted" />}
          </Flex>
        )

        return lock
          ? {
              children,
              to: `/auth/unlock/${name}`,
            }
          : {
              children,
              description: address,
              onClick: select,
            }
      }),
  ]

  return (
    <Grid gap={8}>
      <SelectPreconfigured />
      <ExtensionList
        list={list.filter((item) => item !== undefined) as any[]}
      />
    </Grid>
  )
}

export default SwitchWallet
