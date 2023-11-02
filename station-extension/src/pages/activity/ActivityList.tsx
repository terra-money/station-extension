import { useInitialAccountInfo } from "data/queries/accountInfo"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { LoadingCircular, SectionHeader } from "station-ui"
import styles from "./ActivityList.module.scss"
import { Card, Page } from "components/layout"
import { Empty } from "components/feedback"
import ActivityItem from "./ActivityItem"
import moment from "moment"
import React from "react"

const ActivityList = () => {
  const addresses = useInterchainAddresses()
  const { activitySorted: oldactivity, state } =
    useInitialAccountInfo(addresses)
  const activity = oldactivity.filter((obj) => {
    const msgs = obj.tx.body.messages.map((x: any) => x["@type"])
    return (
      msgs.includes("/ibc.core.client.v1.MsgUpdateClien") ||
      obj.txhash ===
        "29301F429C2F000BAB35E8959F69AF3E7539D0D2019A7B6C01C0112A2588802D"
    )
  })

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
              <div key={activityItem.txhash} className={styles.activitylist}>
                {header}
                <ActivityItem {...activityItem} />
              </div>
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
