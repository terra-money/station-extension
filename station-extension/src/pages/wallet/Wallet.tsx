import styles from "./Wallet.module.scss"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import NetWorth from "./NetWorth"
import AssetList from "./AssetList"
import { useState, useCallback } from "react"
import createContext from "utils/createContext"
import AssetPage from "./AssetPage"
import ReceivePage from "./ReceivePage"
import AddressChain from "pages/wallet/AddressChain"
import SendPage from "./SendPage/SendPage"
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
  sendChain = "sendChain",
  sendSubmit = "sendSubmit",
  sendToken = "sendToken",
  sendConfirm = "sendConfirm",
}

const pageOrder = {
  [Page.wallet]: null, // null means no back button
  [Page.receive]: null,
  [Page.send]: null,
  [Page.coin]: null,
  [Page.swap]: null,
  [Page.address]: Page.receive,
  [Page.sendChain]: Page.send,
  [Page.sendToken]: Page.send,
  [Page.sendSubmit]: Page.sendToken,
  [Page.sendConfirm]: Page.sendSubmit,
}

type Route = {
  denom?: string
  address?: string
  page: Page
}

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

    const pageTitle = {
      [Page.wallet]: "Wallet",
      [Page.coin]: "Asset",
      [Page.receive]: "Receive",
      [Page.send]: "Send",
      [Page.swap]: "Swap",
      [Page.sendChain]: "Select Chain",
      [Page.sendToken]: "Send",
      [Page.sendSubmit]: "Submit",
      [Page.sendConfirm]: "Confirm Send",
      [Page.address]: truncate(route.address),
    }

    const prevPage = pageOrder[route.page]

    return (
      <div className={styles.header}>
        {prevPage && (
          <button
            className={styles.back}
            onClick={() => setRoute({ page: prevPage })}
          >
            <BackIcon data-testid="BackIcon" />
          </button>
        )}
        <h1>{pageTitle[route.page]}</h1>
        <button
          className={styles.close}
          onClick={() => setRoute({ page: Page.wallet })}
        >
          <Close data-testid="CloseIcon" />
        </button>
      </div>
    )
  }
  const renderPage = useCallback(() => {
    console.log("wallet renderPage")
    switch (route.page) {
      case Page.wallet:
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
      case Page.coin:
        return <AssetPage />
      case Page.receive:
        return <ReceivePage />
      case Page.swap:
        return <span>swap page</span>
      case Page.address:
        return <AddressChain address={route.address ?? ""} />
      default:
        return <SendPage /> // default because of send page internal routing
    }
  }, [route, tab, t])

  return (
    <div className={styles.wallet}>
      <WalletRouter value={{ route, setRoute }}>
        <>
          <Header />
          {renderPage()}
        </>
      </WalletRouter>
    </div>
  )
}

export default Wallet
