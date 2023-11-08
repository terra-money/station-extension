import {
  ActivityListItem,
  SectionHeader,
  SummaryColumn,
  SummaryTable,
  Timeline,
} from "station-ui"
import styles from "./ActivityDetailsPage.module.scss"
import { ReadMultiple } from "components/token"
import { useTranslation } from "react-i18next"
import { toNow } from "utils/date"
import moment from "moment"
import React from "react"

const ActivityDetailsPage = ({ ...props }) => {
  const { t } = useTranslation()
  const { variant, chain, msg, type, time, timelineMessages, txHash, fee } =
    props

  const timelineDisplayMessages = timelineMessages.map((message: string[]) => {
    return { variant: variant, msg: message }
  })

  const detailRows = [
    {
      label: "Timestamp (UTC)",
      value: moment(time).utc().format("DD/MM/YY, H:mm:ss"),
    },
    { label: "Chain", value: `${chain.name} (${chain.chainID})` },
    { label: "Fee", value: <ReadMultiple list={fee} /> },
  ]

  return (
    <div className={styles.txcontainer}>
      <div className={styles.activityitem}>
        <Timeline
          startOverride={
            <ActivityListItem
              variant={variant}
              chain={{
                icon: chain.icon,
                label: chain.name,
              }}
              msg={msg}
              type={type}
              time={toNow(new Date(time))}
              msgCount={timelineDisplayMessages.length}
              hasTimeline={timelineDisplayMessages.length ? true : false}
            />
          }
          middleItems={timelineDisplayMessages}
        />
      </div>

      <SectionHeader title={t("Details")} withLine />
      <SummaryColumn
        title={t("Transaction Hash")}
        description={txHash.toLowerCase()}
        extra="X"
      />
      <SummaryTable rows={detailRows} />
    </div>
  )
}

export default ActivityDetailsPage
