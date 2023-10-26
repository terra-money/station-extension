import {
  createActionRuleSet,
  createLogMatcherForActions,
  getTxCanonicalMsgs,
} from "@terra-money/log-finder-ruleset"
import { ActivityListItem, ModalButton } from "station-ui"
import { useNetwork, useNetworkName } from "data/wallet"
import ActivityDetailsPage from "./ActivityDetailsPage"
import { TxInfo } from "@terra-money/feather.js"
import ActivityMessage from "./ActivityMessage"
import { useTranslation } from "react-i18next"
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
  const networkName = useNetworkName()

  const ruleset = createActionRuleSet(networkName)
  const logMatcher = createLogMatcherForActions(ruleset)
  const getCanonicalMsgs = (txInfo: TxInfo) => {
    const matchedMsg = getTxCanonicalMsgs(txInfo, logMatcher)
    return matchedMsg
      ? matchedMsg
          .map((matchedLog) => matchedLog.map(({ transformed }) => transformed))
          .flat(2)
      : []
  }

  const canonicalMessages = getCanonicalMsgs({
    txhash,
    timestamp,
    ...props,
  } as any)

  let msgType = ""

  const activityMessages = canonicalMessages?.map((msg, index) => {
    if (index === 0 && msg?.msgType) {
      msgType = last(msg?.msgType.split("/")) ?? ""
    }
    return msg && <ActivityMessage msg={msg} key={index} />
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
