import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded"
import UsbIcon from "@mui/icons-material/Usb"
import BluetoothIcon from "@mui/icons-material/Bluetooth"
import { useAuth } from "auth"
import {
  FlexColumn,
  ModalButton,
  NavButton,
  WalletList,
  useModal,
} from "@terra-money/station-ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import AddWallet from "./AddWallet"
import ManageWallet from "./ManageWallet"
import styles from "./SelectWallets.module.scss"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { ReactComponent as WalletIcon } from "styles/images/icons/Wallet.svg"
import { bech32 } from "bech32"
import is from "auth/scripts/is"
import { addressFromWords } from "utils/bech32"
import { truncate } from "@terra-money/terra-utils"

enum Path {
  select = "select",
  manage = "manage",
  add = "add",
}

type Navigation =
  | {
      path: Path.select | Path.add
    }
  | {
      path: Path.manage
      wallet: string
    }

export default function ManageWallets() {
  const { wallet, wallets } = useAuth()
  const { t } = useTranslation()
  const [route, setRoute] = useState<Navigation>({ path: Path.select })
  const selectedWallet = wallets.find((w) => {
    if ("words" in w) {
      return w.words["330"] === wallet?.words["330"]
    } else {
      return (
        Buffer.from(bech32.decode(w.address).words).toString("hex") ===
        wallet?.words["330"]
      )
    }
  })
  const isLedger = is.ledger(wallet)

  if (!selectedWallet && !isLedger)
    return (
      <button className={styles.manage__wallets}>
        <WalletIcon style={{ fontSize: 20 }} /> Connect wallet
      </button>
    )

  function renderTitle() {
    switch (route.path) {
      case Path.select:
        return t("Wallet Selector")
      case Path.manage:
        return t("Manage Wallet")
      case Path.add:
        return t("Add Wallet")
    }
  }

  return (
    <ModalButton
      title={renderTitle()}
      renderButton={(open) => (
        <button
          onClick={() => {
            open()
            setRoute({ path: Path.select })
          }}
          className={styles.manage__wallets}
          data-testid="manage-wallets-button"
        >
          {isLedger ? (
            wallet.bluetooth ? (
              <BluetoothIcon style={{ fontSize: 18 }} />
            ) : (
              <UsbIcon style={{ fontSize: 18 }} />
            )
          ) : (
            <WalletIcon style={{ fontSize: 18 }} />
          )}{" "}
          {wallet && "name" in wallet ? wallet.name : "Ledger"}
          <ArrowDropDownIcon
            style={{ marginLeft: "-6px", fontSize: "1.25rem" }}
          />
        </button>
      )}
      //maxHeight
    >
      {route.path !== Path.select && (
        <button
          onClick={() => setRoute({ path: Path.select })}
          style={{ position: "absolute", top: 43, left: 30 }}
        >
          <KeyboardBackspaceRoundedIcon style={{ fontSize: 24 }} />
        </button>
      )}
      <ManageWalletsModal route={route} setRoute={setRoute} />
    </ModalButton>
  )
}

interface Props {
  route: Navigation
  setRoute: (path: Navigation) => void
}

function ManageWalletsModal({ route, setRoute }: Props) {
  const { t } = useTranslation()
  const { closeModal } = useModal()
  const { wallets, connect, connectedWallet } = useAuth()
  const activeWalletAddress = addressFromWords(
    connectedWallet?.words["330"] ?? "",
    "terra"
  )

  switch (route.path) {
    case Path.select:
      return (
        <FlexColumn gap={24} className={styles.select__wallet__container}>
          <NavButton
            label={t("Add Wallet")}
            onClick={() => setRoute({ path: Path.add })}
          />
          <WalletList
            activeWallet={{
              name: connectedWallet?.name ?? "",
              address: activeWalletAddress,
              settingsOnClick: () =>
                setRoute({
                  path: Path.manage,
                  wallet: connectedWallet?.name ?? "",
                }),
            }}
            otherWallets={wallets
              .filter(({ name }) => name !== connectedWallet?.name)
              .map((wallet) => ({
                name: wallet.name,
                address:
                  "address" in wallet
                    ? wallet.address
                    : addressFromWords(wallet.words["330"], "terra"),
                onClick: () => {
                  connect(wallet.name)
                  closeModal()
                },
                settingsOnClick: () =>
                  setRoute({
                    path: Path.manage,
                    wallet: wallet.name,
                  }),
              }))}
          />
        </FlexColumn>
      )

    case Path.add:
      return <AddWallet />

    case Path.manage:
      return <ManageWallet wallet={route.wallet} />
  }
}
