import { useTranslation } from "react-i18next"
import ActivityList from "./ActivityList"
import { /*ChainFilter,*/ Page } from "components/layout"

const Activity = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("Activity")}>
      <ActivityList />
      {/* <ChainFilter outside all>
        {(chain) => <HistoryList chainID={chain} />}
      </ChainFilter> */}
    </Page>
  )
}

export default Activity
