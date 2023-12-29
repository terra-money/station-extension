import { useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { capitalize } from "@mui/material"
import {
  BuyIcon,
  FlexColumn,
  ReceiveIcon,
  RoundedButton,
  SendArrowIcon,
  SwapArrowsIcon
} from "@terra-money/station-ui"
import { useNetworkName, useNetwork, useChainID } from "data/wallet"
import { useIsWalletEmpty } from "data/queries/bank"
import { useNativeDenoms } from "data/token"
import { useKado } from "pages/wallet/Buy"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { useNativeDenoms } from "data/token"
import { openURL } from "extension/storage"
import { useIsLedger } from "utils/ledger"
import styles from "./NetWorth.module.scss"

interface WalletActionButton {
  icon: JSX.Element
  label: string
  size: "default" | "large" | "small" | undefined
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
      icon: (
        <SendArrowIcon width={16} height={16} fill="var(--token-light-white)" />
      ),
      size: "default",
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
      icon: (
        <SwapArrowsIcon
          width={16}
          height={16}
          fill="var(--token-light-white)"
        />
      ),
      size: "default",
      label: t("Swap"),
      onClick: () =>
        (isLedger ? openURL : navigate)(`/swap`, denom ? { denom } : undefined),
      hide: networkName !== "mainnet",
    },
    {
      icon: (
        <ReceiveIcon width={16} height={16} fill="var(--token-light-white)" />
      ),
      size: "default",
      label: t("Receive"),
      onClick: () => navigate(`/receive/${address ?? ""}`),
    },
    {
      icon: <BuyIcon width={16} height={16} fill="var(--token-light-white)" />,
      size: "default",
      label: t("Buy"),
      onClick: () => openModal(),
      disabled: networkName !== "mainnet",
      hide: pathname.includes("/asset/"),
    },
  ]

  return (
    <div className={styles.networth__buttons}>
      {buttons.map(
        ({ size, icon, label, onClick, disabled, primary, hide }) =>
          !hide && (
            <FlexColumn key={label} gap={8}>
              <RoundedButton
                size={size}
                variant={primary ? "primary" : "secondary"}
                onClick={onClick}
                icon={icon}
                disabled={disabled}
              />
              <span className={styles.networth__buttons__labels}>
                {capitalize(label)}
              </span>
            </FlexColumn>
          )
      )}
    </div>
  )
}

export default WalletActionButtons
