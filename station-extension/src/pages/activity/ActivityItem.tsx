import { useInterchainAddresses } from "auth/hooks/useAddress"
import {
  ActivityListItem,
  ModalButton,
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

const ActivityItem = ({
  txhash,
  timestamp,
  chain,
  dateHeader,
  variant,
  showProgress,
  ...props
}: AccountHistoryItem & {
  chain: string
  dateHeader: JSX.Element | null
  variant?: "success" | "failed" | "loading" | "broadcasting"
  showProgress?: boolean
}) => {
  const { code, tx } = props
  const success = code === 0
  const activityVariant = variant || (success ? "success" : "failed")
  const timer = useTimer(
    new Date(timestamp).getTime(),
    variant === "loading" || variant === "broadcasting"
  )
  const { t } = useTranslation()
  const network = useNetwork()
  const addresses = useInterchainAddresses() || {}

  const canonicalMessages = getCanonicalMsg(
    {
      txhash,
      timestamp,
      ...props,
    } as any,
    addresses
  )

  let msgType = ""

  const activityMessages = canonicalMessages?.map((msg, index) => {
    if (index === 0 && msg?.msgType) {
      msgType = last(msg?.msgType.split("/")) ?? ""
    }
    return msg && <ActivityMessage chainID={chain} msg={msg} key={index} />
  })

  const activityType = msgType.charAt(0).toUpperCase() + msgType.substring(1)

  return activityMessages.length ? (
    <div className={styles.activityitems}>
      {dateHeader}
      <ModalButton
        title={t("Transaction")}
        renderButton={(open) => (
          <div className={styles.activityitem}>
            <ActivityListItem
              onClick={open}
              variant={
                activityVariant === "broadcasting" ? "loading" : activityVariant
              }
              chain={{
                icon: network[chain].icon,
                label: network[chain].name,
              }}
              msg={activityMessages[0]}
              type={t(activityType)}
              time={showProgress ? undefined : t(toNow(new Date(timestamp)))}
              msgCount={activityMessages.slice(1).length}
            />
            {showProgress && (
              <div className={styles.transaction__progress}>
                <TransactionTracker
                  steps={[
                    activityVariant === "broadcasting"
                      ? "inProgress"
                      : "completed",
                    activityVariant === "loading" ||
                    activityVariant === "broadcasting"
                      ? "incomplete"
                      : activityVariant === "success"
                      ? "completed"
                      : activityVariant,
                  ]}
                  stepLabels={["Tx Initiated", "Tx Completed"]}
                />
                <p className={styles.transaction__timer}>
                  {activityVariant === "loading" ||
                  activityVariant === "broadcasting"
                    ? timer
                    : activityVariant === "success"
                    ? t("Done!")
                    : t("Error")}
                </p>
              </div>
            )}
          </div>
        )}
      >
        <ActivityDetailsPage
          variant={activityVariant}
          chain={network[chain]}
          msg={activityMessages[0]}
          type={activityType}
          time={timestamp}
          timelineMessages={activityMessages.slice(1)}
          txHash={txhash}
          fee={tx?.auth_info?.fee?.amount ?? []}
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
