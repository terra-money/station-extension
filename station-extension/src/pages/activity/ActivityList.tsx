import {
  LoadingCircular,
  SectionHeader,
  SubmitButton,
} from "@terra-money/station-ui"
import { useInitialAccountInfo } from "data/queries/accountInfo"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import styles from "./ActivityList.module.scss"
import ActivityItem from "./ActivityItem"
import { Page } from "components/layout"
import React, { useState } from "react"
import moment from "moment"

const ActivityList = () => {
  const addresses = useInterchainAddresses()
  const { activitySorted: activity, state } = useInitialAccountInfo(addresses)

  const activityItemsPerPage = 20
  const [visibleActivity, setVisibleActivity] = useState(activityItemsPerPage)

  const handleClick = async () => {
    await setVisibleActivity((prevVisibleActivity) => prevVisibleActivity + 20)
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
  const loadMoreButton = !allActivityDisplayed ? (
    <SubmitButton
      onClick={handleClick}
      variant={"secondary"}
      label={"Load More"}
    />
  ) : null

  const render = () => {
    if (addresses && !activity) return null

    return !activity?.length ? (
      <div className={styles.loader}>
        <LoadingCircular size={40} />
      </div>
    ) : (
      <div className={styles.activitylist}>
        {state.isLoading ? (
          <span className={styles.loadingtext}>
            Gathering activity across all chains...
          </span>
        ) : null}
        {visibleActivityItems}
        {loadMoreButton}
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
