import { ReactComponent as ReceiveIcon } from "styles/images/icons/Receive_v2.svg"
import { ReactComponent as SendIcon } from "styles/images/icons/Send_v2.svg"
import { ReactComponent as AddIcon } from "styles/images/icons/Buy_v2.svg"
import { useNetworkName, useNetwork, useChainID } from "data/wallet"
import { useIsWalletEmpty, useBankBalance } from "data/queries/bank"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { FIAT_RAMP, KADO_API_KEY } from "config/constants"
import { useExchangeRates } from "data/queries/coingecko"
import { useCurrency } from "data/settings/Currency"
import { TooltipIcon } from "components/display"
import NetWorthTooltip from "./NetWorthTooltip"
import { useWalletRoute, Path } from "./Wallet"
import { useTranslation } from "react-i18next"
import { useNativeDenoms } from "data/token"
import { Button } from "components/general"
import styles from "./NetWorth.module.scss"
import { capitalize } from "@mui/material"
import { Read } from "components/token"
import classNames from "classnames"
import { useMemo } from "react"
import qs from "qs"

const cx = classNames.bind(styles)

const NetWorth = () => {
  const { t } = useTranslation()

  const isWalletEmpty = useIsWalletEmpty()
  const networks = useNetwork()
  const chainID = useChainID()
  const availableGasDenoms = useMemo(() => {
    return Object.keys(networks[chainID]?.gasPrices ?? {})
  }, [chainID, networks])
  const sendButtonDisabled = isWalletEmpty && !!availableGasDenoms.length

  const currency = useCurrency()
  const coins = useBankBalance()
  const { data: prices } = useExchangeRates()
  const readNativeDenom = useNativeDenoms()
  const { setRoute, route } = useWalletRoute()
  const addresses = useInterchainAddresses()
  const network = useNetwork()
  const networkName = useNetworkName()

  // TODO: show CW20 balances and staked tokens
  const coinsValue = coins?.reduce((acc, { amount, denom }) => {
    const { token, decimals, symbol } = readNativeDenom(denom)
    return (
      acc +
      (parseInt(amount) *
        (symbol?.endsWith("...") ? 0 : prices?.[token]?.price ?? 0)) /
        10 ** decimals
    )
  }, 0)
  const onToAddressMulti =
    addresses &&
    Object.keys(addresses ?? {})
      .map((key) => `${network[key].name}:${addresses[key]}`)
      .join(",")

  const rampParams = {
    network: "Terra",
    apiKey: KADO_API_KEY,
    product: "BUY",
    onRevCurrency: "USDC",
    networkList: ["TERRA", "OSMOSIS", "KUJIRA", "JUNO"].join(","),
    productList: ["BUY", "SELL"].join(","),
    cryptoList: ["USDC"].join(","),
    onToAddressMulti,
  }

  const kadoUrlParams = qs.stringify(rampParams)

  const openKadoWindow = () => {
    window.open(
      `${FIAT_RAMP}?${kadoUrlParams}`,
      "_blank",
      "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=420,height=680"
    )
  }

  return (
    <article className={styles.networth}>
      <TooltipIcon content={<NetWorthTooltip />} placement="bottom">
        <p>{capitalize(t("portfolio value"))}</p>
      </TooltipIcon>
      <h1>
        {currency.symbol}{" "}
        <Read
          className={styles.amount}
          amount={coinsValue}
          decimals={0}
          fixed={2}
          denom=""
          token=""
        />
      </h1>
      <div className={styles.networth__buttons}>
        <div className={styles.button__wrapper}>
          <Button
            color="primary"
            className={styles.wallet_primary}
            disabled={sendButtonDisabled}
            onClick={() =>
              setRoute({
                path: Path.send,
                previousPage: route,
              })
            }
          >
            <SendIcon className={cx(styles.icon, styles.send)} />
          </Button>
          <h3>{capitalize(t("send"))}</h3>
        </div>
        <div className={styles.button__wrapper}>
          <Button
            className={styles.wallet_default}
            onClick={() =>
              setRoute({
                path: Path.receive,
                previousPage: route,
              })
            }
          >
            <ReceiveIcon className={cx(styles.icon, styles.receive)} />
          </Button>
          <h3>{capitalize(t("receive"))}</h3>
        </div>
        {networkName === "mainnet" && (
          <div className={styles.button__wrapper}>
            <Button className={styles.wallet_default} onClick={openKadoWindow}>
              <AddIcon className={styles.icon} />
            </Button>
            <h2>{t(capitalize("buy"))}</h2>
          </div>
        )}
      </div>
    </article>
  )
}

export default NetWorth
