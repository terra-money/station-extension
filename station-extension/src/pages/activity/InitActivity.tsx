import {
  AccountInfoProvider,
  useInitialAccountInfo,
} from "data/queries/accountInfo"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { PropsWithChildren } from "react"

const InitActivity = ({ children }: PropsWithChildren<{}>) => {
  const addresses = useInterchainAddresses()
  const { activitySorted: activity } = useInitialAccountInfo(addresses)

  return (
    <AccountInfoProvider value={[...activity]}>{children}</AccountInfoProvider>
  )
}

export default InitActivity
