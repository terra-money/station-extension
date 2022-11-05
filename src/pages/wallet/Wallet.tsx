import styles from "./Wallet.module.scss"
import NetWorth from "./NetWorth"
import AssetList from "./AssetList"

const Wallet = () => {
  const isAnchorAvailable = useIsAnchorAvailable()

  return (
    <div className={styles.wallet}>
      <NetWorth />
      <AssetList />
    </div>
  )
}

export default Wallet
