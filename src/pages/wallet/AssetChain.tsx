import { useNetworks } from "app/InitNetworks"
import { WithFetching } from "components/feedback"
import { Read, TokenIcon } from "components/token"
import { useExchangeRates } from "data/queries/coingecko"
import { useCurrency } from "data/settings/Currency"
import { useNetwork, useNetworkName } from "data/wallet"
import { useTranslation } from "react-i18next"
import styles from "./AssetChain.module.scss"
import IbcSendBack from "./IbcSendBack"
import { InternalButton } from "components/general"

export interface Props {
  chain: string
  balance: string
  symbol: string
  decimals: number
  token: string
  path?: string[]
  ibcDenom?: string
}

const AssetChain = (props: Props) => {
  const { chain, symbol, balance, decimals, token, path, ibcDenom } = props
  const currency = useCurrency()
  const { data: prices, ...pricesState } = useExchangeRates()
  const { t } = useTranslation()

  const networks = useNetwork()

  const { icon, name } = networks[chain]
  return (
    <article className={styles.chain} key={name}>
      <TokenIcon token={name} icon={icon} size={50} />

      <section className={styles.details}>
        <h1 className={styles.name}>
          <h4>
            {name}{" "}
            {ibcDenom && path && (
              <IbcSendBack
                chainID={chain}
                token={ibcDenom}
                title={`Send ${symbol} back to ${
                  networks[path[path.length - 1]]?.name ?? path[path.length - 1]
                }`}
              >
                {(open) => (
                  <InternalButton
                    onClick={open}
                    className={styles.send__back__button}
                  >
                    {t("Send back")}
                  </InternalButton>
                )}
              </IbcSendBack>
            )}
          </h4>
          {path && <p>{path.map((c) => networks[c]?.name ?? c).join(" → ")}</p>}
        </h1>
        <h1 className={styles.price}>
          {currency.symbol}{" "}
          <Read
            {...props}
            amount={(prices?.[token]?.price || 0) * parseInt(balance)}
            decimals={decimals}
            fixed={2}
            denom=""
            token=""
          />
        </h1>
        <h2 className={styles.amount}>
          <WithFetching {...pricesState} height={1}>
            {(progress, wrong) => (
              <>
                {progress}
                {wrong ? (
                  <span className="danger">{t("Failed to query balance")}</span>
                ) : (
                  <Read {...props} amount={balance} token="" />
                )}
              </>
            )}
          </WithFetching>{" "}
          {symbol}
        </h2>
      </section>
    </article>
  )
}

export default AssetChain
