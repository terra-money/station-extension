import styles from "./Wallet.module.scss"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import NetWorth from "./NetWorth"
import AssetList from "./AssetList"
import React, { useState } from "react"
import createContext from "utils/createContext"
import AssetPage from "./AssetPage"
import ReceivePage from "./ReceivePage"
import SendPage from "./SendPage"
import VestingDetailsPage from "./VestingDetailsPage"
import { PageTabs, Modal } from "station-ui"
import { useTranslation } from "react-i18next"
import ActivityList from "pages/activity/ActivityList"
import ActivityDetailsPage from "pages/activity/ActivityDetailsPage"
import { InterchainNetwork } from "types/network"
import { ReactElement } from "react"
import ExtensionPage from "extension/components/ExtensionPage"

enum Path {
  wallet = "wallet",
  coin = "coin",
  receive = "receive",
  send = "send",
  vesting = "vesting",
  activity = "activity",
}

type Route =
  | {
      path: Path.wallet
      denom?: string
    }
  | {
      path: Path.coin | Path.receive | Path.send | Path.vesting | Path.activity
      denom?: string
      variant?: string
      chain?: InterchainNetwork
      msg?: ReactElement<any, any>
      type?: string
      time?: Date
      timelineMessages?: (ReactElement<any, any> | undefined)[]
      txHash?: string
      fee?: CoinData[]
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
  const [tab, setTab] = useState(0)
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
            {tab === 0 ? <AssetList /> : <ActivityList />}
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
      case Path.vesting:
        return (
          <>
            <BackButton />
            <VestingDetailsPage token={route.denom} />
          </>
        )
      case Path.activity:
        return (
          <ExtensionPage title={t("Transaction")} fullHeight modal>
            <ActivityDetailsPage
              variant={route.variant}
              chain={route.chain}
              msg={route.msg}
              type={route.type}
              time={route.time}
              timelineMessages={route.timelineMessages}
              txHash={route.txHash}
              fee={route.fee}
            />
          </ExtensionPage>
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
