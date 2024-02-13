import {
  ActivityListItem,
  SectionHeader,
  SummaryColumn,
  SummaryTable,
  Timeline,
  ExternalLinkIcon,
} from "@terra-money/station-ui"
import {
  IbcTxDetails,
  getIbcTxDetails,
  getRecvIbcTxDetails,
  useIbcNextHop,
  useIbcPrevHop,
  useIbcTimeout,
} from "txs/useIbcTxs"
import { useAllInterchainAddresses } from "auth/hooks/useAddress"
import { getCanonicalMsg } from "@terra-money/terra-utils"
import styles from "./ActivityDetailsPage.module.scss"
import { ExternalLink } from "components/general"
import { ReadMultiple } from "components/token"
import ActivityMessage from "./ActivityMessage"
import { useTranslation } from "react-i18next"
import { useNetwork } from "data/wallet"
import { ReactElement } from "react"
import { toNow } from "utils/date"
import { last } from "ramda"
import moment from "moment"

interface Props {
  variant: "success" | "failed" | "loading"
  chain_id: string
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
      return (
        msg && <ActivityMessage chainID={tx.chain_id} msg={msg} key={index} />
      )
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

  const explorer = network[tx.chain_id]?.explorer
  const externalLink = explorer?.tx?.replace("{}", tx.tx_hash)

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
              icon: network[tx.chain_id]?.icon,
              label: network[tx.chain_id]?.name,
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
  const { data: nextTx } = useIbcNextHop(ibcDetails)
  const { data: timeoutTx } = useIbcTimeout(ibcDetails, !!nextTx)
  const tx = nextTx ?? timeoutTx
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

  const explorer = network[tx.chain_id]?.explorer
  const externalLink = explorer?.tx?.replace("{}", tx.tx_hash)

  const { activityMessages, activityType } = parseMsgs(tx)

  const nextIbcDetails = nextTx && getIbcTxDetails(nextTx)

  const timelineDisplayMessages = activityMessages.map(
    (message: ReactElement) => {
      return {
        variant: (tx.code !== 0 || !!timeoutTx ? "warning" : "success") as
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
            variant={tx.code !== 0 || !!timeoutTx ? "failed" : "success"}
            chain={{
              icon: network[tx.chain_id]?.icon,
              label: network[tx.chain_id]?.name,
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
  chain_id,
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
  const explorer = networks[chain_id ?? ""]?.explorer
  const externalLink = explorer?.tx?.replace("{}", txHash)
  const ibcDetails = getIbcTxDetails({ logs, chain_id })
  const prevIbcDetails = getRecvIbcTxDetails({ logs, chain_id })

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
    { label: "Chain", value: `${networks[chain_id]?.name} (${chain_id})` },
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
                icon: networks[chain_id]?.icon,
                label: networks[chain_id]?.name,
              }}
              msg={msg}
              type={type}
              time={toNow(new Date(time))}
              msgCount={timelineDisplayMessages.length}
              hasTimeline={!!timelineDisplayMessages.length || !!ibcDetails}
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
          hasNextElement={!!ibcDetails}
        />
        {!!ibcDetails && <NextHopActivity {...ibcDetails} />}
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
