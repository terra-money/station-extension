import ActivityTxMessage from "./ActivityTxMessage"
import TxMessage from "app/containers/TxMessage"

interface Props {
  msg: TxMessage
  chainID: string
}

const ActivityMessage = ({ msg, chainID }: Props) => {
  const { canonicalMsg } = msg

  return (
    <ActivityTxMessage chainID={chainID} key={canonicalMsg[0]}>
      {canonicalMsg[0]}
    </ActivityTxMessage>
  )
}

export default ActivityMessage
