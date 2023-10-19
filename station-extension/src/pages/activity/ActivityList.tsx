import { Card, Page } from "components/layout"
import { Empty } from "components/feedback"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { LoadingCircular } from "station-ui"
import ActivityItem from "./ActivityItem"
import styles from "./ActivityList.module.scss"
import { useInitialAccountInfo } from "data/queries/accountInfo"
import { useInfiniteQuery } from "react-query"
import { useRef, useEffect } from "react"

const ActivityList = () => {
  const addresses = useInterchainAddresses()
  const { activitySorted: activity, state } = useInitialAccountInfo(addresses)

  const fetchActivity = async ({ pageParam = 0 }) => {
    return activity.slice(pageParam, pageParam + 30)
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["activity"],
    queryFn: fetchActivity,
    getNextPageParam: (pageParam) => pageParam,
  })

  const scrollingContainerRef = useRef<HTMLDivElement | null>(null)

  const handleScroll = () => {
    const container = scrollingContainerRef.current
    if (container) {
      const isAtBottom =
        container.getBoundingClientRect().bottom <= window.innerHeight
      console.log("hi", isAtBottom)
      if (isAtBottom) {
        console.log("bottom")
        fetchNextPage()
      }
    }
  }

  const render = () => {
    if (addresses && !activity) return null

    return !activity?.length ? (
      <Card>
        <Empty />
      </Card>
    ) : (
      <div className={styles.activitylist}>
        {state.isLoading ? (
          <LoadingCircular size={36} thickness={2} />
        ) : (
          data?.pages.map((group, i) => (
            <div key={i} onScroll={handleScroll} ref={scrollingContainerRef}>
              {group.map((activityItem) => (
                <ActivityItem {...activityItem} key={activityItem.txhash} />
              ))}
            </div>
          ))
        )}
        {/* {state.isLoading ? (
          <LoadingCircular size={36} thickness={2} />
        ) : (
          activity.map((item) => <ActivityItem {...item} key={item.txhash} />)
        )} */}
      </div>
    )
  }

  return (
    <Page {...state} invisible>
      {render()}
    </Page>
  )
}

export default ActivityList
