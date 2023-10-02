import { ReactComponent as ReceiveIcon } from "styles/images/icons/Receive_v2.svg"
import { ReactComponent as SendIcon } from "styles/images/icons/Send_v2.svg"
import { ReactComponent as AddIcon } from "styles/images/icons/Buy_v2.svg"
import { useNetworkName, useNetwork, useChainID } from "data/wallet"
import { useIsWalletEmpty } from "data/queries/bank"
import { useKado } from "pages/wallet/Buy"
import { useWalletRoute, Path } from "./Wallet"
import { useTranslation } from "react-i18next"
import styles from "./NetWorth.module.scss"
import { capitalize } from "@mui/material"
import { useMemo } from "react"
import { FlexColumn, RoundedButton } from "station-ui"
import { ReactComponent as Swap } from "styles/images/icons/Swap.svg"

interface WalletActionButton {
  icon: JSX.Element
  label: string
  onClick: () => void
  disabled?: boolean
  primary?: boolean
  hide?: boolean
}

const WalletActionButtons = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const networks = useNetwork()
  const chainID = useChainID()
  const { setRoute, route } = useWalletRoute()
  const { openModal } = useKado()
  const networkName = useNetworkName()

  const availableGasDenoms = useMemo(
    () => Object.keys(networks[chainID]?.gasPrices ?? {}),
    [chainID, networks]
  )

  const sendButtonDisabled = isWalletEmpty && !!availableGasDenoms.length

  const buttons: WalletActionButton[] = [
    {
      icon: <SendIcon />,
      primary: true,
      label: t("send"),
      onClick: () =>
        setRoute({
          path: Path.send,
          previousPage: route,
        }),
      disabled: sendButtonDisabled,
    },
    {
      icon: <Swap />,
      label: t("swap"),
      onClick: () => {},
      hide: route.path !== Path.wallet,
    },
    {
      icon: <ReceiveIcon />,
      label: t("receive"),
      onClick: () =>
        setRoute({
          path: Path.receive,
          previousPage: route,
        }),
    },
    {
      icon: <AddIcon />,
      label: t("buy"),
      onClick: () => openModal(),
      disabled: networkName !== "mainnet",
    },
  ]

  return (
    <div className={styles.networth__buttons}>
      {buttons.map(({ icon, label, onClick, disabled, primary }) => (
        <FlexColumn key={label}>
          <RoundedButton
            variant={primary ? "primary" : "secondary"}
            onClick={onClick}
            icon={icon}
            disabled={disabled}
          />
          <span>{capitalize(label)}</span>
        </FlexColumn>
      ))}
    </div>
  )
}

export default WalletActionButtons
