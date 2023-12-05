import { Read } from "components/token"
import { useNetwork, useNetworkName } from "data/wallet"
import styles from "./AssetChain.module.scss"
import { useNetworks } from "app/InitNetworks"
import { TokenSingleChainListItem } from "@terra-money/station-ui"
import { useNativeDenoms } from "data/token"

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
}

const AssetChain = (props: Props) => {
  const { chain, symbol, balance, decimals, path, denom, sendBack, price } =
    props
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
            <Read
              {...props}
              amount={balance}
              token=""
              fixed={2}
              decimals={decimals}
            />
          }
        />
      </section>
    </article>
  )
}

export default AssetChain
