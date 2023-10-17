import { ReactComponent as ReceiveIcon } from "styles/images/icons/Receive_v2.svg"
import { ReactComponent as SendIcon } from "styles/images/icons/Send_v2.svg"
import { ReactComponent as AddIcon } from "styles/images/icons/Buy_v2.svg"
import { useNetworkName, useNetwork, useChainID } from "data/wallet"
import { useIsWalletEmpty } from "data/queries/bank"
import { useKado } from "pages/wallet/Buy"
import { useWalletRoute, Page } from "./Wallet"
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
  hidden?: boolean
  denom?: string
  variant: "primary" | "secondary"
}

const WalletActionButtons = ({ denom = "uluna" }: { denom?: Denom }) => {
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
      variant: "primary",
      label: t("send"),
      onClick: () => setRoute({ page: Page.send, denom }),
      disabled: sendButtonDisabled,
    },
    {
      icon: <Swap />,
      label: t("swap"),
      variant: "secondary",
      onClick: () => setRoute({ page: Page.swap }),
      hidden: route.page !== Page.wallet,
    },
    {
      icon: <ReceiveIcon />,
      label: t("receive"),
      variant: "secondary",
      onClick: () => setRoute({ page: Page.receive }),
    },
    {
      icon: <AddIcon />,
      label: t("buy"),
      onClick: openModal,
      variant: "secondary",
      disabled: networkName !== "mainnet",
    },
  ]

  return (
    <div className={styles.networth__buttons}>
      {buttons.map((button) => {
        if (button.hidden) return null
        return (
          <FlexColumn key={button.label}>
            <RoundedButton {...button} />
            <span>{capitalize(button.label)}</span>
          </FlexColumn>
        )
      })}
    </div>
  )
}

export default WalletActionButtons
