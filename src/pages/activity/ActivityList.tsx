import {
  Banner,
  LoadingCircular,
  SectionHeader,
  SubmitButton,
} from "@terra-money/station-ui"
import { PaginationItem, useTxActivity } from "data/queries/activityAPI"
import { getWallet } from "auth/scripts/keystore"
import styles from "./ActivityList.module.scss"
import { useEffect, useState } from "react"
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

  const wallet = getWallet()
  const addresses: string[] = Object.values(wallet.words)

  const [pagination, setPagination] = useState<PaginationItem[] | undefined>(
    undefined
  )
  const { data, isLoading, isError } = useTxActivity({
    addresses: addresses,
    pagination: pagination,
  })

  const [visibleActivity, setVisibleActivity] = useState(data?.response)

  useEffect(() => {
    setVisibleActivity((prevVisibleActivity) => [
      ...(prevVisibleActivity || []),
      ...(data?.response || []),
    ])
  }, [data])

  const handleLoadMore = () => {
    if (data?.pagination) {
      setPagination(data.pagination)
    }
  }

  let priorDisplayDate = ""
  const visibleActivityItems =
    // do not show pending txs in the main activity page
    /*.filter(
      ({ txhash }) =>
        !ibcTxs.find(({ txhash: ibcTxhash }) => ibcTxhash === txhash)
    )*/
    visibleActivity?.map((activityItem: ActivityItem) => {
      const activityItemDate = new Date(activityItem.timestamp)
      const displayDate = getDisplayDate(activityItemDate)
      let header = null
      if (!priorDisplayDate || displayDate !== priorDisplayDate) {
        priorDisplayDate = displayDate
        header = <SectionHeader title={displayDate} />
      }
      return (
        <ActivityItem
          key={`${activityItem.tx_hash}-${activityItem.code}`}
          {...activityItem}
          dateHeader={header}
        />
      )
    })

  let loader: JSX.Element | null
  if (!visibleActivity?.length && isLoading) {
    loader = (
      <div className={styles.loader}>
        <LoadingCircular size={40} />
      </div>
    )
  } else if (!visibleActivity?.length && !isLoading && !isError) {
    loader = (
      <span className={styles.empty}>
        This wallet has no activity to display
      </span>
    )
  } else {
    loader = null
  }

  const loadMoreButton = visibleActivity?.length ? (
    <SubmitButton
      onClick={handleLoadMore}
      variant={"secondary"}
      loading={isLoading}
      label={"Load More"}
    />
  ) : null

  const errorBanner = isError ? (
    <Banner
      variant="warning"
      title={
        "There seems to be a problem with our servers. Please try again later."
      }
    />
  ) : null

  const footer = (
    <div className={styles.footer}>
      {errorBanner}
      {loadMoreButton}
    </div>
  )

  const render = () => {
    if (!visibleActivity) return null

    return (
      <div className={styles.activitylist}>
        {loader}
        {visibleActivityItems}
        {footer}
      </div>
    )
  }

  return (
    <Page {...[isLoading, isError]} invisible>
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
