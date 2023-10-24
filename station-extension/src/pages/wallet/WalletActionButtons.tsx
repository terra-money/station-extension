import { ReactComponent as ReceiveIcon } from "styles/images/icons/Receive_v2.svg"
import { ReactComponent as SendIcon } from "styles/images/icons/Send_v2.svg"
import { ReactComponent as AddIcon } from "styles/images/icons/Buy_v2.svg"
import { useNetworkName, useNetwork, useChainID } from "data/wallet"
import { useIsWalletEmpty } from "data/queries/bank"
import { useKado } from "pages/wallet/Buy"
import { useTranslation } from "react-i18next"
import styles from "./NetWorth.module.scss"
import { capitalize } from "@mui/material"
import { useMemo } from "react"
import { FlexColumn, RoundedButton } from "station-ui"
import { ReactComponent as Swap } from "styles/images/icons/Swap.svg"
import { useLocation, useNavigate } from "react-router-dom"

interface WalletActionButton {
  icon: JSX.Element
  label: string
  onClick: () => void
  disabled?: boolean
  primary?: boolean
  hide?: boolean
  denom?: string
}

const WalletActionButtons = ({ denom = "uluna" }: { denom?: string }) => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const networks = useNetwork()
  const chainID = useChainID()
  const { openModal } = useKado()
  const navigate = useNavigate()
  const networkName = useNetworkName()
  const location = useLocation()

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
      onClick: () => navigate(`/wallet/send/${denom}`),
      disabled: sendButtonDisabled,
    },
    {
      icon: <Swap />,
      label: t("swap"),
      onClick: () => navigate(`/wallet/swap/${denom}`),
      hide: location.pathname.includes("swap"),
    },
    {
      icon: <ReceiveIcon />,
      label: t("receive"),
      onClick: () => navigate(`/wallet/receive`),
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
      {buttons.map(
        ({ icon, label, onClick, disabled, primary, hide }) =>
          !hide && (
            <FlexColumn key={label}>
              <RoundedButton
                variant={primary ? "primary" : "secondary"}
                onClick={onClick}
                icon={icon}
                disabled={disabled}
              />
              <span>{capitalize(label)}</span>
            </FlexColumn>
          )
      )}
    </div>
  )
}

export default WalletActionButtons
