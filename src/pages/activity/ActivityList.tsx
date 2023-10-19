import { Card, Page } from "components/layout"
import { Empty } from "components/feedback"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { LoadingCircular } from "station-ui"
import ActivityItem from "./ActivityItem"
import styles from "./ActivityList.module.scss"
import { useInitialAccountInfo } from "data/queries/accountInfo"

const ActivityList = () => {
  const addresses = useInterchainAddresses()
  const { activitySorted: activity, state } = useInitialAccountInfo(addresses)

  const render = () => {
    if (addresses && !activity) return null

    return !activity?.length ? (
      <Card>
        <Empty />
      </Card>
    ) : (
      <div className={styles.activitylist}>
        {state.isLoading ? <LoadingCircular size={36} thickness={2} /> : null}
        {activity.map((activityItem) => (
          <ActivityItem {...activityItem} key={activityItem.txhash} />
        ))}
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
