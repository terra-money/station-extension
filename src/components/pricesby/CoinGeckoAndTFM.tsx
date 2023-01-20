import { ExternalLink } from "components/general"
import styles from "./CoinGeckoAndTFM.module.scss"
import { ReactComponent as CoinGecko } from "../coingecko/CoinGecko.svg"

const CoinGeckoAndTFM = () => {
  return (
    <span className={styles.container}>
      <div className={styles.top}>
        <span>Prices by </span>
        <ExternalLink href="https://www.coingecko.com/" className={styles.link}>
          <CoinGecko width={18} /> Coingecko
        </ExternalLink>
      </div>
      <div className={styles.bottom}>
        <span>and </span>
        <ExternalLink href="https://tfm.com" className={styles.link}>
          TFM
        </ExternalLink>
      </div>
    </span>
  )
}

export default CoinGeckoAndTFM
