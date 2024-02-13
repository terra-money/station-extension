import {
  ActivityListItem,
  ModalButton,
  StepStatus,
  TransactionTracker,
} from "@terra-money/station-ui"
import { getIbcTxDetails, useIbcTxStatus, usePendingIbcTx } from "txs/useIbcTxs"
import ActivityDetailsPage, { useParseMessages } from "./ActivityDetailsPage"
import useInterval from "utils/hooks/useInterval"
import styles from "./ActivityItem.module.scss"
import { useTranslation } from "react-i18next"
import { intervalToDuration } from "date-fns"
import { useNetwork } from "data/wallet"
import { toNow } from "utils/date"
import { useState } from "react"

const ActivityItem = ({
  tx_hash,
  timestamp,
  chain_id,
  dateHeader,
  ...props
}: ActivityItem & {
  dateHeader: JSX.Element | null
}) => {
  const { code, tx } = props
  const success = code === 0
  const ibcDetails = getIbcTxDetails({
    chain_id,
    ...props,
  })

  const { showStatusTxHashes } = usePendingIbcTx()
  const isIbc = !!ibcDetails
  const showStatusBar = isIbc && showStatusTxHashes.includes(tx_hash)
  const ibcStatus = useIbcTxStatus(ibcDetails ? [ibcDetails] : [])[0]?.data

  const activityVariant = isIbc
    ? ibcStatus || "loading"
    : success
    ? "success"
    : "failed"
  const timer = useTimer(
    new Date(timestamp).getTime(),
    isIbc && activityVariant === "loading"
  )
  const { t } = useTranslation()
  const network = useNetwork()
  const parseMsgs = useParseMessages()

  const { activityMessages, activityType } = parseMsgs({
    tx_hash,
    timestamp,
    chain_id,
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
                icon: network[chain_id]?.icon,
                label: network[chain_id]?.name,
              }}
              msg={activityMessages[0]}
              type={t(activityType)}
              time={showStatusBar ? undefined : t(toNow(new Date(timestamp)))}
              msgCount={activityMessages.slice(1).length}
            />
            {showStatusBar && (
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
          chain_id={chain_id}
          msg={activityMessages[0]}
          type={activityType}
          time={timestamp}
          timelineMessages={activityMessages.slice(1)}
          txHash={tx_hash}
          fee={tx?.auth_info?.fee?.amount ?? []}
          logs={props.logs}
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
