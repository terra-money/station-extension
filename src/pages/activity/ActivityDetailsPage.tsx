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
import { useAllInterchainAddresses } from "auth/hooks/useAddress"
import { getCanonicalMsg } from "@terra-money/terra-utils"
import { last } from "ramda"
import ActivityMessage from "./ActivityMessage"
import {
  IbcTxDetails,
  getIbcTxDetails,
  getRecvIbcTxDetails,
  useIbcNextHop,
  useIbcPrevHop,
} from "txs/useIbcTxs"

interface Props {
  variant: "success" | "failed" | "loading"
  chain: string
  msg: ReactElement
  type: string
  time: any
  timelineMessages: ReactElement[]
  txHash: string
  fee: CoinData[]
  logs: TxLog[]
}

export const useParseMessages = () => {
  const addresses = useAllInterchainAddresses() ?? {}

  return (tx: ActivityItem) => {
    const canonicalMessages = getCanonicalMsg(tx as any, addresses)

    let msgType = ""

    const activityMessages = canonicalMessages?.map((msg, index) => {
      if (index === 0 && msg?.msgType) {
        msgType = last(msg?.msgType.split("/")) ?? ""
      }
      return msg && <ActivityMessage chainID={tx.chain} msg={msg} key={index} />
    })

    const activityType = msgType.charAt(0).toUpperCase() + msgType.substring(1)

    return { activityMessages, activityType }
  }
}

const PrevHopActivity = (ibcDetails: IbcTxDetails) => {
  const { data: tx } = useIbcPrevHop(ibcDetails)
  const network = useNetwork()
  const { t } = useTranslation()
  const parseMsgs = useParseMessages()

  // create a loader
  if (!tx)
    return (
      <ActivityListItem
        variant={"loading"}
        // @ts-expect-error
        chain={{}}
        msg={t("Loading IBC activity...")}
        type={t("Loading")}
        //time={t(toNow(new Date(tx.timestamp)))}
        hasTimeline
      />
    )

  const explorer = network[tx.chain]?.explorer
  const externalLink = explorer?.tx?.replace("{}", tx.txhash)

  const { activityMessages, activityType } = parseMsgs(tx)

  const timelineDisplayMessages = activityMessages.map(
    (message: ReactElement) => {
      return {
        variant: (tx.code === 0 ? "success" : "warning") as
          | "success"
          | "warning",
        msg: message,
      }
    }
  )

  const prevIbcDetails = getRecvIbcTxDetails(tx)

  return (
    <>
      {!!prevIbcDetails && <PrevHopActivity {...prevIbcDetails} />}

      <Timeline
        startOverride={
          <ActivityListItem
            variant={tx.code === 0 ? "success" : "failed"}
            chain={{
              icon: network[tx.chain].icon,
              label: network[tx.chain].name,
            }}
            msg={activityMessages[0]}
            type={t(activityType)}
            time={t(toNow(new Date(tx.timestamp)))}
            hasTimeline
            extra={
              <ExternalLink
                href={externalLink}
                className={styles.tx__details__link}
              >
                {t("Details")} <ExternalLinkIcon fill="currentColor" />
              </ExternalLink>
            }
          />
        }
        middleItems={timelineDisplayMessages.slice(1)}
        hasNextElement
      />
    </>
  )
}

const NextHopActivity = (ibcDetails: IbcTxDetails) => {
  const { data: tx } = useIbcNextHop(ibcDetails)
  const network = useNetwork()
  const { t } = useTranslation()
  const parseMsgs = useParseMessages()

  // create a loader
  if (!tx)
    return (
      <ActivityListItem
        variant={"loading"}
        // @ts-expect-error
        chain={{}}
        msg={t("Loading IBC activity...")}
        type={t("Loading")}
        //time={t(toNow(new Date(tx.timestamp)))}
        hasTimeline={false}
      />
    )

  const explorer = network[tx.chain]?.explorer
  const externalLink = explorer?.tx?.replace("{}", tx.txhash)

  const { activityMessages, activityType } = parseMsgs(tx)

  const nextIbcDetails = getIbcTxDetails(tx)

  const timelineDisplayMessages = activityMessages.map(
    (message: ReactElement) => {
      return {
        variant: (tx.code === 0 ? "success" : "warning") as
          | "success"
          | "warning",
        msg: message,
      }
    }
  )

  return (
    <>
      <Timeline
        startOverride={
          <ActivityListItem
            variant={tx.code === 0 ? "success" : "failed"}
            chain={{
              icon: network[tx.chain].icon,
              label: network[tx.chain].name,
            }}
            msg={activityMessages[0]}
            type={t(activityType)}
            time={t(toNow(new Date(tx.timestamp)))}
            hasTimeline={!!nextIbcDetails || timelineDisplayMessages.length > 1}
            extra={
              <ExternalLink
                href={externalLink}
                className={styles.tx__details__link}
              >
                {t("Details")} <ExternalLinkIcon fill="currentColor" />
              </ExternalLink>
            }
          />
        }
        middleItems={timelineDisplayMessages.slice(1)}
        hasNextElement={!!nextIbcDetails}
      />

      {!!nextIbcDetails && <NextHopActivity {...nextIbcDetails} />}
    </>
  )
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
  logs,
}: Props) => {
  const { t } = useTranslation()

  const networks = useNetwork()
  const explorer = networks[chain ?? ""]?.explorer
  const externalLink = explorer?.tx?.replace("{}", txHash)
  const ibcDetails = getIbcTxDetails({ logs, chain })
  const prevIbcDetails = getRecvIbcTxDetails({ logs, chain })

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
        {!!prevIbcDetails && <PrevHopActivity {...prevIbcDetails} />}
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
                !!timelineDisplayMessages.length ||
                (!!ibcDetails && variant !== "failed")
              }
              extra={
                <ExternalLink
                  href={externalLink}
                  className={styles.tx__details__link}
                >
                  {t("Details")} <ExternalLinkIcon fill="currentColor" />
                </ExternalLink>
              }
            />
          }
          middleItems={timelineDisplayMessages}
          hasNextElement={!!ibcDetails && variant !== "failed"}
        />
        {!!ibcDetails && variant !== "failed" && (
          <NextHopActivity {...ibcDetails} />
        )}
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
