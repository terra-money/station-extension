import { useAllInterchainAddresses } from "auth/hooks/useAddress"
import {
  ActivityListItem,
  ModalButton,
  StepStatus,
  TransactionTracker,
} from "@terra-money/station-ui"
import ActivityDetailsPage from "./ActivityDetailsPage"
import { getCanonicalMsg } from "@terra-money/terra-utils"
import ActivityMessage from "./ActivityMessage"
import styles from "./ActivityItem.module.scss"
import { useTranslation } from "react-i18next"
import { useNetwork } from "data/wallet"
import { toNow } from "utils/date"
import { last } from "ramda"
import { useState } from "react"
import useInterval from "utils/hooks/useInterval"
import { intervalToDuration } from "date-fns"
import { getIbcTxDetails, useIbcTxStatus } from "txs/useIbcTxs"

const useParseMessages = () => {
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

const ActivityItem = ({
  txhash,
  timestamp,
  chain,
  dateHeader,
  ...props
}: ActivityItem & {
  dateHeader: JSX.Element | null
}) => {
  const { code, tx } = props
  const success = code === 0
  const ibcDetails = getIbcTxDetails({
    txhash,
    timestamp,
    chain,
    ...props,
  })
  const isIbc = !!ibcDetails
  const { data: ibcStatus } = useIbcTxStatus(ibcDetails)
  const activityVariant = isIbc
    ? ibcStatus || "loading"
    : success
    ? "success"
    : "failed"
  const timer = useTimer(new Date(timestamp).getTime(), ibcStatus === "loading")
  const { t } = useTranslation()
  const network = useNetwork()
  const parseMsgs = useParseMessages()

  const { activityMessages, activityType } = parseMsgs({
    txhash,
    timestamp,
    chain,
    ...props,
  })

  function renderIbcStatusText() {
    if (!ibcDetails) {
      return t("Loading")
    }

    switch (activityVariant) {
      case "loading":
        return timer
      case "success":
        return t("Done!")
      default:
        return t("Error")
    }
  }

  function ibcSteps(): StepStatus[] {
    if (!ibcDetails) {
      return ["incomplete", "incomplete"]
    }

    switch (activityVariant) {
      case "loading":
        return ["completed", "inProgress"]
      case "success":
        return ["completed", "completed"]
      default:
        return ["completed", "failed"]
    }
  }

  return activityMessages.length ? (
    <div className={styles.activityitems}>
      {dateHeader}
      <ModalButton
        title={t("Transaction")}
        renderButton={(open) => (
          <div className={styles.activityitem}>
            <ActivityListItem
              onClick={open}
              variant={activityVariant}
              chain={{
                icon: network[chain].icon,
                label: network[chain].name,
              }}
              msg={activityMessages[0]}
              type={t(activityType)}
              time={isIbc ? undefined : t(toNow(new Date(timestamp)))}
              msgCount={activityMessages.slice(1).length}
            />
            {isIbc && (
              <div className={styles.transaction__progress}>
                <TransactionTracker
                  steps={ibcSteps()}
                  stepLabels={["Tx Initiated", "Tx Completed"]}
                />
                <p className={styles.transaction__timer}>
                  {renderIbcStatusText()}
                </p>
              </div>
            )}
          </div>
        )}
      >
        <ActivityDetailsPage
          variant={activityVariant}
          chain={chain}
          msg={activityMessages[0]}
          type={activityType}
          time={timestamp}
          timelineMessages={activityMessages.slice(1)}
          txHash={txhash}
          fee={tx?.auth_info?.fee?.amount ?? []}
          relatedTxs={(props.relatedTxs || []).map((tx, i) => (
            <ActivityListItem
              variant={tx.code === 0 ? "success" : "failed"}
              chain={{
                icon: network[tx.chain].icon,
                label: network[tx.chain].name,
              }}
              msg={parseMsgs(tx).activityMessages[0]}
              type={t(parseMsgs(tx).activityType)}
              time={t(toNow(new Date(timestamp)))}
              msgCount={parseMsgs(tx).activityMessages.slice(1).length}
              hasTimeline={i + 1 !== props.relatedTxs?.length}
            />
          ))}
        />
      </ModalButton>
    </div>
  ) : null
}

export default ActivityItem

/* helper */
const useTimer = (startTime: number, run: boolean) => {
  const start = new Date(startTime)
  const [now, setNow] = useState(new Date())

  useInterval(() => setNow(new Date()), run ? 1000 : null)

  const { minutes, seconds } = intervalToDuration({ start, end: now })
  return [minutes, seconds].map((str) => String(str).padStart(2, "0")).join(":")
}
