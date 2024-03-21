import { TokenSingleChainListItem } from "@terra-money/station-ui"
import { useNetwork, useNetworkName } from "data/wallet"
import { useNetworks } from "app/InitNetworks"
import styles from "./AssetChain.module.scss"
import { useNativeDenoms } from "data/token"
import { Read } from "components/token"

export interface Props {
  chain: string
  balance: string
  symbol: string
  decimals: number
  denom: string
  path?: string[]
  ibcDenom?: string
  sendBack?: boolean
  price?: number
  sign?: string
}

const AssetChain = (props: Props) => {
  const {
    chain,
    symbol,
    balance,
    decimals,
    path,
    denom,
    sendBack,
    price,
    sign,
  } = props
  const networkName = useNetworkName()
  const allNetworks = useNetworks().networks[networkName]
  const networks = useNetwork()
  const readNativeDenom = useNativeDenoms()

  const { icon, name } = allNetworks[chain] ?? { name: chain }
  const asset = readNativeDenom(denom, chain)

  // send back is not available if one of the chains the asset went through is not supprted by Station
  const isSendBackDisabled =
    !!path?.find((chain) => !networks[chain]) ||
    (symbol === "LUNC" && networkName !== "classic")

  const signStyle =
    sign === "-"
      ? { color: "var(--token-error-500)" }
      : { color: "var(--token-success-500)" }
  const amount = (
    <Read {...props} amount={balance} token="" fixed={2} decimals={decimals} />
  )

  return (
    <article className={styles.chain}>
      <section className={styles.details}>
        <TokenSingleChainListItem
          isSendBack={sendBack && !isSendBackDisabled}
          tokenImg={asset.icon ?? ""}
          symbol={symbol}
          chain={{ icon, label: name }}
          priceNode={
            <>
              {sign && price ? sign : null}
              {price ? (
                <Read
                  {...props}
                  currency
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
            sign ? (
              <span style={signStyle}>
                {sign}
                {amount}
              </span>
            ) : (
              amount
            )
          }
        />
      </section>
    </article>
  )
}

export default AssetChain
