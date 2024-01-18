import { useTranslation } from "react-i18next"
import ActivityList from "../activity/ActivityList"
import { /*ChainFilter,*/ Page } from "components/layout"

const History = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("History")}>
      <ActivityList />
      {/* <ChainFilter outside all>
        {(chain) => <HistoryList chainID={chain} />}
      </ChainFilter> */}
    </Page>
  )
}

export default History
