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
import { FlexColumn, RoundedButton } from "@terra-money/station-ui"
import { ReactComponent as Swap } from "styles/images/icons/Swap.svg"
import { useLocation, useNavigate } from "react-router-dom"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { useNativeDenoms } from "data/token"
import { openURL } from "extension/storage"
import { useIsLedger } from "utils/ledger"

interface WalletActionButton {
  icon: JSX.Element
  label: string
  onClick: () => void
  disabled?: boolean
  primary?: boolean
  hide?: boolean
}

const WalletActionButtons = ({ denom }: { denom?: Denom }) => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const networks = useNetwork()
  const chainID = useChainID()
  const { openModal } = useKado()
  const navigate = useNavigate()
  const networkName = useNetworkName()
  const { pathname } = useLocation()
  const readNativeDenom = useNativeDenoms()
  const token = readNativeDenom(denom ?? "")
  const addresses = useInterchainAddresses()
  const isLedger = useIsLedger()

  const address = useMemo(() => {
    if (!addresses) return ""
    return addresses[token.chainID]
  }, [addresses, token])

  const availableGasDenoms = useMemo(
    () => Object.keys(networks[chainID]?.gasPrices ?? {}),
    [chainID, networks]
  )

  const sendButtonDisabled = isWalletEmpty && !!availableGasDenoms.length

  const buttons: WalletActionButton[] = [
    {
      icon: <SendIcon />,
      primary: true,
      label: t("Send"),
      onClick: () =>
        (isLedger ? openURL : navigate)(
          `/send/1`,
          denom ? { denom } : undefined
        ),
      disabled: sendButtonDisabled,
    },
    {
      icon: <Swap />,
      label: t("Swap"),
      onClick: () =>
        (isLedger ? openURL : navigate)(`/swap`, denom ? { denom } : undefined),
      hide: networkName !== "mainnet",
    },
    {
      icon: <ReceiveIcon />,
      label: t("Receive"),
      onClick: () => navigate(`/receive/${address ?? ""}`),
    },
    {
      icon: <AddIcon />,
      label: t("Buy"),
      onClick: () => openModal(),
      disabled: networkName !== "mainnet",
      hide: pathname.includes("/asset/"),
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
              <span className={styles.button__text}>{capitalize(label)}</span>
            </FlexColumn>
          )
      )}
    </div>
  )
}

export default WalletActionButtons
