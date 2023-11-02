import TxMessage from "app/containers/TxMessage"
import ActivityTxMessage from "./ActivityTxMessage"

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
