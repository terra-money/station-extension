import NetWorth from "./NetWorth"
import AssetList from "./AssetList"
import { useState } from "react"
import { PageTabs } from "@terra-money/station-ui"
import { useTranslation } from "react-i18next"
import ActivityList from "../activity/ActivityList"
import styles from "./WalletMain.module.scss"
import ExtensionFooter from "extension/components/ExtensionFooter"
import UpdateNotification from "extension/update/UpdateNotification"

const WalletMain = () => {
  const [tab, setTab] = useState(0)
  const { t } = useTranslation()
  return (
    <>
      <section className={styles.wallet__page}>
        <UpdateNotification />
        <NetWorth />
        <div className={styles.tabs__container}>
          <PageTabs
            activeTab={tab}
            onClick={setTab}
            tabs={[t("Assets"), t("Activity")]}
          />
        </div>
        <div className={styles.list__container}>
          {tab === 0 ? <AssetList /> : <ActivityList />}
        </div>
      </section>
      <ExtensionFooter />
    </>
  )
}

export default WalletMain
