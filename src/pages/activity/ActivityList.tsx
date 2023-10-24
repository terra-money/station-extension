import { Card, Page } from "components/layout"
import { Empty } from "components/feedback"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { LoadingCircular, SectionHeader } from "station-ui"
import ActivityItem from "./ActivityItem"
import styles from "./ActivityList.module.scss"
import { useInitialAccountInfo } from "data/queries/accountInfo"
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
      <div className={styles.activitylist}>
        {state.isLoading ? <LoadingCircular size={36} thickness={2} /> : null}
        {activity.map((activityItem) => {
          const activityItemDate = new Date(activityItem.timestamp)
          const displayDate = getDisplayDate(activityItemDate)
          let header = null
          if (displayDate !== priorDisplayDate) {
            priorDisplayDate = displayDate
            header = <SectionHeader title={displayDate} />
          }
          return (
            <div className={styles.activitylist}>
              {header}
              <ActivityItem {...activityItem} key={activityItem.txhash} />
            </div>
          )
        })}
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
