import NetWorth from "./NetWorth"
import AssetList from "./AssetList"
import { useState } from "react"
import { PageTabs } from "station-ui"
import { useTranslation } from "react-i18next"
import styles from "./WalletMain.module.scss"
import ExtensionFooter from "extension/components/ExtensionFooter"

const WalletMain = () => {
  const [tab, setTab] = useState(0)
  const { t } = useTranslation()
  return (
    <>
      <section className={styles.wallet__page}>
        <NetWorth />
        <div className={styles.tabs__container}>
          <PageTabs
            activeTab={tab}
            onClick={setTab}
            tabs={[t("Assets"), t("Activity")]}
          />
        </div>
        <div className={styles.list__container}>
          {tab === 0 ? <AssetList /> : <p>Activty component</p>}
        </div>
      </section>
      <ExtensionFooter />
    </>
  )
}

export default WalletMain
