import { useInitialAccountInfo } from "data/queries/accountInfo"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { LoadingCircular, SectionHeader } from "station-ui"
import styles from "./ActivityList.module.scss"
import { Card, Page } from "components/layout"
import { Empty } from "components/feedback"
import ActivityItem from "./ActivityItem"
import moment from "moment"
import React, { useState } from "react"

const ActivityList = () => {
  const addresses = useInterchainAddresses()
  const { activitySorted: activity, state } = useInitialAccountInfo(addresses)

  const activityItemsPerPage = 20
  const [visibleActivity, setVisibleActivity] = useState(activityItemsPerPage)
  const moreToShow = activity.length > activityItemsPerPage
  const [hasMoreActivity, setHasMoreActivity] = useState(moreToShow)

  const handleClick = () => {
    setVisibleActivity((prevVisibleActivity) => {
      const updatedActivityLength = prevVisibleActivity + 20
      if (updatedActivityLength >= activity.length) {
        setHasMoreActivity(false)
      }
      return prevVisibleActivity + 20
    })
  }

  let priorDisplayDate = ""
  const visibleActivityItems = activity
    .slice(0, visibleActivity)
    .map((activityItem: AccountHistoryItem & { chain: string }) => {
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
    })

  const allActivityDisplayed = visibleActivityItems.length === activity.length
  const seeMoreButton = !allActivityDisplayed ? (
    <button onClick={handleClick} className={styles.seemore}>
      See more
    </button>
  ) : null

  const render = () => {
    if (addresses && !activity) return null

    return !activity?.length ? (
      <Card>
        <Empty />
      </Card>
    ) : (
      <div className={styles.activitylist}>
        {state.isLoading ? (
          <span className={styles.loadingtext}>
            Gathering activity across all chains...
          </span>
        ) : null}
        {visibleActivityItems}
        {hasMoreActivity ? (
          seeMoreButton
        ) : (
          <LoadingCircular size={36} thickness={2} />
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
