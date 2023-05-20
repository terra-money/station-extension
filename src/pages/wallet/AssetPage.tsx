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

const AssetPage = () => {
  const currency = useCurrency()
  const { data: prices } = useExchangeRates()
  const balances = useBankBalance()
  const readNativeDenom = useNativeDenoms()
  const { t } = useTranslation()
  const { setRoute, route } = useWalletRoute()
  const denom = route.path === Path.coin ? route.denom : "uluna"
  const { token, symbol, icon, decimals } = readNativeDenom(denom)

  const unknownIBCDenomsData = useIBCBaseDenoms(
    balances
      .map(({ denom, chain }) => ({ denom, chainID: chain }))
      .filter(({ denom }) => {
        const data = readNativeDenom(denom)
        return denom.startsWith("ibc/") && data.symbol.endsWith("...")
      })
  )
  const unknownIBCDenoms = unknownIBCDenomsData.reduce(
    (acc, { data }) => (data ? { ...acc, [data.ibcDenom]: data } : acc),
    {} as Record<string, { baseDenom: string; chainIDs: string[] }>
  )

  const filteredBalances = balances.filter(
    ({ denom }) =>
      readNativeDenom(unknownIBCDenoms[denom]?.baseDenom ?? denom).token ===
      token
  )
  const totalBalance = filteredBalances.reduce(
    (acc, { amount }) => acc + parseInt(amount),
    0
  )
  const price = symbol?.endsWith("...") ? 0 : prices?.[token]?.price ?? 0

  const availableChains = filteredBalances.filter(
    ({ denom }) => !unknownIBCDenoms[denom]
  ).length

  return (
    <>
      <section className={styles.details}>
        <TokenIcon token={token} icon={icon} size={50} />
        <h1>
          {currency.symbol}{" "}
          <Read
            decimals={decimals}
            amount={totalBalance * price}
            fixed={2}
            token={symbol}
          />
        </h1>
        <p>
          <Read decimals={decimals} amount={totalBalance} token={symbol} />{" "}
          {symbol}
        </p>
      </section>
      <section className={styles.chainlist}>
        <div>
          {!!availableChains && (
            <>
              <h3>{t("Chains")}</h3>
              <div className={styles.chainlist__list}>
                {filteredBalances
                  .sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
                  .filter(({ denom }) => !unknownIBCDenoms[denom])
                  .map((b, i) => (
                    <div key={i}>
                      <AssetChain
                        symbol={symbol}
                        balance={b.amount}
                        chain={b.chain}
                        token={token}
                        decimals={decimals}
                      />
                      {token === "uluna" && isTerraChain(b.chain) && (
                        <Vesting />
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
          {availableChains !== filteredBalances.length && (
            <>
              <h3>{t("Unsupported IBC denoms")}</h3>
              <div className={styles.chainlist__list}>
                {filteredBalances
                  .sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
                  .filter(({ denom }) => !!unknownIBCDenoms[denom])
                  .map((b, i) => (
                    <div key={i}>
                      <AssetChain
                        symbol={symbol}
                        balance={b.amount}
                        chain={b.chain}
                        token={token}
                        decimals={decimals}
                        path={unknownIBCDenoms[b.denom].chainIDs}
                      />
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
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
          disabled={!availableChains}
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
          disabled={!availableChains}
        >
          {capitalize(t("receive"))}
        </Button>
      </section>
    </>
  )
}

export default AssetPage
