import {
  ActivityListItem,
  SectionHeader,
  SummaryColumn,
  SummaryTable,
  Timeline,
  ExternalLinkIcon,
} from "@terra-money/station-ui"
import styles from "./ActivityDetailsPage.module.scss"
import { ExternalLink } from "components/general"
import { ReadMultiple } from "components/token"
import { useTranslation } from "react-i18next"
import { useNetwork } from "data/wallet"
import { toNow } from "utils/date"
import moment from "moment"
import { ReactElement } from "react"

interface Props {
  variant: "success" | "failed" | "loading"
  chain: string
  msg: ReactElement
  type: string
  time: any
  timelineMessages: ReactElement[]
  txHash: string
  fee: CoinData[]
  relatedTxs: ReactElement[]
}

const ActivityDetailsPage = ({
  variant,
  chain,
  msg,
  type,
  time,
  timelineMessages,
  txHash,
  fee,
  relatedTxs,
}: Props) => {
  const { t } = useTranslation()

  const networks = useNetwork()
  const explorer = networks[chain ?? ""]?.explorer
  const externalLink = explorer?.tx?.replace("{}", txHash)

  const timelineDisplayMessages = timelineMessages.map(
    (message: ReactElement) => {
      return {
        variant: (variant === "success" ? "success" : "warning") as
          | "success"
          | "warning",
        msg: message,
      }
    }
  )

  const detailRows = [
    {
      label: "Timestamp (UTC)",
      value: moment(time).utc().format("DD/MM/YY, H:mm:ss"),
    },
    { label: "Chain", value: `${networks[chain]?.name} (${chain})` },
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
                icon: networks[chain]?.icon,
                label: networks[chain]?.name,
              }}
              msg={msg}
              type={type}
              time={toNow(new Date(time))}
              msgCount={timelineDisplayMessages.length}
              hasTimeline={
                !!timelineDisplayMessages.length || !!relatedTxs.length
              }
            />
          }
          middleItems={timelineDisplayMessages}
        />
        {relatedTxs}
      </div>

      <SectionHeader title={t("Details")} withLine />
      <SummaryColumn
        title={t("Transaction Hash")}
        description={txHash.toLowerCase()}
        extra={
          <ExternalLink href={externalLink}>
            <ExternalLinkIcon fill="#686b77" />
          </ExternalLink>
        }
      />
      <SummaryTable rows={detailRows} />
    </div>
  )
}

export default ActivityDetailsPage
