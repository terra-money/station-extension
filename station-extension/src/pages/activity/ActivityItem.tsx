import {
  ActivityListItem,
  ModalButton,
  StepStatus,
  TransactionTracker,
} from "@terra-money/station-ui"
import ActivityDetailsPage, { useParseMessages } from "./ActivityDetailsPage"
import styles from "./ActivityItem.module.scss"
import { useTranslation } from "react-i18next"
import { useNetwork } from "data/wallet"
import { toNow } from "utils/date"
import { useState } from "react"
import useInterval from "utils/hooks/useInterval"
import { intervalToDuration } from "date-fns"
import { getIbcTxDetails, useIbcTxStatus, usePendingIbcTx } from "txs/useIbcTxs"

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
    chain,
    ...props,
  })

  const { showStatusTxHashes } = usePendingIbcTx()
  const isIbc = !!ibcDetails
  const showStatusBar = isIbc && showStatusTxHashes.includes(txhash)
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
          chain={chain}
          msg={activityMessages[0]}
          type={activityType}
          time={timestamp}
          timelineMessages={activityMessages.slice(1)}
          txHash={txhash}
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
