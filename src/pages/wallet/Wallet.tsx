import styles from "./Wallet.module.scss"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import NetWorth from "./NetWorth"
import AssetList from "./AssetList"
import { useState } from "react"
import createContext from "utils/createContext"
import AssetPage from "./AssetPage"
import ReceivePage from "./ReceivePage"
import AddressChain from "pages/wallet/AddressChain"
import SendPage from "./SendPage"
import { PageTabs } from "station-ui"
import { useTranslation } from "react-i18next"
import { Close } from "@mui/icons-material"
import { truncate } from "@terra-money/terra-utils"

enum Page {
  wallet = "wallet",
  coin = "coin",
  receive = "receive",
  send = "send",
  swap = "swap",
  address = "address",
}

type CommonRoute = {
  previous?: Route
  denom?: string
}
type WalletRoute = CommonRoute & {
  page: Page.wallet | Page.receive | Page.swap | Page.coin | Page.send
}
type AddressRoute = CommonRoute & { page: Page.address; address: string }
type Route = WalletRoute | AddressRoute

// Handle routing inside Wallet
const [useWalletRoute, WalletRouter] = createContext<{
  route: Route
  setRoute: (route: Route) => void
}>("useWalletRoute")

export { useWalletRoute, Page }

const Wallet = () => {
  const [route, setRoute] = useState<Route>({ page: Page.wallet })
  const [tab, setTab] = useState(0)
  const { t } = useTranslation()

  const Header = () => {
    if (route.page === Page.wallet) return null
    const renderTitle = () => {
      switch (route.page) {
        case Page.swap:
          return t("Swap")
        case Page.receive:
          return t("Receive")
        case Page.send:
          return t("Send")
        case Page.address:
          return truncate(route.address)
        default:
          return ""
      }
    }

    return (
      <div className={styles.header}>
        {route.previous && (
          <button
            className={styles.back}
            onClick={() => setRoute(route.previous as Route)}
          >
            <BackIcon data-testid="BackIcon" />
          </button>
        )}
        <h1>{renderTitle()}</h1>
        <button
          className={styles.close}
          onClick={() => setRoute({ page: Page.wallet })}
        >
          <Close data-testid="CloseIcon" />
        </button>
      </div>
    )
  }
  const renderPage = () => {
    switch (route.page) {
      case Page.coin:
        return <AssetPage />
      case Page.receive:
        return <ReceivePage />
      case Page.send:
        return <SendPage />
      case Page.swap:
        return <span>swap page</span>
      case Page.address:
        return <AddressChain address={route.address} />
      default:
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
    }
  }

  return (
    <div className={styles.wallet}>
      <WalletRouter value={{ route, setRoute }}>
        {
          <>
            <Header />
            {renderPage()}
          </>
        }
      </WalletRouter>
    </div>
  )
}

export default Wallet
