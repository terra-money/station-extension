import { ActivityListItem, ModalButton } from "station-ui"
import ActivityDetailsPage from "./ActivityDetailsPage"
import ActivityMessage from "./ActivityMessage"
import { useTranslation } from "react-i18next"
import { useMessages } from "./useMessages"
import { useNetwork } from "data/wallet"
import { toNow } from "utils/date"
import { last } from "ramda"

const ActivityItem = ({
  txhash,
  timestamp,
  chain,
  ...props
}: AccountHistoryItem & { chain: string }) => {
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
  // const networkName = useNetworkName()

  const canonicalMessages = useMessages({
    txhash,
    timestamp,
    ...props,
  } as any)

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

  return (
    <ModalButton
      title={t("Transaction")}
      renderButton={(open) => (
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
          timelineMessages={activityMessages.slice(1)}
        />
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
  )
}

export default ActivityItem
