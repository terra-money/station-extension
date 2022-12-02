import { PropsWithChildren } from "react"
import { useTranslation } from "react-i18next"
import createContext from "utils/createContext"
import { Card } from "components/layout"
import { ErrorBoundary, Wrong } from "components/feedback"
import { useTxKey } from "./Tx"
import { useNetwork } from "data/wallet"

export const [useTx, TxProvider] = createContext<{
  gasPrices: Record<string, number>
}>("useTx")

const TxContext = ({ children }: PropsWithChildren<{}>) => {
  const { t } = useTranslation()
  const txKey = useTxKey()
  const networks = useNetwork()
  // sum gas prices from each network
  const gasPrices = Object.values(networks).reduce((acc, network) => {
    acc = { ...acc, ...network.gasPrices }
    return acc
  }, {} as Record<string, number>)

  /* on error */
  const fallback = () => (
    <Card>
      <Wrong>{t("Transaction is not available at the moment")}</Wrong>
    </Card>
  )

  return (
    <TxProvider value={{ gasPrices }} key={txKey}>
      <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
    </TxProvider>
  )
}

export default TxContext
