import { useNativeDenoms } from "data/token"
import { useWalletRoute, Path } from "./Wallet"
import styles from "./AssetPage.module.scss"
import { Read, TokenIcon } from "components/token"
import { useCurrency } from "data/settings/Currency"
import { useExchangeRates } from "data/queries/coingecko"
import { useBankBalance } from "data/queries/bank"
import AssetChain from "./AssetChain"
import { Button } from "components/general"
import { useTranslation } from "react-i18next"
import { capitalize } from "@mui/material"
import { isTerraChain } from "utils/chain"
import Vesting from "./Vesting"
import { useIBCBaseDenoms } from "data/queries/ibc"
import { useNetworkName } from "data/wallet"

const AssetPage = () => {
  const currency = useCurrency()
  const { data: prices } = useExchangeRates()
  const balances = useBankBalance()
  const readNativeDenom = useNativeDenoms()
  const { t } = useTranslation()
  const { setRoute, route } = useWalletRoute()
  const networkName = useNetworkName()
  const routeDenom = route.path === Path.coin ? route.denom ?? "uluna" : "uluna"
  const [chain, denom] = routeDenom.includes("*")
    ? routeDenom.split("*")
    : [undefined, routeDenom]
  const { token, symbol, icon, decimals } = readNativeDenom(denom, chain)

  let price
  if (symbol === "LUNC" && networkName === "mainnet") {
    price = prices?.["uluna:classic"]?.price ?? 0
  } else if (!symbol.endsWith("...")) {
    price = prices?.[token]?.price ?? 0
  } else {
    price = 0
  }

  const unknownIBCDenomsData = useIBCBaseDenoms(
    balances
      .map(({ denom, chain }) => ({ denom, chainID: chain }))
      .filter(({ denom }) => {
        const data = readNativeDenom(denom)
        return denom.startsWith("ibc/") && data.symbol.endsWith("...")
      })
  )

  const unknownIBCDenoms = unknownIBCDenomsData.reduce(
    (acc, { data }) =>
      data
        ? {
            ...acc,
            [data.ibcDenom]: {
              baseDenom: data.baseDenom,
              chains: data?.chainIDs,
            },
          }
        : acc,
    {} as Record<string, { baseDenom: string; chains: string[] }>
  )

  const filteredBalances = balances.filter((b) => {
    return (
      readNativeDenom(b.denom).token === token &&
      readNativeDenom(b.denom).symbol === symbol
    )
  })

  const filteredUnsupportedBalances = balances.filter((b) => {
    // only return unsupported token if the current chain is found in the ibc path
    if (chain) {
      return (
        unknownIBCDenoms[b.denom]?.baseDenom === token &&
        unknownIBCDenoms[b.denom]?.chains?.includes(chain)
      )
    }

    return unknownIBCDenoms[b.denom]?.baseDenom === token
  })

  const totalBalance = [
    ...filteredBalances,
    ...filteredUnsupportedBalances,
  ].reduce((acc, b) => acc + parseInt(b.amount), 0)

  return (
    <>
      <section className={styles.details}>
        <TokenIcon token={token} icon={icon} size={50} />
        <h1>
          {currency.symbol}{" "}
          <Read decimals={decimals} amount={totalBalance * price} fixed={2} />
        </h1>
        <p>
          <Read decimals={decimals} amount={totalBalance} fixed={2} /> {symbol}
        </p>
      </section>
      <section className={styles.chainlist__container}>
        {filteredBalances.length > 0 && (
          <div className={styles.chainlist}>
            <div className={styles.chainlist__title}>
              <h3>{t("Chains")}</h3>
            </div>
            <div className={styles.chainlist__list}>
              {filteredBalances
                .sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
                .map((b, i) => (
                  <div key={i}>
                    <AssetChain
                      symbol={symbol}
                      balance={b.amount}
                      chain={b.chain}
                      token={token}
                      decimals={decimals}
                    />
                    {token === "uluna" &&
                      symbol !== "LUNC" &&
                      isTerraChain(b.chain) && <Vesting />}
                  </div>
                ))}
            </div>
          </div>
        )}
        {filteredUnsupportedBalances.length > 0 && (
          <div className={styles.chainlist}>
            <div className={styles.chainlist__title}>
              <h3>{t("Unsupported Chains")}</h3>
            </div>
            <div className={styles.chainlist__list}>
              {filteredUnsupportedBalances
                .sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
                .map((b, i) => (
                  <div key={i}>
                    <AssetChain
                      symbol={symbol}
                      balance={b.amount}
                      chain={b.chain}
                      token={token}
                      decimals={decimals}
                      path={unknownIBCDenoms[b.denom]?.chains}
                      ibcDenom={b.denom}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>

      <section className={styles.actions}>
        <Button
          color="primary"
          onClick={() =>
            setRoute({
              path: Path.send,
              denom,
              previousPage: route,
            })
          }
          disabled={filteredBalances.length === 0}
        >
          {t("Send")}
        </Button>
        <Button
          onClick={() =>
            setRoute({
              path: Path.receive,
              previousPage: route,
            })
          }
        >
          {capitalize(t("receive"))}
        </Button>
      </section>
    </>
  )
}

export default AssetPage
