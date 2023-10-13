import TxMessage from "app/containers/TxMessage"
import ActivityTxMessage from "./ActivityTxMessage"

interface Props {
  msg: TxMessage
}

const ActivityMessage = ({ msg }: Props) => {
  const { canonicalMsg } = msg

  return (
    <ActivityTxMessage key={canonicalMsg[0]}>
      {canonicalMsg[0]}
    </ActivityTxMessage>
  )
}

export default ActivityMessage
