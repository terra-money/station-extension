import { useNativeDenoms, useUnknownIBCDenoms } from "data/token"
import { useWalletRoute, Page } from "./Wallet"
import styles from "./AssetPage.module.scss"
import { Read, TokenIcon } from "components/token"
import { useCurrency } from "data/settings/Currency"
import { useExchangeRates } from "data/queries/coingecko"
import { CoinBalance, useBankBalance } from "data/queries/bank"
import AssetChain from "./AssetChain"
import { useTranslation } from "react-i18next"
import AssetVesting from "./AssetVesting"
import { useNetworkName } from "data/wallet"
import { SectionHeader } from "station-ui"
import { useMemo } from "react"
import WalletActionButtons from "./WalletActionButtons"
import { useAccount } from "data/queries/vesting"
import { parseVestingSchedule } from "data/queries/vesting"

const AssetPage = () => {
  const currency = useCurrency()
  const { data: prices } = useExchangeRates()
  const balances = useBankBalance()
  const readNativeDenom = useNativeDenoms()
  const { t } = useTranslation()
  const { route } = useWalletRoute()
  const networkName = useNetworkName()
  const routeDenom = route.page === Page.coin ? route.denom ?? "uluna" : "uluna"
  const [chain, denom] = routeDenom.includes("*")
    ? routeDenom.split("*")
    : [undefined, routeDenom]
  const { token, symbol, icon, decimals } = readNativeDenom(denom, chain)
  const unknownIBCDenoms = useUnknownIBCDenoms()
  const { data: account } = useAccount()
  const schedule = useMemo(() => {
    if (!account) return null
    console.log("account", account)
    return parseVestingSchedule(account)
  }, [account])

  const price = useMemo(() => {
    if (symbol === "LUNC" && networkName !== "classic") {
      return prices?.["uluna:classic"]?.price ?? 0
    } else if (!symbol.endsWith("...")) {
      return prices?.[token]?.price ?? 0
    } else return 0
  }, [prices, symbol, token, networkName])

  const supportedFilter = (b: CoinBalance) => {
    const balToken = readNativeDenom(b.denom, b.chain)
    return balToken.token === token && balToken.symbol === symbol
  }

  const unsupportedFilter = (b: CoinBalance) => {
    // only return unsupported token if the current chain is found in the ibc path
    if (chain) {
      return (
        unknownIBCDenoms[[b.denom, b.chain].join("*")]?.baseDenom === token &&
        unknownIBCDenoms[[b.denom, b.chain].join("*")]?.chains?.[0] === chain
      )
    }
    return unknownIBCDenoms[[b.denom, b.chain].join("*")]?.baseDenom === token
  }

  const AssetVestingList = () => {
    if (token !== "uluna" || symbol === "LUNC" || !schedule) return null
    return (
      <>
        <SectionHeader
          title={t("Vesting")}
          withLine
          className={styles.chainlist__title}
        />
        <AssetVesting schedule={schedule} />
      </>
    )
  }

  const AssetChainList = ({
    title,
    data,
  }: {
    title: string
    data: CoinBalance[]
  }) => {
    if (data.length === 0) return null
    return (
      <div className={styles.chainlist}>
        <SectionHeader
          title={title}
          withLine
          className={styles.chainlist__title}
        />
        <div className={styles.chainlist__list}>
          {data
            .sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
            .map((b, i) => (
              <AssetChain
                key={b.denom + b.chain}
                symbol={symbol}
                balance={b.amount}
                chain={b.chain}
                price={price}
                denom={b.denom}
                decimals={decimals}
              />
            ))}
          <AssetVestingList />
        </div>
      </div>
    )
  }

  const AssetPageHeader = () => {
    const totalBalance = [
      ...balances.filter(supportedFilter),
      ...balances.filter(unsupportedFilter),
    ].reduce((acc, b) => acc + parseInt(b.amount), 0)

    return (
      <section className={styles.details}>
        <TokenIcon token={token} icon={icon} size={50} />
        <h1>
          {currency.symbol}{" "}
          {price ? (
            <Read decimals={decimals} amount={totalBalance * price} fixed={2} />
          ) : (
            <span>—</span>
          )}
        </h1>
        <Read decimals={decimals} amount={totalBalance} fixed={2} /> {symbol}
        <WalletActionButtons denom={token} />
      </section>
    )
  }
  return (
    <>
      <AssetPageHeader />
      <section className={styles.chainlist__container}>
        <AssetChainList
          title={t("Balances")}
          data={balances.filter(supportedFilter)}
        />
        <AssetChainList
          title={t("Unsupported Assets")}
          data={balances.filter(unsupportedFilter)}
        />
      </section>
    </>
  )
}

export default AssetPage
