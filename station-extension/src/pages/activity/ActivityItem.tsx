import { useInterchainAddresses } from "auth/hooks/useAddress"
import { ActivityListItem, ModalButton } from "station-ui"
import ActivityDetailsPage from "./ActivityDetailsPage"
import ActivityMessage from "./ActivityMessage"
import styles from "./ActivityItem.module.scss"
import { useTranslation } from "react-i18next"
import { useMessages } from "./useMessages"
import { useNetwork } from "data/wallet"
import { toNow } from "utils/date"
import { last } from "ramda"

const ActivityItem = ({
  txhash,
  timestamp,
  chain,
  dateHeader,
  ...props
}: AccountHistoryItem & { chain: string; dateHeader: JSX.Element | null }) => {
  const {
    code,
    tx: {
      auth_info: {
        fee: { amount: fee },
      },
    },
  } = props
  const success = code === 0
  const activityVariant = success ? "success" : "failed"
  const { t } = useTranslation()
  const network = useNetwork()
  const addresses = useInterchainAddresses() || {}

  const canonicalMessages = useMessages(
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
    return (
      msg && (
        <ActivityMessage
          chainID={network[chain].chainID}
          msg={msg}
          key={index}
        />
      )
    )
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
              variant={activityVariant}
              chain={{
                icon: network[chain].icon,
                label: network[chain].name,
              }}
              msg={activityMessages[0]}
              type={t(activityType)}
              time={t(toNow(new Date(timestamp)))}
              msgCount={activityMessages.slice(1).length}
            />
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
          fee={fee}
        />
      </ModalButton>
    </div>
  ) : null
}

export default ActivityItem
