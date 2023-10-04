import styles from "./Wallet.module.scss"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import NetWorth from "./NetWorth"
import AssetList from "./AssetList"
import { useState } from "react"
import createContext from "utils/createContext"
import AssetPage from "./AssetPage"
import ReceivePage from "./ReceivePage"
import SendPage from "./SendPage"
import { PageTabs } from "station-ui"
import { useTranslation } from "react-i18next"
import { capitalize } from "@mui/material"

enum Path {
  wallet = "wallet",
  coin = "coin",
  receive = "receive",
  send = "send",
}

type Route = {
  path: Path.coin | Path.receive | Path.send | Path.wallet
  denom?: string
  previousPage?: Route
}

// Handle routing inside Wallet
const [useWalletRoute, WalletRouter] = createContext<{
  route: Route
  setRoute: (route: Route) => void
}>("useWalletRoute")

export { useWalletRoute, Path }

const Wallet = () => {
  const [route, setRoute] = useState<Route>({ path: Path.wallet })
  const [tab, setTab] = useState(0)
  const { t } = useTranslation()

  const Header = () => {
    if (route.path === Path.wallet) return null
    const title =
      route.path === Path.receive || route.path === Path.send ? route.path : ""

    return (
      <div className={styles.header}>
        <button
          className={styles.back}
          onClick={() => setRoute(route.previousPage ?? { path: Path.wallet })}
        >
          <BackIcon data-testid="BackIcon" />
        </button>
        {title && <h1>{capitalize(title)}</h1>}
      </div>
    )
  }
  const render = () => {
    switch (route.path) {
      case Path.wallet:
        return (
          <>
            <NetWorth />
            <PageTabs
              activeTab={tab}
              onClick={setTab}
              tabs={[t("Assets"), t("Activity")]}
            />
            {tab === 0 ? <AssetList /> : <p>Activty component</p>}
          </>
        )
      case Path.coin:
        return (
          <>
            <Header />
            <AssetPage />
          </>
        )
      case Path.receive:
        return (
          <>
            <Header />
            <ReceivePage />
          </>
        )
      case Path.send:
        return (
          <>
            <Header />
            <SendPage />
          </>
        )
    }
  }

  return (
    <div className={styles.wallet}>
      <WalletRouter value={{ route, setRoute }}>{render()}</WalletRouter>
    </div>
  )
}

export default Wallet
