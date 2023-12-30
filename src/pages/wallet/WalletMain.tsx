import NetWorth from "./NetWorth"
import AssetList from "./AssetList"
import { useState } from "react"
import { Flex, PageTabs } from "@terra-money/station-ui"
import { useTranslation } from "react-i18next"
import ActivityList from "../activity/ActivityList"
import styles from "./WalletMain.module.scss"
import ExtensionFooter from "extension/components/ExtensionFooter"
import UpdateNotification from "extension/update/UpdateNotification"
//import useIbcTxs, { IbcTxState } from "txs/useIbcTxs"
import { useLocation } from "react-router-dom"

const WalletMain = () => {
  const { hash } = useLocation()
  const [tab, setTab] = useState(hash === "#1" ? 1 : 0)
  //const { ibcTxs, clearCompletedTxs } = useIbcTxs()
  const { t } = useTranslation()

  /*const successCount = ibcTxs.filter(
    ({ state }) => state === IbcTxState.SUCCESS
  ).length
  const pendingCount = ibcTxs.filter(
    ({ state }) =>
      state === IbcTxState.PENDING || state === IbcTxState.BROADCASTING
  ).length
  const failedCount = ibcTxs.filter(
    ({ state }) => state === IbcTxState.ERROR
  ).length*/

  return (
    <>
      <section className={styles.wallet__page}>
        <div className={styles.main__container}>
          <UpdateNotification />
          <NetWorth />
        </div>
        <div className={styles.tabs__container}>
          <PageTabs
            activeTab={tab}
            onClick={(i) => {
              // when user closes the Activity tab clear completed IBC txs
              if (tab === 1 && i !== tab) {
                //clearCompletedTxs()
              }
              setTab(i)
            }}
            tabs={[
              t("Assets"),
              <Flex gap={6}>
                {t("Activity")}
                {/*!!successCount && (
                  <Pill variant="success" text={`${successCount}`} />
                )}
                {!!pendingCount && (
                  <Pill variant="warning" text={`${pendingCount}`} />
                )}
                {!!failedCount && (
                  <Pill variant="danger" text={`${failedCount}`} />
                )*/}
              </Flex>,
            ]}
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
