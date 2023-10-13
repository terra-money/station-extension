import { Fragment } from "react"
import { useQueries, useInfiniteQuery } from "react-query"
import axios from "axios"
import { combineState, queryKey } from "data/query"
import { useNetwork } from "data/wallet"
import { Card, Col, Page } from "components/layout"
import { Empty } from "components/feedback"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { isTerraChain } from "utils/chain"
import { useState } from "react"
import { LoadingCircular } from "station-ui"
import ActivityItem from "./ActivityItem"
import styles from "./ActivityList.module.scss"
import { useActivity } from "data/queries/activity"

interface Props {
  chainID?: string
}

interface PaginationKeys {
  limit: string
  offset: string
  reverse: string
}

/**
 * Returns pagination keys for the given chain. Switched by cosmos_sdk
 * version in the future, isTerra for now.
 *
 * @param isTerra boolean based on chain-id.  True if Terra, false if not.
 */
function getPaginationKeys(isTerra: boolean): PaginationKeys {
  if (isTerra) {
    return {
      limit: "limit",
      offset: "page",
      reverse: "orderBy",
    }
  } else {
    return {
      limit: "pagination.limit",
      offset: "pagination.offset",
      reverse: "pagination.reverse",
    }
  }
}

const ActivityList = () => {
  const addresses = useInterchainAddresses()
  const { activitySorted: activity, state } = useActivity(addresses)

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
          activity.map((item) => <ActivityItem {...item} key={item.txhash} />)
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

export default ActivityList
