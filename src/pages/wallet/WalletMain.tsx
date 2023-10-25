import NetWorth from "./NetWorth"
import AssetList from "./AssetList"
import { useState } from "react"
import { PageTabs } from "station-ui"
import { useTranslation } from "react-i18next"

const WalletMain = () => {
  const [tab, setTab] = useState(0)
  const { t } = useTranslation()
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

export default WalletMain
