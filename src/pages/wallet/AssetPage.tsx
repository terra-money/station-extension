import { useNativeDenoms, useUnknownIBCDenoms } from "data/token"
import styles from "./AssetPage.module.scss"
import { Read, TokenIcon } from "components/token"
import { useCurrency } from "data/settings/Currency"
import { useExchangeRates } from "data/queries/coingecko"
import { CoinBalance, useBankBalance } from "data/queries/bank"
import AssetChain from "./AssetChain"
import { useTranslation } from "react-i18next"
import { useNetworkName } from "data/wallet"
import { SectionHeader } from "station-ui"
import { useMemo } from "react"
import WalletActionButtons from "./WalletActionButtons"
import { useNavigate, useParams } from "react-router-dom"
import VestingCard from "./VestingCard"

const AssetPage = () => {
  const currency = useCurrency()
  const { data: prices } = useExchangeRates()
  const balances = useBankBalance()
  const readNativeDenom = useNativeDenoms()
  const { t } = useTranslation()
  const networkName = useNetworkName()
  const params = useParams()
  const routeDenom = params.denom ?? "uluna"
  const [chain, denom] = routeDenom.includes("*")
    ? routeDenom.split("*")
    : [undefined, routeDenom]
  const { token, symbol, decimals, icon } = readNativeDenom(denom, chain)
  const unknownIBCDenoms = useUnknownIBCDenoms()
  const navigate = useNavigate()

  const price = useMemo(() => {
    if (symbol === "LUNC" && networkName !== "classic") {
      return prices?.["uluna:classic"]?.price ?? 0
    } else if (!symbol.endsWith("...")) {
      return prices?.[token]?.price ?? 0
    } else return 0
  }, [prices, symbol, token, networkName])

  const supportedAssets = useMemo(() => {
    return balances.filter((b) => {
      const balToken = readNativeDenom(b.denom, b.chain)
      return balToken.token === token && balToken.symbol === symbol
    })
  }, [balances, readNativeDenom, token, symbol])

  const unsupportedAssets = useMemo(() => {
    return balances.filter((b) => {
      if (chain) {
        return (
          unknownIBCDenoms[[b.denom, b.chain].join("*")]?.baseDenom === token &&
          unknownIBCDenoms[[b.denom, b.chain].join("*")]?.chains?.[0] === chain
        )
      }
      return unknownIBCDenoms[[b.denom, b.chain].join("*")]?.baseDenom === token
    })
  }, [balances, unknownIBCDenoms, token, chain])

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
            .map((b) => (
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
        </div>
      </div>
    )
  }

  const AssetPageHeader = () => {
    const totalBalance = useMemo(
      () =>
        [...supportedAssets, ...unsupportedAssets].reduce(
          (acc, b) => acc + parseInt(b.amount),
          0
        ),
      []
    )

    return (
      <section className={styles.details}>
        <span className={styles.token}>
          <TokenIcon token={token} icon={icon} size={15} />
          <Read decimals={decimals} amount={totalBalance} fixed={2} />
          {symbol}
        </span>
        <h1>
          {currency.symbol}{" "}
          {price ? (
            <Read decimals={decimals} amount={totalBalance * price} fixed={2} />
          ) : (
            <span>—</span>
          )}
        </h1>
        <WalletActionButtons denom={token} />
      </section>
    )
  }

  const VestingSection = () => {
    if (token === "uluna" && symbol !== "LUNC") {
      return (
        <>
          <SectionHeader
            className={styles.chainlist__title}
            withLine
            title={t("Vesting")}
          />
          <div
            className={styles.vesting}
            onClick={() => navigate(`/asset/${token}/vesting`)}
          >
            <VestingCard />
          </div>
        </>
      )
    }
    return null
  }

  return (
    <>
      <AssetPageHeader />
      <section className={styles.chainlist__container}>
        <AssetChainList title={t("Balances")} data={supportedAssets} />
        <AssetChainList
          title={t("Unsupported Assets")}
          data={unsupportedAssets}
        />
        <VestingSection />
      </section>
    </>
  )
}

export default AssetPage
