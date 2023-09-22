import styles from "./Wallet.module.scss"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import NetWorth from "./NetWorth"
import AssetList from "./AssetList"
import { useState } from "react"
import createContext from "utils/createContext"
import AssetPage from "./AssetPage"
import ReceivePage from "./ReceivePage"
import SendPage from "./SendPage"
import { Tabs } from "station-ui"
import { useTranslation } from "react-i18next"

enum Path {
  wallet = "wallet",
  coin = "coin",
  receive = "receive",
  send = "send",
}

type Route =
  | {
      path: Path.wallet
      denom?: string
    }
  | {
      path: Path.coin | Path.receive | Path.send
      denom?: string
      previousPage: Route
    }

// Handle routing inside Wallet
const [useWalletRoute, WalletRouter] = createContext<{
  route: Route
  setRoute: (route: Route) => void
}>("useWalletRoute")

export { useWalletRoute, Path }

const Wallet = () => {
  const [route, setRoute] = useState<Route>({ path: Path.wallet })
  const [tabKey, setTabKey] = useState("assets")
  const { t } = useTranslation()

  const BackButton = () => {
    if (route.path === Path.wallet) return null

    return (
      <button
        className={styles.back}
        onClick={() => setRoute(route.previousPage)}
      >
        <BackIcon width={18} height={18} data-testid="BackIcon" />
      </button>
    )
  }
  const tabs = [
    {
      key: "assets",
      label: t("Assets"),
      onClick: () => setTabKey("assets"),
    },
    {
      key: "activity",
      label: t("Activity"),
      onClick: () => setTabKey("activity"),
    },
  ]

  const render = () => {
    switch (route.path) {
      case Path.wallet:
        return (
          <>
            <NetWorth />
            <Tabs activeTabKey={tabKey} tabs={tabs} />
            {tabKey === "assets" ? <AssetList /> : <p> Activty component</p>}
          </>
        )
      case Path.coin:
        return (
          <>
            <BackButton />
            <AssetPage />
          </>
        )
      case Path.receive:
        return (
          <>
            <BackButton />
            <ReceivePage />
          </>
        )
      case Path.send:
        return (
          <>
            <BackButton />
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
