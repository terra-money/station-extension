import { useState } from "react"
import {
  LoadingCircular,
  SectionHeader,
  SubmitButton,
} from "@terra-money/station-ui"
import { useTxActivity } from "data/queries/activity"
import styles from "./ActivityList.module.scss"
import ActivityItem from "./ActivityItem"
import { Page } from "components/layout"
import moment from "moment"
//import useIbcTxs, { IbcTxState } from "txs/useIbcTxs"
//import { useTranslation } from "react-i18next"
/*
interface IbcActivityItemProps {
  chainID: string
  txhash: string
  state: IbcTxState
  index: number
  timestamp: any
  msgs: Object[]
}

const IbcActivityItem = ({
  txhash,
  chainID,
  state,
  index,
  timestamp,
  msgs,
}: IbcActivityItemProps) => {
  const data = { tx: { body: { messages: msgs } }, txhash, code: 0 }
  const { t } = useTranslation()
  return (
    <ActivityItem
      {...data}
      timestamp={timestamp}
      chain={chainID}
      dateHeader={index === 0 ? <SectionHeader title={t("Pending")} /> : null}
      variant={state}
      showProgress
    />
  )
}
*/
const ActivityList = () => {
  //const { ibcTxs } = useIbcTxs()
  const { activitySorted: activity, state } = useTxActivity()

  const activityItemsPerPage = 20
  const [visibleActivity, setVisibleActivity] = useState(activityItemsPerPage)

  const handleClick = async () => {
    await setVisibleActivity((prevVisibleActivity) => prevVisibleActivity + 20)
  }

  let priorDisplayDate = ""
  const visibleActivityItems = activity
    // do not show pending txs in the main activity page
    /*.filter(
      ({ txhash }) =>
        !ibcTxs.find(({ txhash: ibcTxhash }) => ibcTxhash === txhash)
    )*/
    .slice(0, visibleActivity)
    .map((activityItem: AccountHistoryItem & { chain: string }) => {
      const activityItemDate = new Date(activityItem.timestamp)
      const displayDate = getDisplayDate(activityItemDate)
      let header = null
      if (!priorDisplayDate || displayDate !== priorDisplayDate) {
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

  let loader: JSX.Element | null
  if (!activity?.length && state.isLoading) {
    loader = (
      <div className={styles.loader}>
        <LoadingCircular size={40} />
      </div>
    )
  } else if (activity?.length && state.isLoading) {
    loader = (
      <span className={styles.loadingtext}>
        Gathering activity across all chains...
      </span>
    )
  } else if (!activity?.length && !state.isLoading) {
    loader = (
      <span className={styles.loadingtext}>This wallet has no activity</span>
    )
  } else {
    loader = null
  }

  const render = () => {
    if (!activity) return null

    return (
      <div className={styles.activitylist}>
        {loader}
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
