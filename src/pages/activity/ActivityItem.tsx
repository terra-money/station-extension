import { useTranslation } from "react-i18next"
import { ReadMultiple } from "components/token"
import { useNetwork, useNetworkName } from "data/wallet"
import {
  createActionRuleSet,
  createLogMatcherForActions,
  getTxCanonicalMsgs,
} from "@terra-money/log-finder-ruleset"
import { TxInfo } from "@terra-money/feather.js"
import { ActivityListItem } from "station-ui"
import { toNow } from "utils/date"
import { last } from "ramda"
import ActivityMessage from "./ActivityMessage"
import styles from "./ActivityItem.module.scss"

const ActivityItem = ({
  txhash,
  timestamp,
  chain,
  ...props
}: AccountHistoryItem & { chain: string }) => {
  const {
    code,
    tx: {
      body: { memo },
      auth_info: {
        fee: { amount: fee },
        signer_infos,
      },
    },
    raw_log,
  } = props
  const success = code === 0
  const { t } = useTranslation()
  const network = useNetwork()
  const networkName = useNetworkName()

  const data = [
    { title: t("Fee"), content: <ReadMultiple list={fee} /> },
    { title: t("Memo"), content: memo },
    { title: t("Log"), content: !success && raw_log },
  ]

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
    <div className={styles.item}>
      <ActivityListItem
        variant={success ? "success" : "failed"}
        chain={{
          icon: network[chain].icon,
          label: network[chain].name,
        }}
        msg={activityMessages[0]}
        type={activityType}
        time={toNow(new Date(timestamp))}
        timelineMessages={activityMessages.slice(1)}
      />
    </div>
  )
}

export default ActivityItem
