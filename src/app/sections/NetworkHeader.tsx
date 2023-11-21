import { useNetworkName } from "data/wallet"
import styles from "./NetworkHeader.module.scss"
import { capitalize } from "@mui/material"

const NetworkHeader = () => {
  const network = useNetworkName()

  if (network === "mainnet") return null

  return <div className={styles.component}>{capitalize(network)}</div>
}

export default NetworkHeader
