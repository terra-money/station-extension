import { WithFetching } from "components/feedback"
import { Read } from "components/token"
import { useExchangeRates } from "data/queries/coingecko"
import { useCurrency } from "data/settings/Currency"
import { useNetwork, useNetworkName } from "data/wallet"
import { useTranslation } from "react-i18next"
import styles from "./AssetChain.module.scss"
// import IbcSendBack from "./IbcSendBack"
// import { CopyIcon, InternalButton } from "components/general"
// import { Tooltip } from "components/display"
// import { useDevMode } from "utils/localStorage"
// import { truncate } from "@terra-money/terra-utils"
import { useNetworks } from "app/InitNetworks"
import { TokenSingleChainListItem } from "station-ui"
import { useNativeDenoms } from "data/token"

export interface Props {
  chain: string
  balance: string
  symbol: string
  decimals: number
  token: string
  denom: string
  path?: string[]
  ibcDenom?: string
}

const AssetChain = (props: Props) => {
  const { chain, symbol, balance, decimals, token, path, denom } = props
  const currency = useCurrency()
  const { data: prices, ...pricesState } = useExchangeRates()
  const { t } = useTranslation()
  const networkName = useNetworkName()
  const allNetworks = useNetworks().networks[networkName]
  const networks = useNetwork()
  const readNativeDenom = useNativeDenoms()

  const { icon, name } = allNetworks[chain] ?? { name: chain }
  const asset = readNativeDenom(denom, chain)

  let price: number
  if (symbol === "LUNC" && networkName !== "classic") {
    price = prices?.["uluna:classic"]?.price ?? 0
  } else {
    price = prices?.[token]?.price ?? 0
  }

  // send back is not available if one of the chains the asset went through is not supprted by Station
  const isSendBackDisabled =
    !!path?.find((chain) => !networks[chain]) ||
    (symbol === "LUNC" && networkName !== "classic")

  return (
    <article className={styles.chain}>
      <section className={styles.details}>
        <TokenSingleChainListItem
          isSendBack={!isSendBackDisabled}
          tokenImg={asset.icon ?? ""}
          symbol={symbol}
          chain={{ icon, label: name }}
          priceNode={
            <>
              {currency.symbol}
              {price ? (
                <Read
                  {...props}
                  amount={price * parseInt(balance ?? "0")}
                  decimals={decimals}
                  fixed={2}
                  denom=""
                  token=""
                />
              ) : (
                <span>—</span>
              )}
            </>
          }
          amountNode={
            <WithFetching {...pricesState} yOffset={-5} height={1}>
              {(progress, wrong) => (
                <>
                  {progress}
                  {wrong ? (
                    <span className="danger">
                      {t("Failed to query balance")}
                    </span>
                  ) : (
                    <Read
                      {...props}
                      amount={balance}
                      token=""
                      fixed={2}
                      decimals={decimals}
                    />
                  )}
                </>
              )}
            </WithFetching>
          }
        />
      </section>
    </article>
  )
}

export default AssetChain
