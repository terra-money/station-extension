import Lottie from "lottie-react"
import animations, { LedgerDeviceAction, LedgerDeviceModel } from "./animations"

const LedgerAnimation = ({
  className,
  device = LedgerDeviceModel.NANOX,
  action,
}: {
  className?: string
  device?: LedgerDeviceModel
  action: LedgerDeviceAction
}) => {
  return (
    <Lottie animationData={animations[device][action]} className={className} />
  )
}

export default LedgerAnimation
