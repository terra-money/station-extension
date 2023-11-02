import { useInitialAccountInfo } from "data/queries/accountInfo"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { LoadingCircular, SectionHeader } from "station-ui"
import { Card, Page } from "components/layout"
import { Empty } from "components/feedback"
import ActivityItem from "./ActivityItem"
import moment from "moment"
import React from "react"

const ActivityList = () => {
  const addresses = useInterchainAddresses()
  const { activitySorted: activity, state } = useInitialAccountInfo(addresses)

  const render = () => {
    if (addresses && !activity) return null
    let priorDisplayDate = ""

    return !activity?.length ? (
      <Card>
        <Empty />
      </Card>
    ) : (
      <div>
        {state.isLoading ? <LoadingCircular size={36} thickness={2} /> : null}
        {activity.map(
          (activityItem: AccountHistoryItem & { chain: string }) => {
            const activityItemDate = new Date(activityItem.timestamp)
            const displayDate = getDisplayDate(activityItemDate)
            let header = null
            if (displayDate !== priorDisplayDate) {
              priorDisplayDate = displayDate
              header = <SectionHeader title={displayDate} />
            }
            return (
              <ActivityItem
                key={activityItem.txhash}
                {...activityItem}
                dateHeader={header}
              />
            )
          }
        )}
      </div>
    )
  }

  return (
    <Page {...state} invisible>
      {render()}
    </Page>
  )
}

const getDisplayDate = (activityItemDate: Date) => {
  if (moment(activityItemDate).isSame(moment(), "day")) {
    return "Today"
  } else if (
    moment(activityItemDate).isSame(moment().subtract(1, "days"), "day")
  ) {
    return "Yesterday"
  } else {
    return moment(activityItemDate).format("D MMM YYYY")
  }
}

export default ActivityList
